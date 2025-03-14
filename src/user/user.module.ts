import { Module } from '@nestjs/common';
//import { PUserssResolvers } from './user.resolvers';
import { UsersService } from './user.service';
import { PrismaModule } from '../prisma/prisma.module';

/*@Module({
  providers: [PostsResolvers, UsersService],
  imports: [PrismaModule],
})
export class PostsModule {}*/