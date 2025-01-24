import { IsArray, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class RoomDto {
  @IsNotEmpty()
  @IsInt()
  floorId: number;

  @IsNotEmpty()
  @IsInt()
  capacity: number;

  @IsArray()
  @IsString({ each: true })
  amenities: string[];
}
