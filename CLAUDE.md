# Figma→Code 자동 퍼블리싱 시스템

## 프로젝트 개요

Next.js 기반 웹 애플리케이션으로, Figma MCP를 통해 디자인을 자동으로 코드로 변환하는 퍼블리싱 워크플로우를 지원한다.

## 기술 스택

- **프레임워크**: Next.js 16 (App Router, Turbopack)
- **UI**: React 19 + ShadcnUI (new-york 스타일, neutral 색상)
- **스타일링**: TailwindCSS v4
- **아이콘**: lucide-react
- **테마**: next-themes (다크모드 지원)
- **언어**: TypeScript

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
lib/validations/  → Zod 스키마 (입력 검증)
hooks/            → 커스텀 훅
prisma/           → Prisma 스키마 (사용 시)
public/           → 정적 에셋
```

### 경로 별칭
- `@/components` → `components/`
- `@/lib` → `lib/`
- `@/hooks` → `hooks/`

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

## 금지 사항

- `app/globals.css`의 CSS 변수 섹션을 수동으로 직접 수정하지 않기 (디자인 토큰 동기화 커맨드 사용)
- `node_modules/` 내부 파일 수정 금지
- ShadcnUI 컴포넌트(`components/ui/`)는 가급적 원본 유지, 커스텀 필요 시 래퍼 컴포넌트 생성
- `package.json`에 불필요한 의존성 추가 금지
