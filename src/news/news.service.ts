import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import { NewsArticleInput } from './dto/create.news';
import { NewsArticleDocument } from './schemas/news.schema';
import { NewsArticle } from './model/news.model';
import { NewsArticleArgs } from './dto/new.args';

@Injectable()
export class NewsArticleService {
    constructor(@InjectModel(NewsArticle.name) private readonly NewsArticleModel: Model<NewsArticle>) {}

    async create(data: NewsArticleInput): Promise<NewsArticleDocument> {
        const createdNewsArticle = await this.NewsArticleModel.create(NewsArticleInput);
        return createdNewsArticle;
      }
    
      async findOneById(id: string|ObjectId): Promise<NewsArticleDocument|null> {
        const objectId = typeof id === 'string' ? new Types.ObjectId(id) : id;
        return this.NewsArticleModel.findOne({ _id: id }).exec();
      }
    
      async findAll(newsArticleArgs: NewsArticleArgs): Promise<NewsArticleDocument[]> {
        return this.NewsArticleModel
        .find()
        .skip(newsArticleArgs.skip)
        .limit(newsArticleArgs.take)
        .exec();
      }
    
      async remove(id: string): Promise<boolean> {
        const deleted = await this.NewsArticleModel
        .findByIdAndDelete({ _id: id })
        .exec();
        return !!deleted;
      }
      async findAllwithoutArg () : Promise<NewsArticleDocument[]> {
        return this.NewsArticleModel.find().exec();
      }

      async findbyurl(url: string): Promise<NewsArticleDocument|null> {
        return this.NewsArticleModel.findOne({ url : url }).exec();
      }

}
