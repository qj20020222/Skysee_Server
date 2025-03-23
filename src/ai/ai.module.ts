import { Module } from '@nestjs/common';
import { AIController } from './ai.controller';

@Module({
  imports: [],
  controllers: [AIController],
  providers: [],
})
export class AIModule {}