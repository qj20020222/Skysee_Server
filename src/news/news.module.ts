import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NewsArticleResolver } from './news.resolver';
import { NewsArticleService } from './news.service';
import { NewsArticle,NewsArticleSchema } from './schemas/news.schema';
import { FileController } from './Upload-File.controller';
import { S3Service } from './s3.service';
@Module({
  imports: [MongooseModule.forFeature([{ name: NewsArticle.name, schema: NewsArticleSchema}])],
  providers: [NewsArticleService, NewsArticleResolver, S3Service],
  controllers:[FileController],
})
export class NewsArticleModule {}