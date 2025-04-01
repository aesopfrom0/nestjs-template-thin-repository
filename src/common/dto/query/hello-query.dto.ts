import { IsOptional, IsString, IsEnum, IsArray } from 'class-validator';
import { MoodType } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dto/query/pagination-query.dto';

export class HelloQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsArray()
  @IsEnum(Number, { each: true })
  ids?: number[];

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsArray()
  @IsEnum(MoodType, { each: true })
  moodTypes?: MoodType[];
}
