---
allowed-tools:
  [
    'mcp__sequential-thinking__*',
    'mcp__context7__*',
    'Bash(npm install:*)',
    'Bash(npx prisma:*)',
    'Bash(npx drizzle-kit:*)',
  ]
---

# PRD 기반 API / Server Actions 생성

PRD의 페이지별 데이터 요구사항을 기반으로 API 라우트 또는 Server Actions를 생성한다.

## 입력

$ARGUMENTS — PRD 경로#페이지명 또는 기능 설명 (예: "docs/PRD.md#회원가입 페이지")

## 실행 순서

### 1단계: 요구사항 분석

- PRD에서 해당 페이지의 데이터 요구사항 추출
- 필요한 API 엔드포인트 / Server Actions 목록 도출
- Sequential Thinking으로 구조 설계:
  - 읽기 데이터 → GET API 또는 Server Component 데이터 페칭
  - 쓰기 데이터 → Server Action 또는 POST/PUT/DELETE API
  - 입력 검증 스키마 (Zod) 설계

### 2단계: 기존 코드 확인

- 프로젝트의 백엔드 스택 자동 감지:
  - `prisma/` 존재 → Prisma 사용
  - `lib/db/schema.ts` 존재 → Drizzle 사용
  - `@supabase/supabase-js` 설치 → Supabase 사용
  - 감지 실패 시 → 사용자에게 선택 요청
- 기존 API 라우트(`app/api/`) 및 Server Actions(`lib/actions/`) 확인
- 재사용 가능한 코드 파악

### 3단계: 코드 생성

감지된 스택에 맞는 코드를 생성한다:

**API Routes** (`app/api/` 하위):
- RESTful 패턴 준수
- 입력 검증: Zod 스키마 적용
- 에러 처리: NextResponse로 적절한 상태 코드 반환

**Server Actions** (`lib/actions/` 하위):
- `"use server"` 지시어 포함
- 입력 검증: Zod 스키마 적용
- revalidatePath/revalidateTag로 캐시 무효화

**공통 생성물**:
- 입력 검증 스키마: `lib/validations/` 하위에 Zod 스키마 파일
- 관련 타입 정의: 필요 시 생성

### 4단계: 연동 안내

- 생성된 API/Actions를 기존 UI에 연동하는 방법 안내
- 필요한 추가 패키지 설치 안내
- figma-to-code로 생성된 TODO 주석과의 매핑 설명
