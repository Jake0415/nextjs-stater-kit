---
allowed-tools:
  [
    'mcp__sequential-thinking__*',
    'mcp__context7__*',
    'Bash(npm install:*)',
    'Bash(npx prisma:*)',
    'Bash(npx drizzle-kit:*)',
    'Bash(npx supabase:*)',
  ]
---

# PRD 기반 DB 스키마 생성

PRD의 데이터 모델을 기반으로 DB 스키마를 생성한다.

## 입력

$ARGUMENTS — PRD 경로 또는 데이터 모델 설명 (예: "docs/PRD.md")

## 실행 순서

### 1단계: 데이터 모델 분석

- PRD의 "데이터 모델" 섹션 추출
- 테이블 간 관계(1:N, N:M) 분석
- Sequential Thinking으로 스키마 설계:
  - 정규화 수준 결정
  - 인덱스 전략
  - 제약 조건 (유니크, NOT NULL 등)

### 2단계: 스택 감지 및 선택

- 프로젝트에 이미 설치된 ORM 확인:
  - `prisma/` 디렉토리 존재 → Prisma
  - `drizzle.config.ts` 존재 → Drizzle
  - `@supabase/supabase-js` 설치 → Supabase
- 없으면 사용자에게 선택 요청 (Prisma / Drizzle / Supabase 중)
- Context7로 해당 ORM 최신 API 확인

### 3단계: 스키마 생성

감지된 ORM에 맞는 스키마 파일을 생성한다:

**Prisma**:
- `prisma/schema.prisma` 생성/수정
- 모델, 관계, enum 정의
- DB 클라이언트: `lib/db.ts` (PrismaClient 싱글턴)

**Drizzle**:
- `lib/db/schema.ts` 생성/수정
- 테이블, 관계 정의
- DB 클라이언트: `lib/db.ts` (Drizzle 인스턴스)

**Supabase**:
- SQL 마이그레이션 파일 생성 (`supabase/migrations/`)
- 타입 생성 안내 (`npx supabase gen types`)
- DB 클라이언트: `lib/db.ts` (Supabase 클라이언트)

### 4단계: 마이그레이션 안내

- 마이그레이션 실행 명령어 안내:
  - Prisma: `npx prisma migrate dev`
  - Drizzle: `npx drizzle-kit push`
  - Supabase: `npx supabase db push`
- 시드 데이터 생성 제안 (필요 시)
- `.env` 파일에 필요한 환경 변수 안내
