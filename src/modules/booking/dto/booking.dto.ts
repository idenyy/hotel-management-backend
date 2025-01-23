import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class BookingDto {
  @IsNotEmpty({ message: 'Resident ID is required' })
  @IsInt({ message: 'Resident ID must be an integer' })
  residentId: number;

  @IsOptional()
  @IsInt({ message: 'Room ID must be an integer' })
  roomId?: number;

  @IsNotEmpty({ message: 'Room type is required' })
  @IsString({ message: 'Room type must be a string' })
  roomType: string;

  @IsNotEmpty({ message: 'Start date is required' })
  @IsString({ message: 'Start date must be a string' })
  startDate: string;

  @IsNotEmpty({ message: 'End date is required' })
  @IsString({ message: 'End date must be a string' })
  endDate: string;
}
