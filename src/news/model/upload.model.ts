import { Field, ObjectType } from '@nestjs/graphql';
//import { GraphQLUpload, FileUpload } from 'graphql-upload';

// 用于 GraphQL schema 的 Upload 标量类型
//export const Upload = GraphQLUpload;

// 上传结果类型
@ObjectType()
export class FileUploadResult {
  @Field()
  filename: string;

  @Field()
  originalname: string;

  @Field()
  size: number;

  @Field({ nullable: true })
  message?: string;
}
