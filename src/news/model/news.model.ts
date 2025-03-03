import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import{Types, ObjectId} from 'mongoose';

@ObjectType({ description: 'newsArticle' })
export class NewsArticle {
  @Field(type => ID)
  _id:string;

  @Field({ nullable: true })
  description?: string;
  
  @Field(type => String)
  publishedDate: string;

  @Field(type => String)
  job: string;

  @Field(type => String)
  url: string;

  @Field(type => String, { defaultValue: '' })
  context: string;

  @Field(type => String)
  location:string;

  @Field(type => String)
  salary:string;

  @Field(type => String)
  company:string;

  @Field(() => [String], { defaultValue: [] })
  topics: string[];

  @Field(type => String, { nullable: true }) // 改为 String, 如果 boss_info 确定是字符串
  boss_info?: string;
  
  @Field(type => String, { nullable: true }) // 改为单个字符串, 可选
  keywords?: string;
  
  @Field(type => String)
  original_context: string;
}