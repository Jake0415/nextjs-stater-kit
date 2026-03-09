---
allowed-tools:
  [
    'mcp__shadcn__*',
    'Bash(npx shadcn@latest:*)',
  ]
---

# ShadcnUI 컴포넌트 추가

ShadcnUI 레지스트리에서 컴포넌트를 검색하고 프로젝트에 설치한다.

## 입력

$ARGUMENTS — 컴포넌트 이름 또는 검색 키워드 (예: "table", "accordion", "date-picker")

## 실행 순서

### 1단계: 컴포넌트 검색

1. `search_items_in_registries`로 "$ARGUMENTS" 검색
2. 검색 결과가 여러 개면 목록을 보여주고 사용자에게 선택을 요청

### 2단계: 컴포넌트 상세 확인

1. `view_items_in_registries`로 선택된 컴포넌트의 API, Props, 변형(variants) 확인
2. `get_item_examples_from_registries`로 사용 예제 조회
3. 사용자에게 컴포넌트 정보를 요약하여 보여줌

### 3단계: 설치

1. `get_add_command_for_items`로 설치 명령어 생성
2. 명령어 실행하여 컴포넌트 설치
3. 설치된 파일 확인 (`components/ui/` 디렉토리)

### 4단계: 사용 가이드

설치 완료 후 다음을 안내:
- 컴포넌트 import 경로
- 기본 사용 예제 코드
- 주요 Props 및 변형(variants) 설명
- 현재 프로젝트에서의 활용 팁
