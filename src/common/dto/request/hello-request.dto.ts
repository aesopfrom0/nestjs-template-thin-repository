import { IsOptional, IsString, IsEnum } from 'class-validator';
import { MoodType } from '@prisma/client';

export class CreateHelloRequestDto {
  @IsString()
  message: string;

  @IsEnum(MoodType)
  mood: MoodType;
}

export class UpdateHelloRequestDto {
  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsEnum(MoodType)
  mood?: MoodType;
}
