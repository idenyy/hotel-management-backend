import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingDto } from '@/modules/booking/dto/booking.dto';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  async checkIn(@Body() dto: BookingDto) {
    return this.bookingService.checkIn(dto);
  }

  @Delete(':id')
  async cancelBooking(@Param('id') id: string) {
    return this.bookingService.checkOut(+id);
  }

  @Get()
  getAll() {
    return this.bookingService.getAll();
  }

  @Get('/residents')
  async findResidentsByLastName(@Query('lastName') lastName: string) {
    return this.bookingService.findResidents(lastName);
  }

  @Get('/report')
  async getRoomReport() {
    return this.bookingService.getRoomReport();
  }
}
