import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomDto } from './dto/room.dto';

@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  create(@Body() dto: RoomDto) {
    return this.roomService.create(dto);
  }

  @Get()
  findAll() {
    return this.roomService.getAll();
  }

  @Get('start')
  async start() {
    return await this.roomService.seedRooms();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomService.getOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: RoomDto) {
    return this.roomService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomService.remove(+id);
  }
}
