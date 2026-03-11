# API 클라이언트 아키텍처

## 개요

백엔드가 FastAPI(Python)로 별도 개발되므로, **서비스 추상화 패턴**으로 Mock↔Real 전환을 지원한다. 프론트엔드는 Mock 데이터 기반으로 UI를 먼저 완성한 후, 환경변수 하나로 실제 API로 전환한다.

---

## 디렉토리 구조

```
lib/
├── api/
│   ├── client.ts          # HTTP 클라이언트 (fetch 래퍼, JWT, 에러 핸들링)
│   ├── types.ts           # API 요청/응답 타입 (DTO)
│   └── endpoints.ts       # API 엔드포인트 상수
├── services/
│   ├── interface.ts       # 서비스 인터페이스 정의
│   ├── mock/              # Mock 구현 (lib/mock 데이터 활용)
│   │   ├── document.service.ts
│   │   ├── ocr.service.ts
│   │   ├── statistics.service.ts
│   │   ├── template.service.ts
│   │   └── auth.service.ts
│   ├── real/              # 실제 API 구현
│   │   ├── document.service.ts
│   │   ├── ocr.service.ts
│   │   ├── statistics.service.ts
│   │   ├── template.service.ts
│   │   └── auth.service.ts
│   └── index.ts           # 팩토리 (NEXT_PUBLIC_API_MODE로 전환)
├── actions/               # Server Actions (서비스 호출 래퍼)
│   ├── document.actions.ts
│   ├── ocr.actions.ts
│   └── template.actions.ts
├── mock/                  # Mock 데이터 (기존)
│   └── index.ts
├── types/                 # 도메인 타입 (기존)
│   └── index.ts
└── validations/           # Zod 검증 스키마
    ├── document.ts
    ├── ocr.ts
    └── template.ts
```

---

## 환경변수

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000    # 백엔드 API 베이스 URL
NEXT_PUBLIC_API_MODE=mock                    # mock | real
```

- `mock` — `lib/services/mock/` 구현 사용, 네트워크 요청 없음
- `real` — `lib/services/real/` 구현 사용, `NEXT_PUBLIC_API_URL`로 요청

---

## HTTP 클라이언트 설계

### `lib/api/client.ts`

```typescript
// 핵심 구조 (구현 시 참조)
interface ApiClientConfig {
  baseUrl: string;
  getToken: () => string | null;
}

interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

interface ApiError {
  status: number;
  code: string;
  message: string;
}
```

**기능**:
- `fetch` 래퍼 (GET, POST, PUT, PATCH, DELETE)
- JWT 토큰 자동 주입 (`Authorization: Bearer <token>`)
- 요청/응답 인터셉터
- 에러 핸들링 (401 → 토큰 갱신 시도 → 로그인 리다이렉트)
- 타임아웃 설정
- multipart/form-data 지원 (파일 업로드)

---

## 서비스 추상화 패턴

### 1. 인터페이스 정의 (`lib/services/interface.ts`)

```typescript
// 각 도메인별 서비스 인터페이스
interface IDocumentService {
  getList(params: DocumentListParams): Promise<PaginatedResponse<Document>>;
  getById(id: string): Promise<Document>;
  upload(data: FormData): Promise<Document>;
  updateMetadata(id: string, data: UpdateMetadataDto): Promise<Document>;
  delete(id: string): Promise<void>;
  updateVersion(id: string, data: FormData): Promise<Document>;
}

interface IOcrService {
  start(documentId: string, templateId: string): Promise<OcrProgress>;
  getStatus(documentId: string): Promise<OcrProgress>;
  cancel(documentId: string): Promise<void>;
  getResult(documentId: string): Promise<OcrResult>;
  getSections(documentId: string): Promise<Section[]>;
  getImages(documentId: string): Promise<SectionImage[]>;
}

interface IStatisticsService {
  getOverview(): Promise<Statistics>;
  getMonthly(): Promise<MonthlyOcrData[]>;
  getUserStats(): Promise<UserStats[]>;
  getDetail(params: DetailParams): Promise<DetailData>;
}

