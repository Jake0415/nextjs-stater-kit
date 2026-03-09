---
allowed-tools:
  [
    'mcp__figma__*',
    'mcp__playwright__*',
  ]
---

# 디자인 토큰 동기화

Figma에서 디자인 토큰(색상, 타이포그래피, 간격)을 추출하여 TailwindCSS CSS 변수와 동기화한다.

## 입력

$ARGUMENTS — Figma URL 또는 동기화 대상 설명 (예: "색상만", "전체")

## 실행 순서

### 1단계: Figma 스타일 추출 (Figma MCP)

Figma MCP를 사용하여 다음 디자인 토큰을 추출:
- **색상**: Primary, Secondary, Accent, Background, Foreground, Muted, Destructive 등
- **타이포그래피**: 폰트 패밀리, 크기, 줄간격, 자간
- **간격**: 패딩, 마진, 갭 기본값
- **테두리**: 반지름, 두께

### 2단계: 현재 CSS 변수 분석

`app/globals.css`에서 현재 정의된 CSS 변수를 파싱:
- `:root` (라이트 모드) 변수
- `.dark` (다크 모드) 변수
- ShadcnUI 표준 변수명과의 매핑 관계

### 3단계: 차이점 비교 보고

Figma 토큰과 현재 CSS 변수를 비교하여 보고:
- 새로 추가해야 할 변수
- 값이 변경된 변수 (이전값 → 새값)
- Figma에 없지만 CSS에 있는 변수 (삭제 후보)
- 변경사항을 테이블 형태로 정리하여 보여줌

### 4단계: 사용자 확인

- 변경 사항을 사용자에게 보여주고 승인을 요청
- 부분 적용 가능 (예: "색상만 업데이트해줘")

### 5단계: CSS 변수 업데이트

승인 후:
- `app/globals.css`의 `:root` 및 `.dark` 섹션 업데이트
- HSL 형식 유지 (ShadcnUI 호환)
- 변경 전 백업 내용을 사용자에게 표시

### 6단계: 검증

- Playwright로 변경 후 페이지 스크린샷 캡처
- 변경 전후 비교를 위한 시각적 확인
- 다크모드에서도 정상 표시되는지 확인
