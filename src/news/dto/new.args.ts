import { ArgsType, Field, Int } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';

@ArgsType()
export class NewsArticleArgs {
  @Field(type => Int)
  @Min(0)
  skip = 0;

  @Field(type => Int)
  @Min(1)
  @Max(500)
  take = 300;
}