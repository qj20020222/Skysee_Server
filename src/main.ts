import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/files',  // 这个前缀很重要
  });

  app.enableCors({
    origin: '*', // 允许所有来源 (开发时方便，生产环境应限制)
    // 或者更具体的配置：
    // origin: ['http://localhost:19006','http://10.0.2.2:19006'], // 允许的来源列表
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization', // 允许的请求头
    credentials: true, // 如果需要发送 cookies
  });
  
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
