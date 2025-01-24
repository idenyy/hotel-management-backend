import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookingDto } from '@/modules/booking/dto/booking.dto';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  async checkIn(dto: BookingDto) {
    const { residentId, capacity, roomId, startDate, endDate } = dto;

    const resident = await this.prisma.resident.findUnique({
      where: { id: residentId },
      include: {
        bookings: true,
      },
    });

    if (!resident) throw new BadRequestException('Resident not found.');

    if (resident.bookings.length > 0)
      throw new ConflictException('Resident already has a booking.');

    let room;

    if (roomId) {
      room = await this.prisma.room.findUnique({
        where: { id: roomId },
        include: {
          bookings: {
            include: { resident: true },
          },
        },
      });

      if (!room) throw new BadRequestException('Selected room does not exist.');

      if (room.capacity !== capacity)
        throw new BadRequestException('Selected room capacity does not match the requested.');

      if (!room.isAvailable && room.bookings.length >= room.capacity)
        throw new BadRequestException('Selected room is not available.');

      const hasOppositeGender = room.bookings.some((b) => b.resident.gender !== resident.gender);
      if (hasOppositeGender)
        throw new BadRequestException('Room cannot accommodate residents of opposite genders.');
    } else {
      room = await this.prisma.room.findFirst({
        where: {
          capacity,
          isAvailable: true,
          bookings: {
            none: {
              OR: [
                { startDate: { lte: new Date(endDate) } },
                { endDate: { gte: new Date(startDate) } },
              ],
            },
          },
        },
        include: {
          bookings: {
            include: { resident: true },
          },
        },
      });

      if (!room)
        throw new BadRequestException('No available rooms of this type for the specified dates.');

      const hasOppositeGender = room.bookings.some((b) => b.resident.gender !== resident.gender);
      if (hasOppositeGender)
        throw new BadRequestException('Room cannot accommodate residents of opposite genders.');
    }

    const booking = await this.prisma.booking.create({
      data: {
        residentId,
        roomId: room.id,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    });

    if (room.bookings.length + 1 >= room.capacity) {
      await this.prisma.room.update({
        where: { id: room.id },
        data: { isAvailable: false },
      });
    }

    return booking;
  }

  async checkOut(bookingId: number) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { room: true },
    });

    if (!booking) throw new BadRequestException('Booking not found.');

    await this.prisma.booking.delete({ where: { id: bookingId } });

    const activeBookings = await this.prisma.booking.findMany({
      where: {
        roomId: booking.roomId,
        endDate: { gte: new Date() },
      },
    });

    if (activeBookings.length === 0) {
      await this.prisma.room.update({
        where: { id: booking.roomId },
        data: { isAvailable: true },
      });
    }

    return { message: 'Booking canceled.' };
  }

  getAll() {
    return this.prisma.booking.findMany({
      include: { resident: true, room: true },
    });
  }

  async findResidents(lastName: string) {
    return this.prisma.resident.findMany({
      where: {
        lastName: {
          startsWith: lastName,
          mode: 'insensitive',
        },
      },
      include: {
        bookings: {
          include: { room: true },
        },
      },
    });
  }

  async getRoomReport() {
    const floors = await this.prisma.floor.findMany({
      include: {
        rooms: {
          include: {
            bookings: {
              where: {
                endDate: { gte: new Date() },
              },
              include: { resident: true },
            },
          },
        },
      },
    });

    return floors.map((floor) => ({
      floorNumber: floor.number,
      rooms: floor.rooms.map((room) => ({
        capacity: room.capacity,
        isAvailable: room.isAvailable,
        activeBookings: room.bookings.map((booking) => ({
          residentName: `${booking.resident.firstName} ${booking.resident.lastName}`,
          startDate: booking.startDate,
          endDate: booking.endDate,
        })),
      })),
    }));
  }

  @Cron('0,30 * * * *')
  async releaseExpiredBookings() {
    const now = new Date();

    const expiredBookings = await this.prisma.booking.findMany({
      where: {
        endDate: { lt: now },
      },
      include: { room: true },
    });

    if (expiredBookings.length === 0) {
      console.log('No expired bookings found.');
      return;
    }

    console.log(`Found ${expiredBookings.length} expired bookings.`);

    for (const booking of expiredBookings) {
      await this.prisma.room.update({
        where: { id: booking.roomId },
        data: { isAvailable: true },
      });

      await this.prisma.booking.delete({
        where: { id: booking.id },
      });

      console.log(
        `Room with ID ${booking.roomId} has been released and booking with ID ${booking.id} deleted.`,
      );
    }

    console.log('Expired bookings processed successfully.');
  }
}