interface ITemplateService {
  getList(): Promise<Template[]>;
  create(data: CreateTemplateDto): Promise<Template>;
  delete(id: string): Promise<void>;
}

interface IAuthService {
  login(credentials: LoginDto): Promise<AuthTokens>;
  refresh(refreshToken: string): Promise<AuthTokens>;
  getProfile(): Promise<User>;
}
```

### 2. Mock 구현 (`lib/services/mock/`)

- `lib/mock/index.ts`의 기존 Mock 데이터 활용
- `setTimeout`으로 네트워크 지연 시뮬레이션 (200~500ms)
- 상태 변경은 메모리에서 처리 (페이지 새로고침 시 초기화)

### 3. Real 구현 (`lib/services/real/`)

- `lib/api/client.ts`의 HTTP 클라이언트 사용
- `lib/api/endpoints.ts`의 엔드포인트 상수 참조
- 응답 DTO → 도메인 모델 변환

### 4. 팩토리 (`lib/services/index.ts`)

```typescript
// 환경변수에 따라 서비스 구현체 선택
const apiMode = process.env.NEXT_PUBLIC_API_MODE || "mock";

export function getDocumentService(): IDocumentService {
  return apiMode === "real"
    ? new RealDocumentService()
    : new MockDocumentService();
}

// ... 다른 서비스도 동일 패턴
```

---

## Server Actions 패턴

### `lib/actions/document.actions.ts`

```typescript
"use server";

// Server Actions는 서비스 레이어를 호출하는 래퍼
// 입력 검증 (Zod) → 서비스 호출 → revalidatePath

export async function uploadDocument(formData: FormData) {
  // 1. Zod로 입력 검증
  // 2. getDocumentService().upload(formData)
  // 3. revalidatePath("/files")
  // 4. 결과 반환
}
```

---

## Mock↔Real 전환 가이드

### 전환 절차

1. 백엔드 API 서버 실행 확인
2. `.env.local` 수정:
   ```env
   NEXT_PUBLIC_API_URL=http://api.example.com
   NEXT_PUBLIC_API_MODE=real
   ```
3. `lib/services/real/` 구현체가 모든 인터페이스를 충족하는지 확인
4. 개발 서버 재시작 (`npm run dev`)

### 점진적 전환

도메인별로 독립 전환이 필요한 경우:

```env
NEXT_PUBLIC_API_MODE_DOCUMENT=real
NEXT_PUBLIC_API_MODE_OCR=mock        # OCR API 아직 미완성
NEXT_PUBLIC_API_MODE_STATISTICS=real
```

팩토리에서 도메인별 환경변수를 우선 확인하고, 없으면 `NEXT_PUBLIC_API_MODE`를 폴백으로 사용.

---

## 에러 핸들링

| HTTP 상태 | 처리 방식 |
|-----------|---------|
| 400 Bad Request | 입력 검증 에러 표시 (필드별) |
| 401 Unauthorized | 토큰 갱신 시도 → 실패 시 로그인 리다이렉트 |
| 403 Forbidden | 권한 없음 안내 |
| 404 Not Found | 리소스 없음 안내 |
| 409 Conflict | 충돌 안내 (버전 등) |
| 500 Internal Server Error | 일반 에러 안내 + 재시도 옵션 |

에러 메시지는 `sonner` 토스트로 표시.

---

## FastAPI 백엔드 특성

- 자동 API 문서: `{API_URL}/docs` (Swagger UI), `{API_URL}/redoc` (ReDoc)
- Pydantic 기반 요청/응답 검증 (프론트 Zod와 별도)
- 비동기 지원 (async/await)

---

## 관련 문서

- API 엔드포인트 상세: `docs/API-ENDPOINTS.md`
- 컴포넌트 매핑: `docs/COMPONENT-MAP.md`
- 전체 로드맵: `docs/ROADMAP.md`
