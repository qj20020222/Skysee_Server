import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { DirectiveLocation, GraphQLDirective } from 'graphql';
//import { upperDirectiveTransformer } from './common/directives/upper-case.directive';
import { NewsArticleModule } from './news/news.module';
import { Controller, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { MulterModule } from '@nestjs/platform-express';
import  { ConfigModule, ConfigService} from '@nestjs/config';
import * as multer from 'multer';
import { extname } from 'path';
import { FileController } from './news/Upload-File.controller';
import { AIModule } from './ai/ai.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 使 ConfigService 全局可用
    }),

  /*  MulterModule.registerAsync({
      imports: [ConfigModule],
      
      useFactory: async (configService: ConfigService) => ({       
        storage: multer.diskStorage({
          destination: (req, file, callback) => {
            const uploadPath = configService.get<string>('UPLOAD_PATH');
            console.log("环境变量是", uploadPath)
            if (uploadPath === undefined) {
              callback(null, './uploads');
            } else {
              callback(null, uploadPath);
            }
          },
          filename: (req, file, callback) => {
            const decodedName = decodeURIComponent(file.originalname);
            console.log("解码后的文件名:", decodedName);
            // 生成唯一文件名
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(decodedName);
            callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
          },
        }),
        limits: {
          fileSize: configService.get<number>('MAX_FILE_SIZE'),
        },
      }),
      inject: [ConfigService],
    }), */
    
    NewsArticleModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      //transformSchema: schema => upperDirectiveTransformer(schema, 'upper'),
      installSubscriptionHandlers: true,
      buildSchemaOptions: {
        directives: [
          new GraphQLDirective({
            name: 'upper',
            locations: [DirectiveLocation.FIELD_DEFINITION],
          }),
        ],
      },
    }),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: 'mongodb://127.0.0.1:27017/NewsArticles',
        onConnectionCreate: (connection: Connection) => {
          // Register event listeners here
          connection.on('connected', () => console.log('成功连上!'));
          connection.on('open', () => console.log('打开'));
          connection.on('disconnected', () => console.log('关闭连接'));
          connection.on('reconnected', () => console.log('再次连接!'));
          connection.on('disconnecting', () => console.log('没连上...'));
          return connection;
        },
      }),
    }),   
    AIModule
  ],
})
export class AppModule {}
