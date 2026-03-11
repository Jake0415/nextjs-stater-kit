# API 엔드포인트 명세

## 개요

백엔드(FastAPI)에서 제공하는 REST API 엔드포인트 명세서.
프론트엔드에서 Mock↔Real 전환 시 이 명세를 기준으로 구현한다.

**베이스 URL**: `NEXT_PUBLIC_API_URL` (예: `http://localhost:8000`)

> FastAPI 자동 문서: `{베이스 URL}/docs` (Swagger UI), `{베이스 URL}/redoc` (ReDoc)

---

## 공통 사항

### 인증 헤더

```
Authorization: Bearer <JWT_TOKEN>
```

### 공통 응답 형식

```typescript
// 성공
interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

// 페이지네이션 응답
interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 에러
interface ApiError {
  status: number;
  code: string;
  message: string;
  details?: Record<string, string[]>;  // 필드별 에러
}
```

---

## 1. 문서 (Documents)

### GET `/api/v1/documents` — 문서 목록

| 항목 | 값 |
|------|---|
| 인증 | 필요 |
| 설명 | 필터, 정렬, 페이지네이션 적용된 문서 목록 조회 |

**Query Parameters**:

| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|---------|------|------|--------|------|
| `page` | number | ❌ | 1 | 페이지 번호 |
| `pageSize` | number | ❌ | 10 | 페이지당 항목 수 |
| `status` | string | ❌ | - | 상태 필터 (`uploaded`, `ocr_processing`, `ocr_completed`, `ocr_failed`, `draft`) |
| `search` | string | ❌ | - | 파일명/설명 검색어 |
| `sortBy` | string | ❌ | `uploadedAt` | 정렬 기준 (`filename`, `uploadedAt`, `updatedAt`, `fileSize`) |
| `sortOrder` | string | ❌ | `desc` | 정렬 순서 (`asc`, `desc`) |
| `dateFrom` | string | ❌ | - | 기간 필터 시작일 (ISO 8601) |
| `dateTo` | string | ❌ | - | 기간 필터 종료일 (ISO 8601) |

**응답**: `PaginatedResponse<Document>`

```typescript
interface Document {
  id: string;
  filename: string;
  description: string;
  status: "uploaded" | "ocr_processing" | "ocr_completed" | "ocr_failed" | "draft";
  version: string;
  fileSize: number;
  pageCount: number;
  uploadedBy: User;
  uploadedAt: string;       // ISO 8601
  updatedAt: string;        // ISO 8601
  ocrProgress?: number;     // 0~100 (status=ocr_processing일 때)
  templateId?: string;
}
```

---

### GET `/api/v1/documents/{id}` — 문서 상세

| 항목 | 값 |
|------|---|
| 인증 | 필요 |

**Path Parameters**: `id` — 문서 ID

**응답**: `ApiResponse<DocumentDetail>`

```typescript
interface DocumentDetail extends Document {
  versions: VersionHistory[];
  ocrResult?: OcrResultSummary;
}

interface VersionHistory {
  version: string;
  uploadedAt: string;
  uploadedBy: User;
  fileSize: number;
  changeType: "major" | "minor";
}
```

---

### POST `/api/v1/documents` — 문서 업로드

| 항목 | 값 |
|------|---|
| 인증 | 필요 |
| Content-Type | `multipart/form-data` |

**Request Body (FormData)**:

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `file` | File | ✅ | PDF 파일 (최대 50MB) |
| `description` | string | ❌ | 문서 설명 |

**응답**: `ApiResponse<Document>` (201 Created)

**에러 코드**:

| 코드 | 설명 |
|------|------|
| `FILE_TOO_LARGE` | 파일 크기 50MB 초과 |
| `INVALID_FILE_TYPE` | PDF가 아닌 파일 |

---

### PATCH `/api/v1/documents/{id}` — 메타데이터 수정

| 항목 | 값 |
|------|---|
| 인증 | 필요 |

**Request Body**:

```typescript
interface UpdateMetadataDto {
  description?: string;
}
```

**응답**: `ApiResponse<Document>`

---

### DELETE `/api/v1/documents/{id}` — 문서 삭제

| 항목 | 값 |
|------|---|
| 인증 | 필요 |

