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

  @Post('/stream-data')
  async streamData(@Res() res: Response, @Body() requestData: Request,) {
    const {context}:{context:string} = await requestData.json();

    const result = await generateText({
          model: deepseek('deepseek-chat'),
          prompt:  `${context}\n\n根据这份岗位的要求, 薪资等信息评估一下这份工作`,
    });

    return Response.json({result});
  }
}
