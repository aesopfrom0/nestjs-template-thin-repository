import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { MoodType } from '@prisma/client';
import { HelloQueryDto } from 'src/common/dto/query/hello-query.dto';
import { CreateHelloRequestDto } from 'src/common/dto/request/hello-request.dto';
import { HelloResponseDto } from 'src/common/dto/response/hello-response.dto';
import { PaginationResponseDto } from 'src/common/dto/response/pagination-response.dto';
import { HelloService } from 'src/domain/hello/hello.service';

@Controller('hello')
export class HelloController {
  constructor(private helloService: HelloService) {}

  @Get()
  async findAll(
    @Query() queryDto: HelloQueryDto,
  ): Promise<PaginationResponseDto<HelloResponseDto>> {
    return this.helloService.getHellos(queryDto);
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<HelloResponseDto> {
    return this.helloService.findHelloById(id);
  }

  @Post()
  async addHello(@Body() dto: CreateHelloRequestDto) {
    return this.helloService.addHello(dto);
  }
}