**응답**: `ApiResponse<null>` (204 No Content)

---

### POST `/api/v1/documents/{id}/version` — 버전 업데이트

| 항목 | 값 |
|------|---|
| 인증 | 필요 |
| Content-Type | `multipart/form-data` |

**Request Body (FormData)**:

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `file` | File | ✅ | 새 버전 PDF 파일 |
| `changeType` | string | ✅ | `major` 또는 `minor` |
| `description` | string | ❌ | 변경 설명 |

**응답**: `ApiResponse<Document>`

---

## 2. OCR

### POST `/api/v1/ocr/{documentId}/start` — OCR 시작

| 항목 | 값 |
|------|---|
| 인증 | 필요 |

**Request Body**:

```typescript
interface StartOcrDto {
  templateId: string;
}
```

**응답**: `ApiResponse<OcrProgress>`

```typescript
interface OcrProgress {
  documentId: string;
  currentStage: "preprocessing" | "text_extraction" | "llm_analysis" | "metadata_synthesis";
  stageProgress: number;   // 0~100
  logs: OcrLog[];
  startedAt: string;
}

interface OcrLog {
  timestamp: string;
  stage: string;
  message: string;
  level: "info" | "warning" | "error";
}
```

**에러 코드**:

| 코드 | 설명 |
|------|------|
| `DOCUMENT_NOT_FOUND` | 문서 없음 |
| `OCR_ALREADY_RUNNING` | 이미 OCR 진행 중 |
| `TEMPLATE_NOT_FOUND` | 템플릿 없음 |

---

### GET `/api/v1/ocr/{documentId}/status` — OCR 진행 상태

| 항목 | 값 |
|------|---|
| 인증 | 필요 |

**응답**: `ApiResponse<OcrProgress>`

> 폴링 주기 권장: 2초

---

### POST `/api/v1/ocr/{documentId}/cancel` — OCR 취소

| 항목 | 값 |
|------|---|
| 인증 | 필요 |

**응답**: `ApiResponse<null>`

---

### GET `/api/v1/ocr/{documentId}/result` — OCR 결과

| 항목 | 값 |
|------|---|
| 인증 | 필요 |

**응답**: `ApiResponse<OcrResult>`

```typescript
interface OcrResult {
  documentId: string;
  completedAt: string;
  totalSections: number;
  totalImages: number;
  averageConfidence: number;
  metadata: Record<string, string>;
}
```

---

### GET `/api/v1/ocr/{documentId}/sections` — 섹션 목록

| 항목 | 값 |
|------|---|
| 인증 | 필요 |

**응답**: `ApiResponse<Section[]>`

```typescript
interface Section {
  id: string;
  documentId: string;
  pageNumber: number;
  type: "text" | "table" | "image";
  content: string;
  confidence: number;
  tags: string[];
}
```

---

### GET `/api/v1/ocr/{documentId}/images` — 추출 이미지

| 항목 | 값 |
|------|---|
| 인증 | 필요 |

**응답**: `ApiResponse<SectionImage[]>`

```typescript
interface SectionImage {
  id: string;
  sectionId: string;
  filename: string;
  description: string;
  source: string;
  pageNumber: number;
  tags: string[];
  thumbnailUrl: string;
}
```

---

## 3. 통계 (Statistics)

### GET `/api/v1/statistics/overview` — 통계 개요 (KPI)

| 항목 | 값 |
|------|---|
| 인증 | 필요 |

**응답**: `ApiResponse<Statistics>`

```typescript
interface Statistics {
  totalUploads: number;
  totalUploadsTrend: number;      // 전월 대비 변화율 (%)
  ocrCompleted: number;
  ocrCompletedTrend: number;
  pendingTasks: number;
  pendingTasksTrend: number;
}
```

---

### GET `/api/v1/statistics/monthly` — 월별 OCR 통계

| 항목 | 값 |
|------|---|
| 인증 | 필요 |

**Query Parameters**:

| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|---------|------|------|--------|------|
| `months` | number | ❌ | 6 | 조회할 개월 수 |

**응답**: `ApiResponse<MonthlyOcrData[]>`

