import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { FloorDto } from '@/modules/floor/dto/floor.dto';

@Injectable()
export class FloorService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: FloorDto) {
    return this.prisma.floor.create({
      data: {
        number: dto.number,
      },
    });
  }

  async getAll() {
    return this.prisma.floor.findMany({
      include: { rooms: true },
    });
  }

  async getOne(id: number) {
    return this.prisma.floor.findUnique({
      where: { id },
      include: { rooms: true },
    });
  }

  async update(id: number, data: FloorDto) {
    return this.prisma.floor.update({ where: { id }, data });
  }

  async delete(id: number) {
    return this.prisma.floor.delete({ where: { id } });
  }
}
