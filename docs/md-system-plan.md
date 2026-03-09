# Figma→Code 자동 퍼블리싱 MD 시스템 계획서

> 작성일: 2026-03-10
> 프로젝트: `nextjs-figma-starter-kit`

---

## 1. 현재 프로젝트 상태 분석

### 1.1 기술 스택

| 항목 | 버전/설정 |
|------|-----------|
| Next.js | 16.1.6 (App Router, Turbopack) |
| React | 19.2.3 |
| TailwindCSS | v4 (`@tailwindcss/postcss`) |
| ShadcnUI | v3.8.5 (new-york 스타일, lucide 아이콘) |
| TypeScript | ^5 |
| 테마 | next-themes (다크모드 지원) |
| 토스트 | sonner |

### 1.2 프로젝트 구조

```
nextjs-figma-starter-kit/
├── app/
│   ├── globals.css          # TailwindCSS v4 설정
│   ├── layout.tsx           # RootLayout (ThemeProvider, Header, Footer)
│   ├── page.tsx             # 홈페이지 (히어로 + 기능카드 + CTA)
│   └── favicon.ico
├── components/
│   ├── layout/
│   │   ├── header.tsx       # 상단 네비게이션
│   │   ├── footer.tsx       # 하단 푸터
│   │   ├── mobile-nav.tsx   # 모바일 네비게이션
│   │   └── theme-toggle.tsx # 다크모드 토글
│   ├── providers/
│   │   └── theme-provider.tsx
│   └── ui/                  # ShadcnUI 컴포넌트
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── separator.tsx
│       ├── sheet.tsx
│       ├── sonner.tsx
│       └── tooltip.tsx
├── lib/
│   ├── navigation.ts        # 네비게이션 링크 상수
│   └── utils.ts             # cn() 유틸리티
├── public/                   # 정적 에셋
├── components.json           # ShadcnUI 설정 (new-york, neutral)
├── .mcp.json                 # MCP 서버 6개 설정
└── package.json
```

### 1.3 부재 항목 (이 계획으로 해결)

- `CLAUDE.md` — 프로젝트 전용 AI 지시서 없음
- `.claude/commands/` — 커스텀 슬래시 커맨드 없음
- `docs/` — 문서 디렉토리 없음 (이 파일이 첫 문서)
- Shrimp Task Manager DATA_DIR이 다른 프로젝트(`MHSSO`) 경로를 가리킴

---

## 2. MCP 서버 역할 및 도구 정리

### 2.1 Figma MCP (`figma`)

- **연결**: HTTP (`https://mcp.figma.com/mcp`)
- **역할**: Figma 디자인 파일에서 컴포넌트/프레임/스타일 데이터를 읽어옴
- **주요 도구**:
  - 파일/노드 정보 읽기
  - 컴포넌트 속성 추출
  - 스타일(색상, 타이포그래피, 간격) 토큰 추출
- **워크플로우 내 위치**: 입력 단계 — 디자인 데이터의 원천

### 2.2 ShadcnUI MCP (`shadcn`)

- **연결**: stdio (`npx shadcn@latest mcp`)
- **역할**: ShadcnUI 레지스트리에서 컴포넌트 검색/조회/설치
- **주요 도구**:
  - `mcp__shadcn__list_items_in_registries` — 레지스트리 아이템 목록
  - `mcp__shadcn__search_items_in_registries` — 컴포넌트 검색
  - `mcp__shadcn__view_items_in_registries` — 컴포넌트 상세 조회
  - `mcp__shadcn__get_item_examples_from_registries` — 사용 예제 조회
  - `mcp__shadcn__get_add_command_for_items` — 설치 명령어 생성
  - `mcp__shadcn__get_audit_checklist` — 감사 체크리스트
  - `mcp__shadcn__get_project_registries` — 프로젝트 레지스트리 조회
- **워크플로우 내 위치**: 매핑 단계 — Figma 컴포넌트를 ShadcnUI 컴포넌트로 매핑

### 2.3 Playwright MCP (`playwright`)

