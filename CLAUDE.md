# MH-OCR-AI 모노리포

## 프로젝트 개요

문서 OCR 처리 및 관리 웹 애플리케이션. Figma MCP를 통해 디자인을 자동으로 코드로 변환하는 퍼블리싱 워크플로우를 지원한다.

## 모노리포 구조

```
nextjs-figma-starter-kit/           (모노리포 루트)
├── .claude/                        (공유 — Claude Code 설정)
├── docs/                           (공유 — 프로젝트 문서)
├── front-end/                      (Next.js 프론트엔드)
│   └── CLAUDE.md                   (프론트엔드 전용 규칙)
└── back-end/                       (FastAPI 백엔드)
    └── CLAUDE.md                   (백엔드 전용 규칙)
```

## 기술 스택 요약

| 영역 | 스택 |
|------|------|
| 프론트엔드 | Next.js 16, React 19, TailwindCSS v4, ShadcnUI |
| 백엔드 | FastAPI (Python), JWT 인증 |
| 데이터베이스 | PostgreSQL, MongoDB, MinIO |
| 인프라 | Nginx (리버스 프록시) |

## 인프라 구조

- **배포**: Nginx → Next.js (포트 3000) + FastAPI (포트 8000)
- **개발**: `front-end/next.config.ts` rewrites로 `/api/v1/*` → `http://localhost:8000/api/v1/*` 프록시

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
| `UPLOAD_FAIL` | `upload_fail` | 업로드 실패 |
| `OCR_EXTRACTING` | `ocr_processing` | OCR 진행 중 |
| `OCR_ACTED` | `ocr_completed` | OCR 완료 |
| `OCR_EXTRACT_FAIL` | `ocr_failed` | OCR 실패 |

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

## 관련 문서

| 문서 | 경로 | 설명 |
|------|------|------|
| API 엔드포인트 명세 | `docs/API-ENDPOINTS.md` | REST API 상세 |
| API 클라이언트 아키텍처 | `docs/API-CLIENT.md` | Mock↔Real 전환 가이드 |
| 컴포넌트 매핑 | `docs/COMPONENT-MAP.md` | Figma → 컴포넌트 매핑 |
| 개발 로드맵 | `.claude/agents/docs/ROADMAP.md` | Phase 0~7 작업 계획 |
| 프론트엔드 규칙 | `front-end/CLAUDE.md` | 프론트엔드 전용 컨벤션 |
| 백엔드 규칙 | `back-end/CLAUDE.md` | 백엔드 전용 컨벤션 |
