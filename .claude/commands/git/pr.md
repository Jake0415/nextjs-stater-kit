---
description: 'GitHub Pull Request를 생성하고 관리합니다'
allowed-tools:
  [
    'Bash(gh pr:*)',
    'Bash(gh api:*)',
    'Bash(gh repo:*)',
    'Bash(git push:*)',
    'Bash(git status:*)',
    'Bash(git log:*)',
    'Bash(git diff:*)',
    'Bash(git branch:*)',
    'Bash(git fetch:*)',
  ]
---

# Pull Request 생성

$ARGUMENTS — PR 제목 또는 옵션 (예: "사용자 인증 기능 구현", "--draft")

## 실행 순서

### 1. PR 생성 전 점검

- `git status`로 uncommitted 변경사항 확인
- `git log --oneline main..HEAD`로 포함될 커밋 확인
- 원격 브랜치 푸시 상태 확인, 미푸시 시 `git push -u origin <브랜치>` 실행

### 2. PR 내용 생성

- 커밋 히스토리와 diff를 분석하여 제목·설명 자동 생성
- 브랜치명에서 작업 유형 추출 (feature → feat, fix → fix 등)
- PR 설명에 변경사항 요약, 테스트 계획 포함

### 3. PR 생성

```bash
gh pr create --title "<제목>" --body "<설명>"
```

- `--draft` 옵션 시 Draft PR로 생성
- 생성 후 PR URL을 사용자에게 표시

### 4. 생성 후 확인

- `gh pr view`로 PR 상태 확인
- CI/CD 상태 확인 (설정된 경우)

## PR 설명 형식

```markdown
## 변경사항 요약
- [주요 변경사항 1~3개]

## 테스트 계획
- [테스트 항목]
```

## 안전 규칙

- main/master 브랜치에서 직접 PR 생성 금지
- 시크릿 정보(.env 등)가 포함된 파일이 없는지 확인
- PR 생성 전 반드시 원격 브랜치에 푸시
- 중복 PR 확인 (`gh pr list --head <브랜치>`)
