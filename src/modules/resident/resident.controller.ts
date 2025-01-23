import { Body, Controller, Get, Post } from '@nestjs/common';
import { ResidentService } from './resident.service';
import { ResidentDto } from '@/modules/resident/dto/resident.dto';

@Controller('residents')
export class ResidentController {
  constructor(private readonly residentService: ResidentService) {}

  @Post()
  async create(@Body() dto: ResidentDto) {
    return this.residentService.create(dto);
  }

  @Get()
  getAll() {
    return this.residentService.getAll();
  }
}
