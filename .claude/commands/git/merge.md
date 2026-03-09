---
description: '브랜치를 안전하게 병합하고 충돌을 해결합니다'
allowed-tools:
  [
    'Bash(git merge:*)',
    'Bash(git status:*)',
    'Bash(git diff:*)',
    'Bash(git log:*)',
    'Bash(git branch:*)',
    'Bash(git fetch:*)',
    'Bash(git pull:*)',
    'Bash(git reset:*)',
    'Bash(git checkout:*)',
    'Bash(git stash:*)',
  ]
---

# Merge 병합

$ARGUMENTS — 병합할 브랜치명 (예: "feature/user-auth")

## 실행 순서

### 1. 병합 전 점검

- `git status`로 working directory 상태 확인 (uncommitted 변경사항 처리)
- `git fetch`로 원격 최신화
- `git log --oneline main..<브랜치>` 로 병합 대상 커밋 확인
- 사용자에게 병합 전략 확인 (fast-forward / no-ff / squash)

### 2. 병합 수행

- 현재 커밋 SHA 기록 (롤백용)
- 선택된 전략으로 병합 실행

### 3. 충돌 해결 (발생 시)

- `git diff --name-only --diff-filter=U`로 충돌 파일 목록 확인
- 파일별 충돌 내용 표시 및 해결 옵션 제시 (ours / theirs / 수동)
- 해결 후 `git add` → `git commit`

### 4. 병합 후 확인

- `git log --oneline -5`로 병합 결과 확인
- 병합된 브랜치 삭제 여부 사용자에게 확인

## 병합 전략

| 전략 | 명령어 | 용도 |
|------|--------|------|
| Fast-forward | `git merge <브랜치>` | 선형 히스토리, 간단한 변경 |
| No-fast-forward | `git merge --no-ff <브랜치>` | 병합 커밋 생성, 브랜치 히스토리 보존 |
| Squash | `git merge --squash <브랜치>` | 여러 커밋을 하나로 압축 |

## 안전 규칙

- 병합 전 반드시 현재 커밋 SHA 기록
- 충돌 발생 시 `git merge --abort`로 안전하게 중단 가능
- main/master로의 직접 병합 시 사용자 확인 필수
- 병합 후 빌드/테스트 실패 시 `git reset --hard <기록한 SHA>`로 롤백 (사용자 확인 후)
