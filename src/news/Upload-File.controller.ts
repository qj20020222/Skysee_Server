import {
    Body,
    Controller,
    Get,
    HttpStatus,
    MaxFileSizeValidator,
    ParseFilePipe,
    Post,
    UploadedFile,
    UseInterceptors,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { Express } from 'express';
import { CustomFileValidator } from './FileValidator/fileValidator';
import { promises as fs } from 'fs';
import { diskStorage } from 'multer'; // Import diskStorage
import * as path from 'path'; // Import the path module
import { S3Service } from 'src/news/s3.service';
import { S3Client } from '@aws-sdk/client-s3';
import * as multerS3 from 'multer-s3';

@Controller()
export class FileController {
  private s3Client: S3Client;
  private readonly bucketName = 'your-bucket-name';
constructor() {
  // 初始化 S3 客户端
  this.s3Client = new S3Client({
    region: 'us-east-1', // 例如 'us-east-1'
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
  });
}

@Post('upload')
@UseInterceptors(FileInterceptor('file', {
  storage:  multerS3({
    s3: new S3Client({
      region: 'us-east-1', // 例如 'us-east-1'
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    }),
    bucket: 'us-east-1',
    contentType: multerS3.AUTO_CONTENT_TYPE, // Specify the destination directory
    filename: (req, file, cb) => {
      const decodedName = decodeURIComponent(file.originalname);
      // Generate a unique filename (optional, but recommended)
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(decodedName);
      const filename1 = `${path.basename(decodedName, ext)}-${uniqueSuffix}${ext}`;
      const filename = filename1.replace(" ", "-");
      cb(null, filename);
    },
  }),
}))
 uploadFile(
  @UploadedFile(
    new ParseFilePipe({
      validators: [
        new CustomFileValidator({ 
          allowedExtensions: ['pdf', 'doc', 'docx'] 
        }),
        // 组合大小验证器
        new MaxFileSizeValidator({ maxSize: 10485760 }),
      ],
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
    })
  )
  file: Express.Multer.File,
 ) { 
  console.log('接收到上传请求');
  const fileUrl = `http://10.0.2.2:3000/files/${file.filename}`;
  console.log('filee', file.filename);
 return{
   file: {
    originalname: file.originalname,
    filename: file.filename,
    path: file.path,
    size: file.size,
    mimetype: file.mimetype,
    url:fileUrl
  }
};
}
}


