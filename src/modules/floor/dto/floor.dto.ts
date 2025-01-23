import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class FloorDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  number: number;
}
