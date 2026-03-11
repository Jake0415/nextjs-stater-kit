# MH-OCR-AI

문서 OCR 처리 및 관리 웹 애플리케이션. Figma 디자인을 Next.js + ShadcnUI + TailwindCSS 코드로 자동 변환하는 퍼블리싱 워크플로우를 지원합니다.

## 모노리포 구조

```
├── front-end/     Next.js 16 프론트엔드 (포트 3000)
├── back-end/      FastAPI 백엔드 (포트 8000)
├── docs/          공유 문서 (API 명세, 컴포넌트 맵 등)
└── .claude/       Claude Code 설정 (커맨드, 에이전트)
```

## 시작하기

### 프론트엔드

```bash
cd front-end/
npm install
npm run dev        # http://localhost:3000
```

### 백엔드

```bash
cd back-end/
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## 기술 스택

| 영역 | 스택 |
|------|------|
| 프론트엔드 | Next.js 16, React 19, TailwindCSS v4, ShadcnUI (new-york) |
| 백엔드 | FastAPI (Python), JWT Bearer 인증 |
| 데이터베이스 | PostgreSQL, MongoDB, MinIO |
| 인프라 | Nginx (리버스 프록시) |

## 슬래시 커맨드

Claude Code에서 사용할 수 있는 슬래시 커맨드입니다.

| 커맨드 | 설명 |
|--------|------|
| `/figma-to-code` | Figma 디자인을 분석하여 코드로 자동 변환 |
| `/verify-design` | 구현된 페이지를 Playwright로 시각 검증 |
| `/add-component` | ShadcnUI 컴포넌트 검색 및 설치 |
| `/sync-design-tokens` | Figma 디자인 토큰을 CSS 변수와 동기화 |
| `/generate-api` | PRD 기반 API / Server Actions 생성 |
| `/generate-api-types` | PRD 기반 API DTO 타입 생성 |
| `/generate-schema` | PRD 기반 DB 스키마 생성 |

## Figma→Code 워크플로우

```
1. Figma MCP       → 디자인 데이터 추출
2. Sequential Thinking → 컴포넌트 구조 분석
3. ShadcnUI MCP    → 컴포넌트 매핑 및 설치
4. Context7 MCP    → API 문서 참조
5. 코드 생성        → TSX + TailwindCSS
6. Playwright MCP  → 시각 검증 (데스크톱 + 모바일)
```
