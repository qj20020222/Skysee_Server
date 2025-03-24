import { HydratedDocument, Schema as MongooseSchema} from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

export type NewsArticleDocument = HydratedDocument<NewsArticle>;

@Schema()
export class NewsArticle {
  @Prop()
  _id: string;

  @Prop({ type: String, required: false }) // nullable: true translates to required: false
  description?: string;

  @Prop({ type: String, required: true })
  publishedDate: string;

  @Prop({ type: String, required: true })
  job: string;

  @Prop({ type: String, required: true })
  url: string;

  @Prop({ type: String, required: false })
  context: string;

  @Prop({ type: String, required: true })
  location: string;

  @Prop({ type: String, required: true })
  salary: string;

  @Prop({ type: String, required: true })
  company: string;

  @Prop({ type: [String]})
  topics:string[];

  @Prop({ type: String, required: false }) 
  keywords?: string;

  @Prop({ type: String, required: false }) // 改为 String, 如果 boss_info 确定是字符串
  boss_info?: string;

  @Prop({ type: String, required: false })
  original_context: string;
}

export const NewsArticleSchema = SchemaFactory.createForClass(NewsArticle);