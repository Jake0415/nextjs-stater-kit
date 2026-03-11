---
allowed-tools:
  [
    'mcp__figma__*',
    'mcp__sequential-thinking__*',
    'mcp__shadcn__*',
    'mcp__context7__*',
    'mcp__playwright__*',
    'Bash(npx shadcn@latest:*)',
    'Bash(npm run dev:*)',
  ]
---

# Figma→Code 자동 변환

Figma 디자인을 분석하여 Next.js + ShadcnUI + TailwindCSS 코드로 자동 변환한다.

## 입력

$ARGUMENTS — 다음 중 하나:
1. PRD 경로#페이지명 (예: "docs/PRD.md#회원가입 페이지")
2. Figma URL + 서비스 설명 (예: "https://figma.com/... 회원가입 페이지, 이메일/PW 가입")
3. Figma URL만 (기존 방식, UI 마크업만 생성)

## 실행 순서

### 0단계: 입력 분석

- **PRD 경로가 포함된 경우** (`docs/**.md#페이지명` 형식):
  1. PRD 파일을 읽어 해당 페이지 섹션 추출
  2. Figma URL, 구현 기능 ID, 데이터 요구사항, 사용자 행동 파악
  3. 이 컨텍스트를 이후 단계에 전달

- **Figma URL + 설명인 경우**:
  1. URL과 설명을 분리하여 처리
  2. 설명을 컨텍스트로 활용

- **Figma URL만인 경우**:
  1. 기존 방식대로 UI 마크업만 생성 (1단계부터 시작)

### 1단계: 디자인 데이터 추출 (Figma MCP)

- Figma MCP를 사용하여 대상 프레임/컴포넌트의 구조 데이터를 추출한다
- 추출 항목: 레이어 구조, 컴포넌트 속성, 색상/폰트/간격 스타일, 오토레이아웃 설정
- 추출한 데이터를 정리하여 다음 단계에 전달한다

### 2단계: 컴포넌트 구조 분석 (Sequential Thinking)

sequential-thinking MCP를 사용하여 다음을 분석한다:
- Figma 레이어 계층 → React 컴포넌트 트리 매핑
- 재사용 가능한 컴포넌트 식별
- Server Component vs Client Component 분류
- 상태 관리 필요 여부 판단
- 반응형 브레이크포인트 전략

### 3단계: ShadcnUI 컴포넌트 매핑 (ShadcnUI MCP)

- `search_items_in_registries`로 Figma 컴포넌트에 매칭되는 ShadcnUI 컴포넌트 탐색
- `view_items_in_registries`로 후보 컴포넌트의 상세 API 확인
- `get_item_examples_from_registries`로 사용 예제 참고
- 매칭되는 컴포넌트가 미설치 상태면 `get_add_command_for_items`로 설치 명령어 생성 후 설치

### 4단계: API 참조 (Context7 MCP)

필요 시 context7로 다음을 확인:
- Next.js App Router 패턴 (레이아웃, 로딩, 에러 처리)
- TailwindCSS v4 유틸리티 클래스
- ShadcnUI 컴포넌트 사용법

### 5단계: 코드 생성

> ⚠️ **경고**: Figma에 정의된 디자인을 100% 그대로 구현해야 한다.
> Figma에 없는 요소를 추가하거나, Figma의 레이아웃을 임의로 변경하는 것은 엄격히 금지된다.
> 의심스러운 경우 `get_screenshot`으로 Figma 스크린샷을 재확인하라.

다음 규칙을 따라 코드를 생성한다:
- 파일 위치: `front-end/app/` (페이지) 또는 `front-end/components/features/` (컴포넌트)
- TailwindCSS 유틸리티 클래스만 사용 (인라인 스타일 금지)
- 반응형 디자인: 모바일 퍼스트 (`sm:`, `md:`, `lg:`)
- 다크모드 지원: CSS 변수 또는 `dark:` 프리픽스
- 접근성: 시맨틱 HTML, aria 속성 포함

#### 링크/네비게이션 변환 규칙

**클릭 요소 식별:**
- Figma 레이어명에 `Button`, `CTA`, `Link`, `Nav`, `Tab`, `Breadcrumb` 포함 노드
- 텍스트가 PRD 라우팅 테이블 페이지명과 일치하는 노드
- 카드/리스트 행 내 반복되는 클릭 암시 구조

**링크 패턴 선택 기준:**

| 상황 | 패턴 |
|------|------|
| GNB/사이드바/Breadcrumb | 순수 `<Link>` |
| CTA 버튼, 주요 액션 | `<Button asChild><Link>` |
| 테이블 행/카드 전체 클릭 | `<Link className="block">` 래핑 |
| 외부 링크 | `<Link target="_blank" rel="noopener noreferrer">` |
| 폼 제출 후 이동 | `useRouter().push()` |

**라우트 결정:**
1. `front-end/lib/routes.ts`의 `ROUTES` 상수를 import하여 사용 (하드코딩 경로 금지)
2. 동적 라우트는 `ROUTES.FILE_OCR(doc.id)` 형태로 호출
3. 매칭 불가 시 `href="#"` + `{/* TODO: 라우트 매핑 필요 */}` 주석

**active 상태:**
- `usePathname()` 기반, `pathname === href || pathname.startsWith(href + "/")` 패턴 적용
- 참조 구현: `front-end/components/layout/header.tsx`

**PRD 컨텍스트가 있는 경우 추가 생성:**
- UI 마크업에 데이터 요구사항을 주석으로 표시
- Server Component에서의 데이터 페칭 패턴 스캐폴딩 (`TODO` 주석)
- 폼이 있는 경우 Server Action 스캐폴딩 (`TODO` 주석)
- 예시:
  ```typescript
  export default async function RegisterPage() {
    // TODO: 데이터 페칭 — /generate-api 로 생성
    return (
      <div>
        {/* TODO: 이메일 중복 체크 API 연동 — /generate-api 로 생성 */}
        <RegisterForm />
      </div>
    )
  }
  ```

### 6단계: 시각 검증 (Playwright MCP)

- `next dev` 서버가 실행 중인지 확인 (미실행 시 안내)
- `browser_navigate`로 생성된 페이지로 이동
- `browser_take_screenshot`로 데스크톱(1280×800) 스크린샷 캡처
- `browser_resize`로 모바일(375×812) 변경 후 스크린샷 캡처
- `browser_console_messages`로 에러 확인
- `browser_snapshot`으로 접근성 트리 확인

### 7단계: 결과 보고

다음을 사용자에게 보고한다:
- 생성/수정된 파일 목록
- 설치된 ShadcnUI 컴포넌트
- 스크린샷 (데스크톱 + 모바일)
- 발견된 문제점 및 개선 제안
