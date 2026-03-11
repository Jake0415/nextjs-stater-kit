# Figma→Code 자동 퍼블리싱 시스템

## 프로젝트 개요

Next.js 기반 웹 애플리케이션으로, Figma MCP를 통해 디자인을 자동으로 코드로 변환하는 퍼블리싱 워크플로우를 지원한다.

## 기술 스택

### 프론트엔드
- **프레임워크**: Next.js 16 (App Router, Turbopack)
- **UI**: React 19 + ShadcnUI (new-york 스타일, neutral 색상)
- **스타일링**: TailwindCSS v4
- **아이콘**: lucide-react
- **테마**: next-themes (다크모드 지원)
- **언어**: TypeScript

### 백엔드
- **프레임워크**: FastAPI (Python, 포트 8000)
- **아키텍처**: DDD + 레이어드/클린 아키텍처
- **인증**: JWT Bearer 토큰 (관리자/기본 계정 2종)
- **API prefix**: `/api/v1/...`
- **데이터 삭제 정책**: Soft delete (deleted_at 타임스탬프)
- **자동 API 문서**: `/docs` (Swagger UI), `/redoc`
- **데이터 검증**: Pydantic

### 데이터베이스
- **PostgreSQL**: document, metadata, user 등 관계형 데이터
- **MongoDB**: OCR 결과 raw data (컬렉션: documents, toc_nodes, retrieval_chunks, generation_chunks, entities)
- **MinIO**: 이미지 파일 오브젝트 스토리지

### 인프라
- **웹서버**: Nginx (리버스 프록시)
- **배포 구조**: Nginx → Next.js (프론트, 포트 3000) + FastAPI (백엔드, 포트 8000)

## 코딩 컨벤션

### 컴포넌트
- React Server Components 기본, 클라이언트 컴포넌트는 `"use client"` 명시
- 함수 컴포넌트 + `export default function` 또는 named export 사용
- Props는 인라인 타입 또는 별도 interface로 정의

### 스타일링
- TailwindCSS v4 유틸리티 클래스만 사용
- 인라인 `style={{}}` 사용 금지
- 반응형: `sm:`, `md:`, `lg:` 프리픽스 활용 (모바일 퍼스트)
- 다크모드: `dark:` 프리픽스 또는 CSS 변수 활용

### ShadcnUI
- 설정: `components.json` (new-york 스타일, neutral baseColor, lucide 아이콘)
- 컴포넌트 경로: `@/components/ui/`
- 새 컴포넌트 추가 시 반드시 ShadcnUI MCP 또는 `npx shadcn@latest add` 사용

### 파일 구조
```
app/              → 페이지 및 라우팅 (App Router)
app/api/          → API 라우트 핸들러
components/ui/    → ShadcnUI 컴포넌트 (자동 생성, 직접 수정 최소화)
components/layout/→ 레이아웃 컴포넌트 (Header, Footer, Nav)
components/features/ → 기능별 커스텀 컴포넌트
lib/              → 유틸리티, 상수, 헬퍼 함수
lib/actions/      → Server Actions
lib/db.ts         → DB 클라이언트
lib/api/          → HTTP 클라이언트, 엔드포인트 상수, DTO 타입
lib/services/     → 서비스 추상화 (interface + mock/ + real/)
lib/validations/  → Zod 스키마 (입력 검증)
hooks/            → 커스텀 훅
prisma/           → Prisma 스키마 (사용 시)
public/           → 정적 에셋
```

### 경로 별칭
- `@/components` → `components/`
- `@/lib` → `lib/`
- `@/hooks` → `hooks/`

## 프론트엔드 ↔ 백엔드 통신 규약

### API 클라이언트 패턴
- `lib/services/` 서비스 추상화 패턴 (인터페이스 → Mock/Real 구현체)
- `NEXT_PUBLIC_API_MODE` (mock/real)로 자동 전환
- 상세: `docs/API-CLIENT.md` 참조

### API 호출 규칙
- 인증: `Authorization: Bearer <JWT>` 헤더 자동 주입
- 파일 업로드: `multipart/form-data` (PDF, 최대 50MB)
- OCR 상태 폴링: `/api/v1/ocr/{documentId}/status`, 2초 간격
- 에러 표시: `sonner` 토스트
- 비동기 작업: OCR 실행 시 `202 Accepted` 응답 후 폴링

### 개발 환경 프록시
- `next.config.ts` rewrites: `/api/v1/*` → `http://localhost:8000/api/v1/*`
- 프로덕션: Nginx에서 리버스 프록시 처리

## MCP 서버 활용 가이드

| 상황 | 사용할 MCP |
|------|-----------|
| Figma 디자인 데이터 추출 | `figma` |
| ShadcnUI 컴포넌트 검색/설치 | `shadcn` |
| 구현 결과 시각 검증/스크린샷 | `playwright` |
| 라이브러리 최신 API 문서 확인 | `context7` |
| 복잡한 설계 문제 단계별 분석 | `sequential-thinking` |
| API/DB 스키마 설계 분석 | `sequential-thinking` |
| ORM/DB 최신 API 확인 | `context7` |
| 작업 계획/추적/검증 | `shrimp-task-manager` |

## 전체 개발 워크플로우

