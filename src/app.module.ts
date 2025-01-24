import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { FloorModule } from '@/modules/floor/floor.module';
import { RoomModule } from '@/modules/room/room.module';
import { PrismaModule } from '@/modules/prisma/prisma.module';
import { FloorController } from '@/modules/floor/floor.controller';
import { RoomController } from './modules/room/room.controller';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { RoomService } from './modules/room/room.service';
import { FloorService } from './modules/floor/floor.service';
import { BookingModule } from '@/modules/booking/booking.module';
import { ResidentModule } from '@/modules/resident/resident.module';
import { ScheduleModule } from '@nestjs/schedule';
import { BookingService } from '@/modules/booking/booking.service';
import { BookingController } from '@/modules/booking/booking.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    RoomModule,
    FloorModule,
    BookingModule,
    ResidentModule,
  ],
  controllers: [AppController, RoomController, FloorController, BookingController],
  providers: [AppService, RoomService, FloorService, PrismaService, BookingService],
})
export class AppModule {}