```typescript
interface MonthlyOcrData {
  month: string;       // "YYYY-MM"
  completed: number;
  failed: number;
}
```

---

### GET `/api/v1/statistics/users` — 사용자별 통계

| 항목 | 값 |
|------|---|
| 인증 | 필요 |

**응답**: `ApiResponse<UserStats[]>`

```typescript
interface UserStats {
  user: User;
  documentsProcessed: number;
  successRate: number;    // 0~100
}
```

---

### GET `/api/v1/statistics/detail` — 통계 상세

| 항목 | 값 |
|------|---|
| 인증 | 필요 |

**Query Parameters**:

| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|---------|------|------|--------|------|
| `dateFrom` | string | ❌ | - | 시작일 (ISO 8601) |
| `dateTo` | string | ❌ | - | 종료일 (ISO 8601) |
| `groupBy` | string | ❌ | `daily` | 그룹 (`daily`, `weekly`, `monthly`) |

**응답**: `ApiResponse<DetailStatistics>`

```typescript
interface DetailStatistics {
  summary: Statistics;
  timeline: TimelineData[];
  topDocumentTypes: DocumentTypeCount[];
  errorDistribution: ErrorTypeCount[];
}

interface TimelineData {
  date: string;
  uploads: number;
  ocrCompleted: number;
  ocrFailed: number;
}

interface DocumentTypeCount {
  type: string;
  count: number;
}

interface ErrorTypeCount {
  errorCode: string;
  count: number;
  description: string;
}
```

---

## 4. 템플릿 (Templates)

### GET `/api/v1/templates` — 템플릿 목록

| 항목 | 값 |
|------|---|
| 인증 | 필요 |

**응답**: `ApiResponse<Template[]>`

```typescript
interface Template {
  id: string;
  name: string;
  codeNumber: string;
  description: string;
  createdAt: string;
}
```

---

### POST `/api/v1/templates` — 템플릿 생성

| 항목 | 값 |
|------|---|
| 인증 | 필요 (admin) |

**Request Body**:

```typescript
interface CreateTemplateDto {
  name: string;
  codeNumber: string;
  description: string;
}
```

**응답**: `ApiResponse<Template>` (201 Created)

---

### DELETE `/api/v1/templates/{id}` — 템플릿 삭제

| 항목 | 값 |
|------|---|
| 인증 | 필요 (admin) |

**응답**: `ApiResponse<null>` (204 No Content)

**에러 코드**:

| 코드 | 설명 |
|------|------|
| `TEMPLATE_IN_USE` | 사용 중인 템플릿 삭제 불가 |

---

## 5. 설정 (Settings)

### GET `/api/v1/settings/profile` — 프로필 조회

| 항목 | 값 |
|------|---|
| 인증 | 필요 |

**응답**: `ApiResponse<UserProfile>`

```typescript
interface UserProfile extends User {
  email: string;
  department: string;
  createdAt: string;
}
```

---

### PATCH `/api/v1/settings/profile` — 프로필 수정

| 항목 | 값 |
|------|---|
| 인증 | 필요 |

**Request Body**:

```typescript
interface UpdateProfileDto {
  name?: string;
  email?: string;
  department?: string;
}
```

**응답**: `ApiResponse<UserProfile>`

---

## 6. 로그 (Logs)

### GET `/api/v1/logs` — 활동 로그

| 항목 | 값 |
|------|---|
| 인증 | 필요 |

**Query Parameters**:

| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|---------|------|------|--------|------|
| `page` | number | ❌ | 1 | 페이지 번호 |
| `pageSize` | number | ❌ | 20 | 페이지당 항목 수 |
| `type` | string | ❌ | - | 로그 타입 필터 (`upload`, `ocr`, `delete`, `update`, `login`, `export`) |
| `userId` | string | ❌ | - | 사용자 필터 |
| `dateFrom` | string | ❌ | - | 시작일 |
| `dateTo` | string | ❌ | - | 종료일 |

**응답**: `PaginatedResponse<ActivityLog>`

```typescript
interface ActivityLog {
  id: string;
  type: "upload" | "ocr" | "delete" | "update" | "login" | "export";
  message: string;
  user: User;
  timestamp: string;
}
```

---

