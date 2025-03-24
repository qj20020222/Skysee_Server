// src/deepseek.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { createDeepSeek } from '@ai-sdk/deepseek';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DeepSeekService implements OnModuleInit {
   deepseek;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const apiKey = this.configService.get<string>('DEEPSEEK_API_KEY') ?? '';
    this.deepseek = createDeepSeek({ apiKey });
  }

  // 提供DeepSeek相关的API调用方法
}
