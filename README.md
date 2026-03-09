# Figma→Code 자동 퍼블리싱 시스템

Figma 디자인을 Next.js + ShadcnUI + TailwindCSS 코드로 자동 변환하는 퍼블리싱 워크플로우 시스템입니다.

## 기술 스택

- **프레임워크**: Next.js 16 (App Router, Turbopack)
- **UI**: React 19 + ShadcnUI (new-york 스타일)
- **스타일링**: TailwindCSS v4
- **아이콘**: lucide-react
- **테마**: next-themes (다크모드 지원)
- **언어**: TypeScript

## 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 결과를 확인할 수 있습니다.

## 슬래시 커맨드

Claude Code에서 사용할 수 있는 슬래시 커맨드입니다.

| 커맨드 | 설명 |
|--------|------|
| `/figma-to-code` | Figma 디자인을 분석하여 코드로 자동 변환 |
| `/verify-design` | 구현된 페이지를 Playwright로 시각 검증 |
| `/add-component` | ShadcnUI 컴포넌트 검색 및 설치 |
| `/sync-design-tokens` | Figma 디자인 토큰을 CSS 변수와 동기화 |
| `/git:branch` | 브랜치 생성, 전환, 삭제 관리 |
| `/git:commit` | 컨벤셔널 커밋 메시지로 커밋 생성 |
| `/git:merge` | 브랜치 병합 및 충돌 해결 |
| `/git:pr` | GitHub Pull Request 생성 및 관리 |

## 프로젝트 구조

```
app/                → 페이지 및 라우팅 (App Router)
components/ui/      → ShadcnUI 컴포넌트 (자동 생성)
components/layout/  → 레이아웃 컴포넌트 (Header, Footer, Nav)
components/features/→ 기능별 커스텀 컴포넌트
lib/                → 유틸리티, 상수, 헬퍼 함수
hooks/              → 커스텀 훅
public/             → 정적 에셋
docs/               → 프로젝트 문서
.claude/            → Claude Code 설정 (커맨드, 에이전트, 훅)
```

## Figma→Code 워크플로우

```
1. Figma MCP       → 디자인 데이터 추출
2. Sequential Thinking → 컴포넌트 구조 분석
3. ShadcnUI MCP    → 컴포넌트 매핑 및 설치
4. Context7 MCP    → API 문서 참조
5. 코드 생성        → TSX + TailwindCSS
6. Playwright MCP  → 시각 검증 (데스크톱 + 모바일)
```
