import { FileValidator } from '@nestjs/common';

export class CustomFileValidator extends FileValidator {
  constructor(protected readonly validationOptions: Record<string, any>) {
    super(validationOptions);
  }

  isValid(file: Express.Multer.File): boolean | Promise<boolean> {
    // 首先检查文件是否存在
    if (!file) {
      return this.validationOptions.allowEmpty === true;
    }
    if (!file.originalname) {
        return false;
      }

    // 实现验证逻辑
    // 例如：检查文件扩展名
    const fileName: string = file.originalname;
    const allowedExtensions:string[] = this.validationOptions.allowedExtensions || [];
    
    // 安全地获取扩展名
    const fileExtParts: string[] = fileName.split('.');
    const fileExt: string = fileExtParts.length > 1 
    ? fileExtParts.pop()?.toLowerCase() || ''
    : '';
  
    
    return allowedExtensions.includes(fileExt);
  }

  buildErrorMessage(file: Express.Multer.File): string {
    // 如果文件不存在
    if (!file) {
      return 'File is required';
    }

    // 构建错误消息
    return `File ${file.originalname} has an invalid extension. Allowed extensions: ${this.validationOptions.allowedExtensions.join(', ')}`;
  }
}
