---
description: '브랜치 생성, 전환, 삭제 등 브랜치 관리 작업을 수행합니다'
allowed-tools:
  [
    'Bash(git branch:*)',
    'Bash(git checkout:*)',
    'Bash(git switch:*)',
    'Bash(git status:*)',
    'Bash(git stash:*)',
    'Bash(git log:*)',
    'Bash(git fetch:*)',
  ]
---

# Branch 관리

$ARGUMENTS — 브랜치명 또는 작업 유형 (예: "feature/user-auth", "fix/login-bug")

## 실행 순서

### 1. 현재 상태 확인

- `git status`로 uncommitted 변경사항 확인
- 변경사항이 있으면 stash 처리 여부를 사용자에게 확인

### 2. 브랜치 작업 수행

**생성**: 최신 main에서 분기하여 새 브랜치 생성 및 전환
**전환**: 대상 브랜치로 안전하게 전환 (필요시 stash)
**삭제**: 병합 상태 확인 후 안전하게 삭제
**목록**: 로컬/원격 브랜치 목록 표시

### 3. 결과 확인

- 현재 브랜치 상태 출력

## 브랜치 네이밍 규칙

```
feature/   — 새로운 기능 개발
fix/       — 버그 수정
hotfix/    — 긴급 수정
docs/      — 문서화 작업
chore/     — 빌드, 설정 등 유지보수
refactor/  — 코드 리팩토링
test/      — 테스트 코드 작업
```

## 안전 규칙

- 브랜치 전환 전 uncommitted 변경사항은 반드시 stash 또는 커밋
- 병합되지 않은 브랜치 삭제 시 사용자 확인 필수
- main/master 브랜치 삭제 금지
- 잘못 삭제한 브랜치 복구: `git reflog`로 SHA 확인 후 `git branch <이름> <SHA>`
