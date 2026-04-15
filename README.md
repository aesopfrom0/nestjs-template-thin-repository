# NestJS Template — Thin Repository

NestJS 11 기반 서버리스(AWS Lambda) 백엔드 템플릿. Rich Service / Thin Repository 패턴을 Prisma + PostgreSQL 환경에 적용한 레퍼런스.

## 스택

- **Runtime**: Node.js 24.x (Volta), Yarn 1.22
- **Framework**: NestJS 11
- **ORM / DB**: Prisma 6 + PostgreSQL
- **Deploy**: Serverless Framework 4 (AWS Lambda + API Gateway)
- **Validation**: class-validator, Joi (env schema)
- **Test**: Jest (unit + e2e)

## 아키텍처

패턴 배경과 설계 의도는 블로그 글 참고: [레포지토리 길들이기: Thin Repository, Rich Service](https://aesopflow.com/ko/posts/taming-repositories)

- **Thin Repository**: 데이터 접근만 책임. Prisma 호출을 얇게 감싸고 비즈니스 규칙은 배제.
- **Rich Service**: 비즈니스 로직, 트랜잭션 경계, 도메인 검증 집중.
- **BaseService**: 공통 CRUD 및 예외 처리 추상화 (`src/base.service.ts`).
- **도메인 분리**: `src/domain/hello`에 샘플 도메인 구성, 실제 프로젝트에서는 치환.
- **Provider 계층**: `src/provider/database`에서 PrismaService + Repository를 전역 주입.
- **환경 분리**: `.env.local` / `.env.dev` / `.env.prod`, Joi 스키마로 부팅 시 검증.

샘플 구현:
- Rich Service — [`src/domain/hello/hello.service.ts`](src/domain/hello/hello.service.ts) (비즈니스 규칙 검증, 감정 통계, 자동 응답 생성)
- Thin Repository — [`src/provider/database/repository/hello.repository.ts`](src/provider/database/repository/hello.repository.ts) (Prisma CRUD만)
- Mapper — [`src/domain/hello/mapper/hello.mapper.ts`](src/domain/hello/mapper/hello.mapper.ts) (Prisma 모델 ↔ 도메인 DTO)

## 구조

```
src/
├── main.ts           # 로컬 엔트리포인트
├── lambda.ts         # AWS Lambda 핸들러
├── bootstrap.ts      # 공통 앱 설정
├── base.service.ts   # 공통 서비스 추상화
├── config/           # env 로딩 + Joi 검증
├── common/           # 데코레이터, 상수
├── provider/database # PrismaService + Repository
└── domain/hello      # 샘플 도메인 (Rich Service)
prisma/
├── schema.prisma
└── migrations/
```

## 관련

- 이전 버전(MongoDB + Mongoose): [nestjs-template-2026](https://github.com/aesopfrom0/nestjs-template-2026) (deprecated)