- **연결**: stdio (`npx @playwright/mcp@latest`)
- **역할**: 브라우저 자동화로 구현 결과 시각 검증
- **주요 도구**:
  - `mcp__playwright__browser_navigate` — URL 이동
  - `mcp__playwright__browser_snapshot` — 접근성 스냅샷
  - `mcp__playwright__browser_take_screenshot` — 스크린샷 캡처
  - `mcp__playwright__browser_click` — 요소 클릭
  - `mcp__playwright__browser_fill_form` — 폼 입력
  - `mcp__playwright__browser_evaluate` — JS 실행
  - `mcp__playwright__browser_console_messages` — 콘솔 로그 확인
  - `mcp__playwright__browser_network_requests` — 네트워크 요청 확인
  - `mcp__playwright__browser_resize` — 뷰포트 리사이즈
  - `mcp__playwright__browser_close` — 브라우저 닫기
- **워크플로우 내 위치**: 검증 단계 — 구현 결과를 시각적으로 확인

### 2.4 Context7 MCP (`context7`)

- **연결**: HTTP (`https://mcp.context7.com/mcp`)
- **역할**: 라이브러리/프레임워크의 최신 공식 문서를 실시간 조회
- **주요 도구**:
  - `mcp__context7__resolve-library-id` — 라이브러리 ID 조회
  - `mcp__context7__query-docs` — 문서 검색/조회
- **워크플로우 내 위치**: 참조 단계 — Next.js, TailwindCSS, ShadcnUI 등의 최신 API 확인

### 2.5 Sequential Thinking MCP (`sequential-thinking`)

- **연결**: stdio (`npx @modelcontextprotocol/server-sequential-thinking`)
- **역할**: 복잡한 문제를 단계별 사고 과정으로 분해
- **주요 도구**:
  - `mcp__sequential-thinking__sequentialthinking` — 단계별 사고 프로세스
- **워크플로우 내 위치**: 분석 단계 — 복잡한 디자인→코드 변환 로직 설계

### 2.6 Shrimp Task Manager MCP (`shrimp-task-manager`)

- **연결**: stdio (로컬 node 서버)
- **현재 DATA_DIR**: `C:/claude-code/MHSSO/shrimp_data` (⚠️ 변경 필요)
- **변경할 DATA_DIR**: `C:/claude-code/nextjs-figma-starter-kit/shrimp_data`
- **역할**: 태스크 기반 작업 관리 및 추적
- **주요 도구**:
  - `mcp__shrimp-task-manager__plan_task` — 태스크 계획 수립
  - `mcp__shrimp-task-manager__analyze_task` — 태스크 분석
  - `mcp__shrimp-task-manager__split_tasks` — 태스크 분할
  - `mcp__shrimp-task-manager__execute_task` — 태스크 실행
  - `mcp__shrimp-task-manager__verify_task` — 태스크 검증
  - `mcp__shrimp-task-manager__list_tasks` — 태스크 목록
  - `mcp__shrimp-task-manager__get_task_detail` — 태스크 상세
  - `mcp__shrimp-task-manager__update_task` — 태스크 업데이트
  - `mcp__shrimp-task-manager__delete_task` — 태스크 삭제
  - `mcp__shrimp-task-manager__clear_all_tasks` — 전체 초기화
  - `mcp__shrimp-task-manager__query_task` — 태스크 쿼리
  - `mcp__shrimp-task-manager__reflect_task` — 태스크 회고
  - `mcp__shrimp-task-manager__research_mode` — 리서치 모드
  - `mcp__shrimp-task-manager__process_thought` — 사고 처리
  - `mcp__shrimp-task-manager__init_project_rules` — 프로젝트 규칙 초기화
- **워크플로우 내 위치**: 관리 단계 — 전체 퍼블리싱 작업의 진행 상황 추적

---

## 3. 생성할 MD 파일 목록 및 상세 설계

### 3.1 `CLAUDE.md` (프로젝트 루트)

**목적**: Claude Code가 이 프로젝트에서 따를 핵심 지시서

