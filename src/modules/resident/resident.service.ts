import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { ResidentDto } from '@/modules/resident/dto/resident.dto';

@Injectable()
export class ResidentService {
  constructor(private prisma: PrismaService) {}

  async create(dto: ResidentDto) {
    return this.prisma.resident.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        gender: dto.gender,
      },
    });
  }

  async getAll() {
    return this.prisma.resident.findMany({
      include: { bookings: true },
    });
  }
}