1. **PRD 작성** (`/prd-generator`) — Figma URL + 서비스 설명 포함
2. **로드맵 생성** (`/development-planner`)
3. **DB 스키마 생성** (`/generate-schema`) — PRD 데이터 모델 기반
4. **UI 퍼블리싱** (`/figma-to-code PRD#페이지명`) — Figma 디자인 → 코드 변환
5. **API/Actions 생성** (`/generate-api PRD#페이지명`) — 데이터 요구사항 기반
6. **시각 검증** (`/verify-design`) — Playwright 스크린샷 비교

## Figma→Code 워크플로우 요약

1. **Figma MCP** → 디자인 데이터 추출
2. **Sequential Thinking** → 컴포넌트 구조 분석
3. **ShadcnUI MCP** → 매핑 가능한 컴포넌트 탐색 및 설치
4. **Context7 MCP** → Next.js/TailwindCSS API 참조
5. **코드 생성** → TSX + TailwindCSS 유틸리티 클래스
6. **Playwright MCP** → 시각 검증 (데스크톱 1280px + 모바일 375px)

## DocumentStatus 매핑

| 백엔드 (Python Enum) | 프론트엔드 (TypeScript) | 설명 |
|----------------------|----------------------|------|
| `UPLOADED` | `uploaded` | 업로드 완료 |
| `UPLOAD_FAIL` | `upload_fail` | 업로드 실패 (프론트 추가 필요) |
| `OCR_EXTRACTING` | `ocr_processing` | OCR 진행 중 |
| `OCR_ACTED` | `ocr_completed` | OCR 완료 |
| `OCR_EXTRACT_FAIL` | `ocr_failed` | OCR 실패 |

> 변환 로직은 `lib/services/real/` 응답 변환 레이어에서 처리.
> `lib/types/index.ts`에 `upload_fail` 추가 필요, `draft` 상태 제거 또는 재정의 필요.

## OCR 파이프라인 개요

백엔드 D2V (Document→Vector) 9단계 파이프라인. 프론트엔드는 4단계로 추상화하여 진행률 표시:

| 프론트 단계 | 백엔드 Stage | 설명 |
|-----------|------------|------|
| preprocessing | Stage 0 | PyMuPDF PDF 파싱 |
| text_extraction | Stage 1-4 | 세그먼테이션, TOC |
| llm_analysis | Stage 5-6 | 청킹, 엔티티, gpt-4o 비전 |
| metadata_synthesis | Stage 7 | 임베딩 생성 |

### OCR 결과 데이터 (프론트 소비용)
- `sections[]`: section_id, title, content, page_number, keyword
- `images[]`: name, description, image_url, tag[], type (image/chart/diagram/equation)
- `table[]`: name, table_md (마크다운 문자열)

## Figma 디자인 충실 퍼블리싱 규칙 (필수)

> **최우선 원칙**: UI 퍼블리싱 시 Figma 디자인이 유일한 기준이다. 임의로 레이아웃, 컴포넌트 구조, 스타일을 변경하거나 추가/생략하지 않는다.

### 필수 준수 사항

1. **Figma 우선**: 페이지/컴포넌트를 생성하거나 수정할 때, 반드시 Figma MCP (`get_design_context`, `get_screenshot`)로 최신 디자인을 먼저 확인한다
2. **1:1 매칭**: Figma에 있는 요소만 구현하고, Figma에 없는 요소(체크박스, 추가 버튼 등)를 임의로 추가하지 않는다
3. **레이아웃 정합성**: 컬럼 구조, 그룹핑, 구분선, 카드 경계 등 레이아웃 구조를 Figma와 동일하게 유지한다
4. **스타일 정합성**: 색상, 폰트 굵기, 간격, 라운드, 그림자 등 시각적 속성을 Figma 값 기준으로 적용한다
5. **시각 검증**: 구현 후 반드시 Playwright 스크린샷과 Figma 스크린샷을 비교하여 차이점을 확인한다
6. **차이 발생 시**: Figma 디자인과 구현 결과가 다르면 즉시 수정한다. 의도적 차이가 필요한 경우 사용자에게 확인을 받는다

### 금지

- Figma를 확인하지 않고 "예상"으로 UI를 구현하는 행위
- Figma에 없는 UI 요소를 "편의성" 목적으로 임의 추가하는 행위
- Figma의 레이아웃 구조를 "더 나을 것 같아서" 임의 변경하는 행위

## 금지 사항

- `app/globals.css`의 CSS 변수 섹션을 수동으로 직접 수정하지 않기 (디자인 토큰 동기화 커맨드 사용)
- `node_modules/` 내부 파일 수정 금지
- ShadcnUI 컴포넌트(`components/ui/`)는 가급적 원본 유지, 커스텀 필요 시 래퍼 컴포넌트 생성
- `package.json`에 불필요한 의존성 추가 금지
- 프론트엔드에서 백엔드 DB 직접 접근 금지 (반드시 REST API 경유)
- `lib/types/` 도메인 타입과 `lib/api/` DTO 타입을 혼용하지 않기
- 백엔드 API 응답을 컴포넌트에서 직접 사용하지 않기 (서비스 레이어 경유)

## 관련 문서

| 문서 | 경로 | 설명 |
|------|------|------|
| API 엔드포인트 명세 | `docs/API-ENDPOINTS.md` | REST API 상세 |
| API 클라이언트 아키텍처 | `docs/API-CLIENT.md` | Mock↔Real 전환 가이드 |
| 컴포넌트 매핑 | `docs/COMPONENT-MAP.md` | Figma → 컴포넌트 매핑 |
| 개발 로드맵 | `.claude/agents/docs/ROADMAP.md` | Phase 0~7 작업 계획 |
