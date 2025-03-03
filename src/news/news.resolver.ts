import { NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { NewsArticleInput } from './dto/create.news';
//import pdf from 'pdf-parse';   这是ES Modules的方式！
import { NewsArticle } from './model/news.model';
import { NewsArticleService } from './news.service';
import { NewsArticleArgs } from './dto/new.args';
import { FileUploadResult } from './model/upload.model';
import * as fs from 'fs/promises';
import axios from 'axios';
import { ObjectId } from 'mongoose';
import { ApolloError } from 'apollo-server-express';
import * as path from 'path';
const pubSub = new PubSub();

@Resolver(of => NewsArticle)
export class NewsArticleResolver {
    constructor(private readonly NewsArticleService: NewsArticleService) {}

    @Query(returns => NewsArticle)
    async findArticlebyid(@Args('id') id: string): Promise<NewsArticle> {
      const NewsArticle = await this.NewsArticleService.findOneById(id);
      if (!NewsArticle) {
        throw new NotFoundException(id);
      }
      return NewsArticle;
    }

    @Query(returns => [NewsArticle])
    async findurlarray(@Args('urls',  { type: () => [String] }) urls: string[]): Promise<NewsArticle[]> {
      if (urls.length === 0) { return [] }
  
      // 使用 Promise.all 并行处理所有查询
      const results = await Promise.all(
        urls.map(async url => {
          //const objectId = new ObjectId(id);
          const doc = await this.NewsArticleService.findbyurl(url);
          console.log(doc);
          return doc ? doc : null;
        })
      );
      
      // 过滤掉 null 结果
      const articles = results.filter(article => article !== null) as NewsArticle[];
      
      return articles;
    }

    @Query(returns => [NewsArticle])
    findall(@Args() newsArticleArgs: NewsArticleArgs): Promise<NewsArticle[]> {
      return this.NewsArticleService.findAll(newsArticleArgs);
    }

    @Query(returns => [NewsArticle])
    async findbytopic(@Args('topic') topic: string,   @Args() newsArticleArgs: NewsArticleArgs):Promise<NewsArticle[]>{
        const allArticles = await this.NewsArticleService.findAll(newsArticleArgs);
        const filteredArticle = allArticles.filter(Article =>
        Article.topics.some(ing => ing.toLowerCase().includes(topic.toLowerCase())));
        return filteredArticle;
    }
    
    @Mutation(returns => NewsArticle)
    async addArticle(
      @Args('newinputdata') newinputdata: NewsArticleInput,
    ): Promise<NewsArticle> {
      const newsArticle = await this.NewsArticleService.create(newinputdata);
      pubSub.publish('newsAdded', { newsAdded: newsArticle });
      return newsArticle;
    }

    @Mutation(returns => Boolean)
    async removeArticle(@Args('id') id: string) {
      return this.NewsArticleService.remove(id);
    }

    @Subscription(returns => NewsArticle)
    recipeAdded() {
      return pubSub.asyncIterableIterator('recipeAdded');
    } 


    @Query(returns => [NewsArticle])
    async findbyCV(
      @Args('filename') filename: string,
      @Args('filetype') filetype: string,
    ): Promise<NewsArticle[]> {
      const allArticles = await this.NewsArticleService.findAllwithoutArg();
      const pdf= require('pdf-parse');
      const mammoth = require('mammoth');
      let extractedText = '';
      try {
        if (filetype === 'application/pdf') {
          const filepath = path.join(process.cwd(), 'uploads', filename);
          console.log("Absolute filepath:", filepath);         
          const dataBuffer = await fs.readFile(filepath);    
          const data = await pdf(dataBuffer);
          console.log("data:", data);
          extractedText = data.text;        
        } else if (
          filetype ===
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ) {
          const filepath = path.join(process.cwd(), 'uploads', filename);
          const result = await mammoth.extractRawText({ path: filepath });
          extractedText = result.value;
        }
      } catch (error) {
          if (error instanceof Error) {
              if (error.message.startsWith('PDF解析错误')) {
                  throw new ApolloError(error.message, 'PDF_PARSE_ERROR');
              } else  {
                throw new ApolloError(
                  `读取或解析文件时发生未知错误: ${error.message}`,
                  'UNKNOWN_FILE_ERROR',
                );
              }
          } else {
              throw new ApolloError(`发生未知的错误: ${String(error)}`, 'UNKNOWN_ERROR');
          }
      }
  
      // 创建一个包含所有请求的 Promise 数组
      const articlePromises = allArticles.slice(0,400).map(async (article) => {
        try {
          const response = await axios.post(
            'http://192.168.99.182:5000/api/function',
            {
              param1: article.original_context,
              param2: extractedText,
            },
          );
          return {
            article,
            score: response.data.results,
             // 假设响应数据是 { score: number }[]
          };
        } catch (error) {
          // 错误处理
          if (axios.isAxiosError(error)) {
            console.error(
              `文章ID ${article.id} Axios 请求错误: ${error.message}`,
              {
                url: 'http://192.168.99.182:5000/api/function',
                params: { param1: article.original_context, param2: extractedText },
                responseStatus: error.response?.status,
                responseData: error.response?.data.results,
              },
            );
          } else {
            console.error(`文章ID ${article.id} 请求错误:`, error);
          }
  
          return {
            article,
            score: null, // 使用 null 表示错误
          };
        }
      }
    );
  
      // 等待所有请求完成
      const results = await Promise.all(articlePromises);
      
      // 筛选出 score 大于 0.7 的文章
      const highScoreArticles = results
        .filter((result) => result.score !== null && result.score > 0.9)
        .map((result) => result.article);
      console.log('成功', highScoreArticles);
      return highScoreArticles;
    }
  }

  



