import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';

export class UsersService {
    constructor(private prisma: PrismaService) {}

    async findOne(userid: number): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: {
              userid,
            },
          });
    }

    async createUser(data: Prisma.UserCreateInput): Promise<User> {
        return this.prisma.user.create({
          data,
        });
      }
}
