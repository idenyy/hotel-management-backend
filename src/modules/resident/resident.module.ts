import { Module } from '@nestjs/common';
import { ResidentService } from './resident.service';
import { ResidentController } from './resident.controller';
import { PrismaService } from '@/modules/prisma/prisma.service';

@Module({
  controllers: [ResidentController],
  providers: [ResidentService, PrismaService],
})
export class ResidentModule {}
