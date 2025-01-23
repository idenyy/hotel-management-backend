import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { FloorService } from './floor.service';
import { FloorDto } from '@/modules/floor/dto/floor.dto';

@Controller('floors')
export class FloorController {
  constructor(private readonly floorService: FloorService) {}

  @Post()
  async create(@Body() dto: FloorDto) {
    return await this.floorService.create(dto);
  }

  @Get()
  getAll() {
    return this.floorService.getAll();
  }

  @Get(':id')
  async getFloorById(@Param('id') id: string) {
    return await this.floorService.getOne(+id);
  }

  @Put(':id')
  async updateFloor(@Param('id') id: string, @Body() body: FloorDto) {
    return await this.floorService.update(+id, body);
  }

  @Delete(':id')
  async deleteFloor(@Param('id') id: string) {
    return await this.floorService.delete(+id);
  }
}
