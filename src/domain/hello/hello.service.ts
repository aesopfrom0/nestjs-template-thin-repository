import { Injectable } from '@nestjs/common';
import { MoodType } from '@prisma/client';
import { BaseService } from 'src/base.service';
import { HelloQueryDto } from 'src/common/dto/query/hello-query.dto';
import { CreateHelloRequestDto } from 'src/common/dto/request/hello-request.dto';
import { HelloResponseDto } from 'src/common/dto/response/hello-response.dto';
import { PaginationResponseDto } from 'src/common/dto/response/pagination-response.dto';
import { HelloRepository } from 'src/provider/database/repository/hello.repository';

@Injectable()
export class HelloService extends BaseService {
  constructor(private helloRepository: HelloRepository) {
    super();
  }

  async addHello(dto: CreateHelloRequestDto) {
    return await this.helloRepository.create(dto);
  }

  async getHellos(queryDto: HelloQueryDto = {}): Promise<PaginationResponseDto<HelloResponseDto>> {
    return await this.helloRepository.findAll(queryDto);
  }

  async findHelloById(id: number) {
    return await this.helloRepository.findById(id);
  }

  async findHappyHellos() {
    // 행복한 기분의 Hello만 찾기
    const queryDto: HelloQueryDto = {
      moodTypes: [MoodType.HAPPY],
    };
    return await this.helloRepository.findAll(queryDto);
  }

  async findPositiveHellos() {
    // 긍정적인 기분의 Hello 찾기 (HAPPY 또는 EXCITED)
    const queryDto: HelloQueryDto = {
      moodTypes: [MoodType.HAPPY, MoodType.EXCITED],
    };
    return await this.helloRepository.findAll(queryDto);
  }
}
