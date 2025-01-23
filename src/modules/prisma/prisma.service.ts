import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/__generated__';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    try {
      await this.$connect();
      console.log('Prisma Client connected');
    } catch (error) {
      console.error('Failed to connect Prisma Client:', error);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
