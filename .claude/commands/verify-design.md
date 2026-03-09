---
allowed-tools:
  [
    'mcp__playwright__*',
  ]
---

# 디자인 시각 검증

구현된 페이지를 Playwright로 열어 시각적으로 검증하고 문제를 보고한다.

## 입력

$ARGUMENTS — 검증할 페이지 경로 (예: "/", "/about", "/login")

## 사전 조건

- `next dev` 개발 서버가 실행 중이어야 한다 (기본 `http://localhost:3000`)
- 미실행 시 사용자에게 `npm run dev` 실행을 안내한다

## 실행 순서

### 1단계: 데스크톱 검증

1. `browser_navigate`로 `http://localhost:3000$ARGUMENTS` 이동
2. `browser_resize`로 뷰포트를 1280×800으로 설정
3. `browser_take_screenshot`로 전체 페이지 스크린샷 캡처
4. `browser_console_messages`로 에러/경고 수집
5. `browser_snapshot`으로 접근성 트리 확인

### 2단계: 모바일 검증

1. `browser_resize`로 뷰포트를 375×812으로 변경
2. `browser_take_screenshot`로 모바일 스크린샷 캡처
3. 모바일 네비게이션 동작 확인 (햄버거 메뉴 등)

### 3단계: 인터랙션 검증

1. 다크모드 토글 클릭 후 스크린샷
2. 주요 버튼/링크 hover 상태 확인
3. 폼이 있으면 입력 필드 포커스 상태 확인

### 4단계: 네트워크 검증

1. `browser_network_requests`로 실패한 요청 확인
2. 이미지/폰트 로딩 상태 확인

### 5단계: 결과 보고

다음을 정리하여 보고한다:
- 스크린샷 (데스크톱/모바일/다크모드)
- 콘솔 에러 목록
- 접근성 이슈
- 네트워크 에러
- 개선 제안 사항