**포함 내용**:
```
- 프로젝트 개요 (Figma→Code 자동 퍼블리싱 시스템)
- 기술 스택 요약
- 코딩 컨벤션
  - 컴포넌트: React Server Components 기본, 클라이언트는 "use client" 명시
  - 스타일링: TailwindCSS v4 유틸리티 클래스 사용, 인라인 스타일 금지
  - ShadcnUI: new-york 스타일, neutral 색상 기반
  - 파일 구조: components/ui (ShadcnUI), components/layout (레이아웃), components/features (기능별)
  - 경로 별칭: @/components, @/lib, @/hooks
- MCP 서버 활용 가이드 (어떤 상황에서 어떤 MCP를 사용할지)
- Figma→Code 워크플로우 요약 참조
- 금지 사항 (직접 CSS 파일 수정 금지, node_modules 수정 금지 등)
```

### 3.2 `.claude/commands/figma-to-code.md`

**목적**: Figma URL을 입력받아 자동으로 코드를 생성하는 슬래시 커맨드

**워크플로우**:
1. 사용자가 `/figma-to-code <figma-url-or-node-id>` 실행
2. Figma MCP로 디자인 데이터 추출
3. Sequential Thinking으로 컴포넌트 구조 분석
4. ShadcnUI MCP로 매핑 가능한 컴포넌트 탐색
5. 필요한 ShadcnUI 컴포넌트 설치
6. 코드 생성 (TSX + TailwindCSS)
7. Playwright로 시각 검증

### 3.3 `.claude/commands/verify-design.md`

**목적**: 구현된 페이지를 Playwright로 시각 검증하는 슬래시 커맨드

**워크플로우**:
1. 사용자가 `/verify-design <page-path>` 실행
2. `next dev` 서버 가동 확인
3. Playwright로 해당 경로 네비게이트
4. 스크린샷 캡처 (데스크톱 + 모바일 뷰포트)
5. 접근성 스냅샷 확인
6. 콘솔 에러 확인
7. 결과 보고

### 3.4 `.claude/commands/add-component.md`

**목적**: ShadcnUI 컴포넌트를 검색하고 설치하는 슬래시 커맨드

**워크플로우**:
1. 사용자가 `/add-component <component-name>` 실행
2. ShadcnUI MCP로 컴포넌트 검색
3. 예제 코드 조회
4. 설치 명령어 생성 및 실행
5. 설치된 컴포넌트 확인

### 3.5 `.claude/commands/sync-design-tokens.md`

**목적**: Figma 디자인 토큰을 TailwindCSS 변수로 동기화

**워크플로우**:
1. 사용자가 `/sync-design-tokens <figma-url>` 실행
2. Figma MCP로 스타일(색상, 타이포그래피, 간격) 추출
3. `app/globals.css`의 CSS 변수와 비교
4. 차이점 리포트 생성
5. 사용자 확인 후 CSS 변수 업데이트

### 3.6 `.claude/settings.local.json`

**목적**: 프로젝트별 Claude Code 설정 (이미 존재, 업데이트 필요 시)

---

## 4. Shrimp Task Manager 설정 변경

### 현재 문제
`.mcp.json`의 `shrimp-task-manager` → `DATA_DIR`이 다른 프로젝트를 가리킴:
```
"DATA_DIR": "C:/claude-code/MHSSO/shrimp_data"
```

### 변경 계획
```json
"DATA_DIR": "C:/claude-code/nextjs-figma-starter-kit/shrimp_data"
```

- `shrimp_data/` 디렉토리를 `.gitignore`에 추가
- 변경 후 `init_project_rules`로 프로젝트 규칙 초기화

---

## 5. 워크플로우 다이어그램

### 5.1 전체 Figma→Code 파이프라인

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Figma     │────▶│  Sequential      │────▶│   ShadcnUI      │
│   MCP       │     │  Thinking MCP    │     │   MCP           │
│             │     │                  │     │                 │
│ 디자인 데이터 │     │ 구조 분석/설계    │     │ 컴포넌트 매핑    │
│ 추출        │     │                  │     │ & 설치          │
└─────────────┘     └──────────────────┘     └────────┬────────┘
                                                       │
                                                       ▼
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ Playwright  │◀────│   Context7       │◀────│   Code          │
│ MCP         │     │   MCP            │     │   Generation    │
│             │     │                  │     │                 │
│ 시각 검증    │     │ API 문서 참조     │     │ TSX + Tailwind  │
│ & 스크린샷   │     │                  │     │ 코드 생성       │
└─────────────┘     └──────────────────┘     └─────────────────┘
```

### 5.2 태스크 관리 오버레이

```
┌─────────────────────────────────────────────────────────┐
│                 Shrimp Task Manager                      │
│                                                          │
│  plan_task ──▶ split_tasks ──▶ execute_task ──▶ verify  │
│                                                          │
│  각 퍼블리싱 작업을 태스크로 등록하고 추적                   │
│  GUI (localhost:3800) 에서 시각적 확인 가능                 │
└─────────────────────────────────────────────────────────┘
```

### 5.3 단일 컴포넌트 퍼블리싱 플로우

```
사용자: /figma-to-code [Figma URL]
  │
  ▼
