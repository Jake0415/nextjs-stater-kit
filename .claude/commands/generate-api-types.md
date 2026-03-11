---
allowed-tools:
  [
    'mcp__sequential-thinking__*',
    'mcp__context7__*',
    'Bash(npm install:*)',
  ]
---

# PRD 기반 API DTO 타입 생성

PRD의 데이터 모델을 기반으로 API DTO(Data Transfer Object) 타입과 Zod 검증 스키마를 생성한다.
외부 API(FastAPI 등) 연동 프로젝트에서 `generate-schema.md`를 대체한다.

## 입력

$ARGUMENTS — PRD 경로 또는 데이터 모델 설명 (예: "docs/PRD.md")

## 실행 순서

### 1단계: 데이터 모델 분석

- PRD의 "데이터 모델" 섹션 추출
- 기존 도메인 타입 확인: `lib/types/index.ts`
- API 엔드포인트 명세 확인: `docs/API-ENDPOINTS.md`
- Sequential Thinking으로 DTO 구조 설계:
  - 도메인 모델과 API DTO의 차이점 분석
  - 요청(Request) DTO와 응답(Response) DTO 분리
  - 공통 타입 (페이지네이션, 에러 등) 식별

### 2단계: 기존 타입 확인

- `lib/types/index.ts` — 기존 도메인 타입
- `lib/api/types.ts` — 기존 API DTO 타입 (있는 경우)
- `lib/validations/` — 기존 Zod 스키마 (있는 경우)
- 중복 방지: 기존 타입과 겹치는 부분 식별

### 3단계: API DTO 타입 생성

**`lib/api/types.ts`** 에 다음을 생성:

```
// 공통 응답 타입
ApiResponse<T>
PaginatedResponse<T>
ApiError

// 도메인별 요청 DTO
[Domain]ListParams       — 목록 조회 파라미터
Create[Domain]Dto        — 생성 요청 바디
Update[Domain]Dto        — 수정 요청 바디

// 도메인별 응답 DTO
[Domain]Response         — 단건 응답 (도메인 모델과 동일하면 재사용)
[Domain]DetailResponse   — 상세 응답 (추가 필드 포함)
```

**생성 규칙**:
- 도메인 모델(`lib/types/`)과 동일한 구조면 재사용 (re-export)
- API에서만 사용되는 타입(DTO)은 `lib/api/types.ts`에 정의
- 요청 DTO는 `Partial<>`, `Pick<>`, `Omit<>` 활용으로 간결하게

### 4단계: Zod 검증 스키마 생성

**`lib/validations/`** 하위에 도메인별 파일 생성:

```
lib/validations/
├── document.ts      # 문서 관련 검증 스키마
├── ocr.ts           # OCR 관련 검증 스키마
├── template.ts      # 템플릿 관련 검증 스키마
├── auth.ts          # 인증 관련 검증 스키마
└── common.ts        # 공통 검증 (페이지네이션 등)
```

**스키마 구조**:
```typescript
// 예시
export const createDocumentSchema = z.object({
  file: z.instanceof(File)
    .refine(f => f.size <= 50 * 1024 * 1024, "파일 크기는 50MB 이하여야 합니다")
    .refine(f => f.type === "application/pdf", "PDF 파일만 업로드할 수 있습니다"),
  description: z.string().optional(),
});

export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
```

**검증 규칙**:
- 파일 업로드: 크기 제한, 타입 제한
- 문자열: 최소/최대 길이, 패턴
- 숫자: 범위 제한
- 열거형: API 명세의 허용 값과 일치

### 5단계: 엔드포인트 상수 생성

**`lib/api/endpoints.ts`** 에 API 엔드포인트 상수를 생성:

```typescript
export const API_ENDPOINTS = {
  documents: {
    list: "/api/documents",
    detail: (id: string) => `/api/documents/${id}`,
    upload: "/api/documents",
    // ...
  },
  ocr: {
    start: (documentId: string) => `/api/ocr/${documentId}/start`,
    // ...
  },
} as const;
```

### 6단계: 결과 확인

- 생성된 타입이 `docs/API-ENDPOINTS.md`와 일치하는지 검증
- `lib/types/index.ts`와의 중복 여부 확인
- Zod 스키마의 타입 추론이 DTO 타입과 일치하는지 확인
- 필요한 추가 패키지 (`zod`) 설치 안내
