import { openai } from '@ai-sdk/openai';
import { Body, Controller, Post, Res} from '@nestjs/common';
import { pipeDataStreamToResponse, streamText } from 'ai';
import { generateText } from 'ai';
import { deepseek } from '@ai-sdk/deepseek';
import { Response } from 'express';

@Controller()
export class AIController {
  @Post('/root')
  async root(@Res() res: Response) {
    const result = streamText({
      model: openai('gpt-4o'),
      prompt: 'Invent a new holiday and describe its traditions.',
    });

    result.pipeDataStreamToResponse(res);
  }

  @Post('/ai-generate')
  async streamData(@Body() body: any) {
    try {
      const { originalcontext, keywords } = body;
      const result = await generateText({
        model: deepseek('deepseek-chat'),
        prompt: `${originalcontext}${keywords}\n\n根据这份岗位的要求, 薪资等信息评估一下这份工作`,
      });
      console.log('originalcontext:',originalcontext);
      console.log('generateText result type:', typeof result);
      const textContent = result.text || JSON.stringify(result);

      return { text: textContent };
    } catch (error) {
      console.error('Error generating text:', error);
      return {
        error: 'Failed to generate text. Please try again later.',
        details: error.message
      };
    }
  }
}
