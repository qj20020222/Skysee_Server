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

@Controller()
export class FileController {

@Post('upload')
@UseInterceptors(FileInterceptor('file', {
  storage: diskStorage({
    destination: './uploads', // Specify the destination directory
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