① Figma MCP: 노드 데이터 추출
  │  - 프레임 구조, 레이어, 속성
  │  - 색상/폰트/간격 스타일
  │
  ▼
② Sequential Thinking: 분석
  │  - Figma 레이어 → React 컴포넌트 트리 매핑
  │  - 재사용 가능 컴포넌트 식별
  │  - 상태/인터랙션 분석
  │
  ▼
③ ShadcnUI MCP: 컴포넌트 매핑
  │  - 기존 ShadcnUI 컴포넌트 매칭
  │  - 미설치 컴포넌트 자동 설치
  │  - 커스텀 컴포넌트 필요 여부 판단
  │
  ▼
④ Context7 MCP: API 참조
  │  - Next.js App Router 패턴 확인
  │  - TailwindCSS v4 클래스 확인
  │
  ▼
⑤ 코드 생성
  │  - TSX 파일 생성
  │  - TailwindCSS 유틸리티 클래스 적용
  │  - Server/Client 컴포넌트 분리
  │
  ▼
⑥ Playwright MCP: 검증
  │  - 데스크톱 (1280px) 스크린샷
  │  - 모바일 (375px) 스크린샷
  │  - 접근성 검사
  │  - 콘솔 에러 확인
  │
  ▼
⑦ 결과 보고
   - 생성된 파일 목록
   - 스크린샷 비교
   - 수정 필요 사항
```

---

## 6. 검증 방법

### 6.1 문서 검증

| 검증 항목 | 방법 |
|-----------|------|
| 프로젝트 구조 일치 | `ls -R`로 실제 파일 구조와 문서 비교 |
| MCP 도구명 정확성 | deferred tools 목록과 대조 |
| 기술 스택 버전 | `package.json`과 대조 |
| ShadcnUI 설정 | `components.json`과 대조 |

### 6.2 구현 후 검증

| 검증 항목 | 방법 |
|-----------|------|
| CLAUDE.md 로드 | 새 세션에서 프로젝트 지시 적용 확인 |
| 슬래시 커맨드 동작 | `/figma-to-code` 실행 시 워크플로우 진행 |
| Shrimp DATA_DIR | `list_tasks` 호출로 빈 목록 반환 확인 |
| Playwright 연동 | `/verify-design /` 실행으로 스크린샷 확인 |

---

## 7. 실행 순서 (Step 2 상세)

Step 2에서 실제 MD 파일을 생성할 때의 순서:

1. **`.mcp.json` 수정** — Shrimp DATA_DIR 변경
2. **`.gitignore` 수정** — `shrimp_data/` 추가
3. **`CLAUDE.md` 생성** — 프로젝트 핵심 지시서
4. **`.claude/commands/figma-to-code.md` 생성** — 메인 워크플로우 커맨드
5. **`.claude/commands/verify-design.md` 생성** — 시각 검증 커맨드
6. **`.claude/commands/add-component.md` 생성** — 컴포넌트 추가 커맨드
7. **`.claude/commands/sync-design-tokens.md` 생성** — 디자인 토큰 동기화 커맨드
8. **검증** — 각 파일 로드 및 기능 확인

---

## 부록: 참고 리소스

- [Figma MCP 문서](https://mcp.figma.com)
- [ShadcnUI 레지스트리](https://ui.shadcn.com)
- [Playwright MCP](https://github.com/anthropics/playwright-mcp)
- [Context7 MCP](https://mcp.context7.com)
- [Claude Code 커스텀 커맨드](https://docs.anthropic.com/en/docs/claude-code)