### GET `/api/v1/logs/export` — 로그 CSV 내보내기

| 항목 | 값 |
|------|---|
| 인증 | 필요 |
| Content-Type (응답) | `text/csv` |

**Query Parameters**: `/api/v1/logs`와 동일 (페이지네이션 제외)

**응답**: CSV 파일 다운로드

---

## 7. 인증 (Auth)

### POST `/api/v1/auth/login` — 로그인

| 항목 | 값 |
|------|---|
| 인증 | 불필요 |

**Request Body**:

```typescript
interface LoginDto {
  username: string;
  password: string;
}
```

**응답**: `ApiResponse<AuthTokens>`

```typescript
interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;       // 초 단위
}
```

**에러 코드**:

| 코드 | 설명 |
|------|------|
| `INVALID_CREDENTIALS` | 잘못된 계정 정보 |
| `ACCOUNT_LOCKED` | 계정 잠김 |

---

### POST `/api/v1/auth/refresh` — 토큰 갱신

| 항목 | 값 |
|------|---|
| 인증 | 불필요 |

**Request Body**:

```typescript
interface RefreshTokenDto {
  refreshToken: string;
}
```

**응답**: `ApiResponse<AuthTokens>`

---

## 8. 관리 (Admin)

### DELETE `/api/v1/admin/data` — 데이터 초기화

| 항목 | 값 |
|------|---|
| 인증 | 필요 (admin) |

**Request Body**:

```typescript
interface DataResetDto {
  target: "documents" | "logs" | "all";
  confirmText: string;     // "데이터 초기화" 입력 필요
}
```

**응답**: `ApiResponse<null>`

**에러 코드**:

| 코드 | 설명 |
|------|------|
| `INVALID_CONFIRM_TEXT` | 확인 텍스트 불일치 |
| `INSUFFICIENT_PERMISSION` | 관리자 권한 없음 |

---

## 엔드포인트 요약

| # | 메서드 | 엔드포인트 | 설명 |
|---|--------|-----------|------|
| 1 | GET | `/api/v1/documents` | 문서 목록 |
| 2 | GET | `/api/v1/documents/{id}` | 문서 상세 |
| 3 | POST | `/api/v1/documents` | 문서 업로드 |
| 4 | PATCH | `/api/v1/documents/{id}` | 메타데이터 수정 |
| 5 | DELETE | `/api/v1/documents/{id}` | 문서 삭제 |
| 6 | POST | `/api/v1/documents/{id}/version` | 버전 업데이트 |
| 7 | POST | `/api/v1/ocr/{documentId}/start` | OCR 시작 |
| 8 | GET | `/api/v1/ocr/{documentId}/status` | OCR 진행 상태 |
| 9 | POST | `/api/v1/ocr/{documentId}/cancel` | OCR 취소 |
| 10 | GET | `/api/v1/ocr/{documentId}/result` | OCR 결과 |
| 11 | GET | `/api/v1/ocr/{documentId}/sections` | 섹션 목록 |
| 12 | GET | `/api/v1/ocr/{documentId}/images` | 추출 이미지 |
| 13 | GET | `/api/v1/statistics/overview` | 통계 개요 |
| 14 | GET | `/api/v1/statistics/monthly` | 월별 통계 |
| 15 | GET | `/api/v1/statistics/users` | 사용자별 통계 |
| 16 | GET | `/api/v1/statistics/detail` | 통계 상세 |
| 17 | GET | `/api/v1/templates` | 템플릿 목록 |
| 18 | POST | `/api/v1/templates` | 템플릿 생성 |
| 19 | DELETE | `/api/v1/templates/{id}` | 템플릿 삭제 |
| 20 | GET | `/api/v1/settings/profile` | 프로필 조회 |
| 21 | PATCH | `/api/v1/settings/profile` | 프로필 수정 |
| 22 | GET | `/api/v1/logs` | 활동 로그 |
| 23 | GET | `/api/v1/logs/export` | 로그 CSV 내보내기 |
| 24 | POST | `/api/v1/auth/login` | 로그인 |
| 25 | POST | `/api/v1/auth/refresh` | 토큰 갱신 |
| 26 | DELETE | `/api/v1/admin/data` | 데이터 초기화 |
