# 프론트엔드 (Next.js)

## 기술 스택

- **프레임워크**: Next.js 16 (App Router, Turbopack)
- **UI**: React 19 + ShadcnUI (new-york 스타일, neutral 색상)
- **스타일링**: TailwindCSS v4
- **아이콘**: lucide-react
- **테마**: next-themes (다크모드 지원)
- **언어**: TypeScript

## 실행 방법

```bash
cd front-end/
npm install
npm run dev      # http://localhost:3000
npm run build    # 프로덕션 빌드
npm run lint     # ESLint 검사
```

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
- **주의**: `front-end/` 디렉토리에서 실행해야 함

### 파일 구조
```
app/              → 페이지 및 라우팅 (App Router)
app/api/          → API 라우트 핸들러
components/ui/    → ShadcnUI 컴포넌트 (자동 생성, 직접 수정 최소화)
components/layout/→ 레이아웃 컴포넌트 (Header, Footer, Nav)
components/features/ → 기능별 커스텀 컴포넌트
lib/              → 유틸리티, 상수, 헬퍼 함수
lib/actions/      → Server Actions
lib/api/          → HTTP 클라이언트, 엔드포인트 상수, DTO 타입
lib/services/     → 서비스 추상화 (interface + mock/ + real/)
lib/validations/  → Zod 스키마 (입력 검증)
hooks/            → 커스텀 훅
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

## Figma 디자인 충실 퍼블리싱 규칙 (필수)

> **최우선 원칙**: UI 퍼블리싱 시 Figma 디자인이 유일한 기준이다. 임의로 레이아웃, 컴포넌트 구조, 스타일을 변경하거나 추가/생략하지 않는다.

### 필수 준수 사항

1. **Figma 우선**: 페이지/컴포넌트를 생성하거나 수정할 때, 반드시 Figma MCP (`get_design_context`, `get_screenshot`)로 최신 디자인을 먼저 확인한다
2. **1:1 매칭**: Figma에 있는 요소만 구현하고, Figma에 없는 요소를 임의로 추가하지 않는다
3. **레이아웃 정합성**: 컬럼 구조, 그룹핑, 구분선, 카드 경계 등을 Figma와 동일하게 유지한다
4. **스타일 정합성**: 색상, 폰트 굵기, 간격, 라운드, 그림자 등을 Figma 값 기준으로 적용한다
5. **시각 검증**: 구현 후 반드시 Playwright 스크린샷과 Figma 스크린샷을 비교하여 차이점을 확인한다
6. **차이 발생 시**: Figma 디자인과 구현 결과가 다르면 즉시 수정한다

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
