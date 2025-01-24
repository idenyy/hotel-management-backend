import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RoomDto } from './dto/room.dto';

@Injectable()
export class RoomService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: RoomDto) {
    const floor = await this.prisma.floor.findUnique({
      where: { id: dto.floorId },
    });

    if (!floor) throw new BadRequestException('The specified floor does not exist.');

    return this.prisma.room.create({
      data: {
        capacity: dto.capacity,
        isAvailable: true,
        floorId: dto.floorId,
        amenities: dto.amenities,
      },
    });
  }

  async getAll() {
    return this.prisma.room.findMany({
      include: { floor: true },
    });
  }

  async getOne(id: number) {
    return this.prisma.room.findUnique({
      where: { id },
      include: { floor: true },
    });
  }

  async update(id: number, dto: RoomDto) {
    return this.prisma.room.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    return this.prisma.room.delete({
      where: { id },
    });
  }

  async seedRooms() {
    const floors = await Promise.all(
      Array.from({ length: 5 }, (_, index) => {
        const floorNumber = index + 1;
        return this.prisma.floor.create({
          data: {
            id: floorNumber,
            number: floorNumber,
          },
        });
      }),
    );

    for (const floor of floors) {
      await this.createRoomsForFloor(floor);
    }
  }

  private async createRoomsForFloor(floor) {
    const roomTypes: { capacity: number }[] = [
      { capacity: 1 },
      { capacity: 2 },
      { capacity: 3 },
      { capacity: 4 },
    ];

    if (floor.number === 1) {
      for (const roomType of roomTypes) {
        await this.prisma.room.create({
          data: {
            floorId: floor.id,
            capacity: roomType.capacity,
            amenities: [],
          },
        });
      }
    } else {
      for (const roomType of roomTypes) {
        await Promise.all(
          Array.from({ length: 2 }, () => {
            return this.prisma.room.create({
              data: {
                floorId: floor.id,
                capacity: roomType.capacity,
                amenities: [],
              },
            });
          }),
        );
      }
    }
  }
}
