import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/provider/database/prisma.service';
import { Prisma } from '@prisma/client';
import { HelloQueryDto } from 'src/common/dto/query/hello-query.dto';
import { ByeRequestDto } from 'src/common/dto/request/bye-request.dto';
import { HelloResponseDto } from 'src/common/dto/response/hello-response.dto';
import { PaginationResponseDto } from 'src/common/dto/response/pagination-response.dto';
import {
  CreateHelloRequestDto,
  UpdateHelloRequestDto,
} from 'src/common/dto/request/hello-request.dto';

@Injectable()
export class HelloRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateHelloRequestDto) {
    return this.prisma.hello.create({
      data,
    });
  }

  async findAll(queryDto: HelloQueryDto = {}): Promise<PaginationResponseDto<HelloResponseDto>> {
    // 기본 조건
    const where: Prisma.HelloWhereInput = {};
    const { ids, message, moodTypes, skip, take, orderBy } = queryDto;

    // 쿼리 파라미터가 있으면 where 조건에 추가
    if (ids?.length) {
      where.id = { in: ids };
    }
    if (message) {
      where.message = { contains: message };
    }
    if (moodTypes?.length) {
      where.mood = { in: moodTypes };
    }

    // 정렬 옵션 구성
    const orderByOption: Prisma.HelloOrderByWithRelationInput = {};
    if (orderBy) {
      // 동적으로 orderBy 옵션 구성
      for (const [key, value] of Object.entries(orderBy)) {
        orderByOption[key] = value;
      }
    }

    // 결과 및 총 개수 동시에 조회
    const [items, totalCount] = await Promise.all([
      this.prisma.hello.findMany({
        where,
        skip: skip !== undefined ? skip : undefined,
        take: take !== undefined ? take : undefined,
        orderBy: orderByOption,
        include: {
          byes: true,
        },
      }),
      this.prisma.hello.count({ where }),
    ]);

    const currentPage = skip / take + 1;
    const totalPages = Math.ceil(totalCount / take);

    // 페이지네이션 정보와 함께 응답
    return {
      items,
      pagination: {
        totalCount,
        skip: skip || 0,
        take: take || items.length,
        currentPage,
        totalPages,
        hasPreviousPage: currentPage > 1,
        hasNextPage: currentPage < totalPages,
      },
    };
  }

  async findById(id: number): Promise<HelloResponseDto> {
    return this.prisma.hello.findUnique({
      where: { id },
      include: {
        byes: true,
      },
    });
  }

  async findOne(queryDto: HelloQueryDto = {}): Promise<HelloResponseDto> {
    // 기본 조건
    const where: Prisma.HelloWhereInput = {};

    const { message, moodTypes } = queryDto;

    // 쿼리 파라미터 적용 (ids는 무시)
    if (message) where.message = { contains: message };
    if (moodTypes?.length) where.mood = { in: moodTypes };

    return this.prisma.hello.findFirst({
      where,
      include: {
        byes: true,
      },
    });
  }

  async update(id: number, data: UpdateHelloRequestDto) {
    return this.prisma.hello.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return this.prisma.hello.delete({
      where: { id },
    });
  }

  async createBye(helloId: number, data: ByeRequestDto) {
    return this.prisma.bye.create({
      data: {
        ...data,
        hello: {
          connect: { id: helloId },
        },
      },
    });
  }
}
