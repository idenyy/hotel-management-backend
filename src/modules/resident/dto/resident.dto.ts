import { IsEnum, IsNotEmpty, IsString, ValidationArguments } from 'class-validator';
import { Gender } from '@prisma/__generated__';

export class ResidentDto {
  @IsNotEmpty({ message: 'First name is required' })
  @IsString({ message: 'First name must be a string' })
  firstName: string;

  @IsNotEmpty({ message: 'Last name is required' })
  @IsString({ message: 'Last name must be a string' })
  lastName: string;

  @IsNotEmpty({ message: 'Gender is required' })
  @IsEnum(Gender, {
    message: (args: ValidationArguments) => {
      return `Invalid gender value. Allowed values: ${Object.values(Gender).join(', ')}`;
    },
  })
  gender: Gender;
}
