import { Directive, ID, ObjectType } from '@nestjs/graphql';
import { IsOptional, Length, MaxLength } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
@InputType()
export class NewsArticleInput {

  @Field({ nullable: true })
  @Length(0, 15)
  @IsOptional()
  description?: string;
  
  @Field(type => String, { defaultValue: '很新的信息' })
  publishedDate: string;

  @Field(type => String)
  job: string;

  @Field(type => String)
  url: string;

  @Field(type => String)
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
  @IsOptional()
  boss_info?: string;

  @Field(type => String, { nullable: true }) // 改为单个字符串, 可选
  @IsOptional()
  keywords?: string;

  @Field(type => String)
  original_context: string;
}