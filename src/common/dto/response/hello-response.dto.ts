import { MoodType } from '@prisma/client';

export class HelloResponseDto {
  id: number;
  message: string;
  mood: MoodType;
  timestamp: Date;
  byes: ByeResponseDto[];
}

export class ByeResponseDto {
  id: number;
  message: string;
  mood: MoodType;
  waveCount: number;
}
