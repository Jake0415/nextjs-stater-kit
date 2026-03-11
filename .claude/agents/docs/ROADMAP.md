# MH OCR AI — 개발 로드맵

## 구현 현황

| Phase | 상태 | 설명 | 태스크 수 |
|-------|------|------|----------|
| Phase 0: 프로젝트 기반 정비 | ✅ 완료 | 디자인 토큰, 네비게이션, 타입, Mock 데이터 | 4 |
| Phase 1: 공통 레이아웃 | ✅ 완료 | ThemeProvider, Header, MobileNav, Footer | 3 |
| Phase 2: 랜딩 페이지 | ✅ 완료 | 히어로 + 기능카드 + 특장점 | 1 |
| Phase 3: 파일 관리 | ✅ 완료 | 핵심 기능 — 12개 Figma 프레임 | 5 |
| Phase 4: OCR 기능 | ✅ 완료 | 3개 Figma 프레임 | 3 |
| Phase 5: 통계 대시보드 | ⬜ 미시작 | 3개 Figma 프레임 | 2 |
| Phase 6: 설정 | ⬜ 미시작 | 3개 Figma 프레임 | 2 |
| Phase 7: 인증 및 라우트 보호 | ⬜ 미시작 | 로그인 페이지, JWT 인증, 미들웨어 | 3 |
| Phase 8: API 연동 및 인프라 | ⬜ 미시작 | 프록시, 서비스 레이어, Mock/Real 전환 | 5 |
| Phase 9: 통합 테스트 및 최적화 | ⬜ 미시작 | E2E 테스트, 성능 최적화, 배포 준비 | 3 |

---

## Phase 0: 프로젝트 기반 정비 ✅

| Task ID | 태스크 | 의존성 | 상태 |
|---------|--------|--------|------|
| T-001 | ShadcnUI 초기 컴포넌트 설치 + 디자인 토큰 설정 | - | ✅ |
| T-002 | 네비게이션 구조 및 유틸리티 설정 | - | ✅ |
| T-003 | TypeScript 도메인 타입 정의 | - | ✅ |
| T-004 | Mock 데이터 및 유틸리티 함수 생성 | T-003 | ✅ |

### T-001 ShadcnUI 초기 컴포넌트 설치 + 디자인 토큰 설정

- ✅ `components.json` 설정 (new-york 스타일, neutral baseColor, cssVariables 활성화, lucide 아이콘)
- ✅ 12개 기본 컴포넌트 일괄 설치: avatar, badge, button, card, dialog, dropdown-menu, input, label, separator, sheet, sonner, tooltip
- ✅ `app/globals.css` — TailwindCSS v4 임포트 (`@import "tailwindcss"`)
- ✅ `@theme inline` 매핑 — ShadcnUI CSS 변수를 TailwindCSS v4 테마에 연결
- ✅ `:root` / `.dark` 색상 변수 정의 — OKLch 색공간 기반 + brand/success/warning 커스텀 토큰
- ✅ `@layer base` 설정 — `border-border`, `bg-background`, `text-foreground` 기본값

### T-002 네비게이션 구조 및 유틸리티 설정

- ✅ `lib/navigation.ts` — `mainNavLinks` 배열 (파일관리 `/files`, 통계 `/analytics`, 세팅 `/settings`)
- ✅ `lib/navigation.ts` — `externalLinks` 배열 (MH Vector AI, MH Ontology AI 외부 서비스 링크)
- ✅ `lib/utils.ts` — `cn()` 유틸리티 함수 (clsx + tailwind-merge 조합)

### T-003 TypeScript 도메인 타입 정의

- ✅ `lib/types/index.ts` — 13개 타입/인터페이스 정의
- ✅ 핵심 엔티티: `User`, `Document`, `Section`, `SectionImage`, `Template`
- ✅ 상태 관리: `DocumentStatus` (등록/OCR중/완료/실패/보류 5개 상태)
- ✅ OCR 관련: `OcrStage`, `OcrProgress`, `OcrLog`
- ✅ 통계 관련: `Statistics`, `MonthlyOcrData`, `UserStats`, `ActivityLog`

> **참고**: `lib/types/index.ts`에 `upload_fail` 상태 추가 필요, `draft` 상태 제거 또는 재정의 필요. DocumentStatus Enum을 백엔드와 정합성 맞출 것 (CLAUDE.md DocumentStatus 매핑 참조).

### T-004 Mock 데이터 및 유틸리티 함수 생성

- ✅ **의존성**: T-003 (타입 정의 필요)
- ✅ `lib/mock/index.ts` — Mock 데이터 세트 생성
- ✅ `mockUsers` (4명) — 관리자/일반 사용자 역할 분배
- ✅ `mockTemplates` (3건) — OCR 템플릿 샘플
- ✅ `mockDocuments` (12건) — 5개 상태(등록/OCR중/완료/실패/보류) 분포
- ✅ `mockSections` (5건), `mockSectionImages` (3건) — OCR 결과 샘플
- ✅ `mockStatistics`, `mockMonthlyOcrData` (6개월), `mockUserStats` (4명), `mockActivityLogs` (8건)
- ✅ `statusLabels` / `statusVariants` — 상태 한글 라벨 및 배지 variant 매핑 객체
- ✅ `formatFileSize()` / `formatDate()` / `formatDateTime()` — 포맷 유틸리티 함수

---

## Phase 1: 공통 레이아웃 ✅

| Task ID | 태스크 | 의존성 | 상태 |
|---------|--------|--------|------|
| T-005 | ThemeProvider 및 ThemeToggle 구현 | T-001 | ✅ |
| T-006 | 헤더 및 모바일 네비게이션 구현 | T-002, T-004, T-005 | ✅ |
| T-007 | 푸터 및 루트 레이아웃 구현 | T-005, T-006 | ✅ |

### T-005 ThemeProvider 및 ThemeToggle 구현

- ✅ **의존성**: T-001 (ShadcnUI dropdown-menu 필요)
- ✅ `components/providers/theme-provider.tsx` — next-themes `ThemeProvider` 래퍼 (`"use client"`)
- ✅ `components/layout/theme-toggle.tsx` — DropdownMenu 기반 3단 선택 (라이트/다크/시스템)
- ✅ Sun/Moon 아이콘 전환 애니메이션 (`rotate-0 scale-100` ↔ `rotate-90 scale-0`)
- ✅ `useTheme()` 훅으로 `setTheme` 호출

### T-006 헤더 및 모바일 네비게이션 구현

- ✅ **의존성**: T-002 (네비게이션 데이터), T-004 (Mock 유저), T-005 (ThemeToggle)
- ✅ `components/layout/header.tsx` — sticky 반응형 헤더 (`"use client"`)
- ✅ 로고 영역: `LayoutGrid` 아이콘 + "MH OCR AI" 텍스트 (→ `/` 링크)
- ✅ 데스크톱 네비게이션: `mainNavLinks` 기반, `usePathname()` 활성 경로 하이라이팅
- ✅ 외부 링크: `externalLinks` 기반, `ExternalLink` 아이콘, `target="_blank"`
- ✅ 사용자 프로필: `Avatar` + `AvatarFallback` (이니셜)
- ✅ 반응형: 모바일 `hidden` / 데스크톱 `md:flex` 분기
- ✅ `components/layout/mobile-nav.tsx` — Sheet 기반 모바일 메뉴 (`"use client"`)

### T-007 푸터 및 루트 레이아웃 구현

- ✅ **의존성**: T-005 (ThemeProvider), T-006 (Header)
- ✅ `components/layout/footer.tsx` — RSC (서버 컴포넌트)
- ✅ `app/layout.tsx` — RSC, 루트 레이아웃
- ✅ Geist Sans/Mono 폰트 로딩, `<html lang="ko" suppressHydrationWarning>`
- ✅ `ThemeProvider` → `flex min-h-screen flex-col` → Header + `<main className="flex-1">` + Footer + Toaster

---

## Phase 2: 랜딩 페이지 ✅

| Task ID | 태스크 | 의존성 | 상태 | Figma ID |
|---------|--------|--------|------|----------|
| T-008 | 랜딩 페이지 UI 구현 | T-007 | ✅ | `1:5251` |

### T-008 랜딩 페이지 UI 구현

- ✅ **의존성**: T-007 (루트 레이아웃 완성 필요)
- ✅ `app/page.tsx` — RSC, Figma 프레임 `1:5251`
- ✅ **히어로 섹션**: 배경 블러 효과, 타이틀, 그라디언트 텍스트
- ✅ CTA 버튼: "파일 관리 시작하기" → `/files` 링크
- ✅ **기능 카드 4개**: `sm:grid-cols-2` 그리드
- ✅ **특장점 3개**: `border-t` 구분, 가로 배치

---

## Phase 3: 파일 관리 (핵심) ✅

> ShadcnUI 추가 컴포넌트(table, select, pagination, tabs, checkbox, form, textarea, radio-group, alert-dialog)는 이미 설치 완료.

| Task ID | 태스크 | 의존성 | 상태 | Figma ID |
|---------|--------|--------|------|----------|
| T-310 | 파일 관리 메인 리스트 (`app/files/page.tsx`) | - | ✅ | `1:8516` |
| T-320 | 파일 업로드 Dialog (`components/features/files/upload-dialog.tsx`) | T-310 | ✅ | `1:6828` `1:8094` |
| T-330 | 메타데이터 수정 Dialog (`components/features/files/edit-metadata-dialog.tsx`) | T-310 | ✅ | `1:5532` `1:6710` |
| T-340 | 삭제/초기화 확인 Dialog (`components/features/files/delete-confirm-dialog.tsx`) | T-310 | ✅ | `1:4950` `1:6936` |
| T-350 | 버전 업데이트 페이지 (`app/files/[id]/version/page.tsx`) | T-310 | ✅ | `1:7958` `1:8204` |

### T-310 컴포넌트 분해

| 컴포넌트 | 파일 | 설명 |
|---------|------|------|
| FilesPage | `app/files/page.tsx` | 페이지 컨테이너 |
| FileFilterBar | `components/features/files/file-filter-bar.tsx` | 탭 필터(전체/UPLOADED/OCR_EXTRACTING/OCR_ACTED/UPLOAD_FAIL/OCR_EXTRACT_FAIL) + 기간 설정(DateRangePicker: Popover+Calendar mode="range", 시작일~종료일 범위 선택, uploadedAt 기준 필터링) + 검색 |
| FileTable | `components/features/files/file-table.tsx` | 문서 테이블 (체크박스, 상태배지, 액션) |
| FileTableRow | `components/features/files/file-table-row.tsx` | 테이블 행 — 액션 드롭다운(MoreVertical 아이콘, hover 시 표시): 메타데이터 수정(→EditMetadataDialog), 버전 업데이트(→ROUTES.FILE_VERSION), OCR 추출(조건부: uploaded|ocr_failed 상태만, →ROUTES.FILE_OCR), 삭제(→DeleteConfirmDialog, destructive 스타일) |
| FilePagination | `components/features/files/file-pagination.tsx` | 페이지네이션 (기본 10개) |

> 상태 탭 필터는 DocumentStatus Enum에 맞춰 구성: 전체, UPLOADED(uploaded), OCR_EXTRACTING(ocr_processing), OCR_ACTED(ocr_completed), UPLOAD_FAIL(upload_fail), OCR_EXTRACT_FAIL(ocr_failed)

### T-320 업로드 Dialog
- 드래그앤드롭 영역 + PDF 50MB 제한
- 파일 유효성 검사: PDF만 허용, 50MB 이하
- 버전/설명 입력 필드 (v1.0 형식)
- 업로드 프로그레스 바
- 성공 시 완료 모달, 실패 시 에러 모달 (FILE_TOO_LARGE, INVALID_FILE_TYPE)

### T-330 메타데이터 수정 Dialog
- 파일명(읽기전용) + description 수정 + 저장
- PATCH `/api/v1/documents/{id}` 연동 준비

### T-340 삭제/초기화 확인 Dialog
- 삭제 경고 + 확인 (soft delete)
- alert-dialog 기반
- DELETE `/api/v1/documents/{id}` 연동 준비

### T-350 버전 업데이트
- 현재 버전 표시 + 메이저/마이너 선택 + 파일 대체 업로드
- 변경 설명 입력 (선택)
- 버전 이력 표시 (기존 버전 목록)
- POST `/api/v1/documents/{id}/version` 연동 준비

---

## Phase 4: OCR 기능 ✅

> ShadcnUI 추가 컴포넌트(progress, scroll-area, resizable)는 이미 설치 완료.

| Task ID | 태스크 | 의존성 | 상태 | Figma ID |
|---------|--------|--------|------|----------|
| T-410 | OCR 트리거 페이지 (`app/files/[id]/ocr/page.tsx`) | T-310 | ✅ | `1:5394` |
| T-420 | OCR 프로세싱 뷰 (`components/features/ocr/ocr-progress.tsx`) | T-410 | ✅ | `1:5659` |
| T-430 | OCR 결과 뷰어 (`app/files/[id]/result/page.tsx`) | T-410 | ✅ | `1:6020` `1:8337` |

### T-410 컴포넌트 분해

| 컴포넌트 | 파일 |
|---------|------|
| OcrTriggerPage | `app/files/[id]/ocr/page.tsx` |
| DocumentInfoCard | `components/features/ocr/document-info-card.tsx` |
| TemplateSelector | `components/features/ocr/template-selector.tsx` |

- 실행 전 상태: 파일 정보 패널 + 템플릿 선택 + [OCR 텍스트 추출 시작] 버튼
- POST `/api/v1/ocr/{documentId}/start` 연동 준비 (templateId 포함)

### T-420 컴포넌트 분해

| 컴포넌트 | 파일 |
|---------|------|
| OcrProgressView | `components/features/ocr/ocr-progress.tsx` |
| PipelineStage | `components/features/ocr/pipeline-stage.tsx` |
| OcrLogViewer | `components/features/ocr/ocr-log-viewer.tsx` |

**프론트엔드 4단계 파이프라인 (백엔드 D2V 9단계 추상화):**

| 프론트 단계 | 백엔드 Stage | 이름 | 처리 내용 |
|-----------|------------|------|----------|
| preprocessing | Stage 0 | 문서 전처리 | PyMuPDF PDF 파싱, 스캔 PDF: OpenCV + PaddleOCR |
| text_extraction | Stage 1-4 | 텍스트 및 표 추출 | 세그먼테이션, TOC, 레이아웃 분석, 표 추출 |
| llm_analysis | Stage 5-6 | LLM 이미지 분석 | 청킹, 이미지 캡셔닝, AI 태그 생성 |
| metadata_synthesis | Stage 7 | 메타데이터 합성 | 키워드 추출, 임베딩 벡터 생성, MongoDB 저장 |

- 전체 진행률(%) 프로그레스바 + 예상 남은 시간
- 실행 로그 영역 (실시간 스크롤)
- [X 프로세스 취소] 버튼 → 취소 확인 모달
- 에러 상태: 실패 단계 표시 + [재시도] 버튼
- GET `/api/v1/ocr/{documentId}/status` 폴링 2초 간격 준비

### T-430 컴포넌트 분해

| 컴포넌트 | 파일 |
|---------|------|
| OcrResultPage | `app/files/[id]/result/page.tsx` |
| ExtractedDataGrid | `components/features/ocr/extracted-data-grid.tsx` |
| MetadataPanel | `components/features/ocr/metadata-panel.tsx` |
| SectionCard | `components/features/ocr/section-card.tsx` |

**텍스트 탭:**
- 섹션 목록 (SEC-XXXX 형식, 페이지 번호, 텍스트 미리보기) + 페이지네이션
- 섹션 선택 시 우측 패널: 제목, 키워드, 전체 텍스트
- [텍스트 CSV 내보내기] 버튼

**이미지 탭:**
- 추출 이미지 보드 형태 (그리드 + 페이지네이션)
- 이미지 선택 시 우측 패널: 파일명, 설명(AI), 출처, 페이지, 태그(AI), 연결 섹션 ID
- [이미지 다운로드] 버튼 (단일/전체)

**공통:**
- 좌우 분할 레이아웃 (resizable)
- [파일 관리로 돌아가기] 버튼

**OCR 결과 프론트엔드 소비 데이터:**
- `sections[]`: section_id, title, content, page_number, keyword
- `images[]`: name, description, image_url, tag[], type (image/chart/diagram/equation)
- `table[]`: name, table_md (마크다운 문자열)

---

## Phase 5: 통계 대시보드

> ShadcnUI 추가 컴포넌트(chart, skeleton)는 이미 설치 완료.

| Task ID | 태스크 | 의존성 | 상태 | Figma ID |
|---------|--------|--------|------|----------|
| T-510 | 통계 개요 (`app/analytics/page.tsx`) | - | ⬜ | `1:7583` |
| T-520 | 통계 상세 (`app/analytics/detail/page.tsx`) | T-510 | ⬜ | `1:7237` |

### T-510 컴포넌트 분해

| 컴포넌트 | 파일 |
|---------|------|
| AnalyticsPage | `app/analytics/page.tsx` |
| KpiCard | `components/features/analytics/kpi-card.tsx` |
| OcrBarChart | `components/features/analytics/ocr-bar-chart.tsx` |
| RecentActivityList | `components/features/analytics/recent-activity-list.tsx` |
| UserStatsCard | `components/features/analytics/user-stats-card.tsx` |

- KPI 카드 3개: 총 업로드/OCR 완료/대기 작업 (전월 대비 변화율)
- 월별 OCR 처리 바 차트 (최근 6개월, 완료/실패 구분)
- 최근 활동 내역 리스트
- 사용자별 처리 통계 카드
- [상세 보기] 버튼 → 통계 상세 페이지
- 데이터 없을 시 카운트 0, 빈 리스트 표시

### T-520 컴포넌트 분해

| 컴포넌트 | 파일 |
|---------|------|
| AnalyticsDetailPage | `app/analytics/detail/page.tsx` |

- 기간 필터 (DateRangePicker: 시작일~종료일 범위 선택, dateFrom ~ dateTo) + 그룹 기준 (일별/주별/월별)
- 타임라인 차트 (업로드/OCR 완료/OCR 실패)
- 문서 유형별 처리 건수
- 에러 유형별 분포
- 스켈레톤 로딩 UI

---

## Phase 6: 설정

> ShadcnUI 추가 컴포넌트(switch, breadcrumb)는 이미 설치 완료.

| Task ID | 태스크 | 의존성 | 상태 | Figma ID |
|---------|--------|--------|------|----------|
| T-610 | 설정 메인 (`app/settings/page.tsx`) | - | ⬜ | `1:6215` `1:6441` |
| T-620 | 시스템 사용이력 (`app/settings/logs/page.tsx`) | T-610 | ⬜ | `1:5828` |

### T-610 컴포넌트 분해

| 컴포넌트 | 파일 |
|---------|------|
| SettingsPage | `app/settings/page.tsx` |
| ProfileTab | `components/features/settings/profile-tab.tsx` |
| TemplateManageTab | `components/features/settings/template-manage-tab.tsx` |
| DataManageTab | `components/features/settings/data-manage-tab.tsx` |
| VersionInfoTab | `components/features/settings/version-info-tab.tsx` |
| TemplateAddDialog | `components/features/settings/template-add-dialog.tsx` |

**프로필 탭 (F012):** 이름/이메일/부서 조회 및 수정 + [저장]
**템플릿 관리 탭 (F011):** 템플릿 목록 테이블 + [템플릿 추가] (관리자 전용) + [삭제] (TEMPLATE_IN_USE 에러 처리)
**데이터 관리 탭 (F014, 관리자 전용):** 초기화 대상(문서/로그/전체) + 확인 텍스트("데이터 초기화") + [초기화 실행]
**버전 정보 탭:** 시스템 버전, 빌드 정보 (정적)
**공통:** [사용이력 보기] 버튼 → 사용이력 페이지

### T-620 컴포넌트 분해

| 컴포넌트 | 파일 |
|---------|------|
| LogsPage | `app/settings/logs/page.tsx` |
| LogFilterBar | `components/features/settings/log-filter-bar.tsx` |
| LogTable | `components/features/settings/log-table.tsx` |

- 필터 바: 로그 타입(upload/ocr/delete/update/login/export), 사용자, 기간(DateRangePicker: 시작일~종료일 범위 선택)
- 로그 테이블 + 페이지네이션 (기본 20개)
- [CSV 내보내기] 버튼 (현재 필터 조건 적용)
- 관리자: 전체 사용자 로그 조회 (userId 필터 포함)

---

## Phase 7: 인증 및 라우트 보호

> PRD 기능 F010 (기본 인증) 구현. 로그인 페이지 Figma 디자인은 미정.

| Task ID | 태스크 | 의존성 | 상태 |
|---------|--------|--------|------|
| T-710 | 로그인 페이지 UI 구현 (`app/login/page.tsx`) | - | ⬜ |
| T-720 | JWT 인증 로직 및 토큰 관리 | T-710 | ⬜ |
| T-730 | 인증 미들웨어 및 라우트 보호 | T-720 | ⬜ |

### T-710 로그인 페이지 UI 구현

- `app/login/page.tsx` — 아이디/패스워드 입력 폼
- Zod 스키마 기반 유효성 검사 (`lib/validations/auth.ts`)
- [로그인] 버튼
- 로그인 실패 시 에러 메시지 표시 (INVALID_CREDENTIALS, ACCOUNT_LOCKED)
- 반응형 + 다크모드 지원
- Figma 디자인 미정이므로 ShadcnUI 기반 자체 디자인

### T-720 JWT 인증 로직 및 토큰 관리

- `lib/auth/` — JWT 토큰 저장/조회/삭제 유틸리티
- accessToken, refreshToken 관리 (localStorage 또는 쿠키)
- POST `/api/v1/auth/login` 연동
- POST `/api/v1/auth/refresh` — 토큰 만료 시 자동 갱신
- 401 응답 시 갱신 시도 → 실패 시 로그인 페이지 리다이렉트
- `lib/api/client.ts`에 `Authorization: Bearer <JWT>` 헤더 자동 주입

### T-730 인증 미들웨어 및 라우트 보호

- `middleware.ts` — Next.js 미들웨어로 인증 상태 확인
- 보호된 라우트: `/files`, `/files/**`, `/analytics`, `/analytics/**`, `/settings`, `/settings/**`
- 비인증 허용 라우트: `/`, `/login`
- 미인증 시 `/login`으로 리다이렉트
- 관리자/일반 사용자 역할 구분 (role: admin/user)

---

## Phase 8: API 연동 및 인프라

> 상세: `docs/API-CLIENT.md`, `docs/API-ENDPOINTS.md` 참조

| Task ID | 태스크 | 의존성 | 상태 |
|---------|--------|--------|------|
| T-800 | 개발 환경 인프라 설정 | - | ⬜ |
| T-810 | HTTP 클라이언트 및 API 상수 구축 | T-800 | ⬜ |
| T-820 | 서비스 인터페이스 및 Mock 구현체 | T-810 | ⬜ |
| T-830 | Real 서비스 구현체 (백엔드 API 연동) | T-820 | ⬜ |
| T-840 | 타입 정합성 보정 (DocumentStatus, DTO 변환) | T-820 | ⬜ |

### T-800 개발 환경 인프라 설정

- `next.config.ts` — rewrites 프록시 설정: `/api/v1/*` → `http://localhost:8000/api/v1/*`
- `.env.local` 환경변수 설정:
  ```
  NEXT_PUBLIC_API_URL=http://localhost:8000
  NEXT_PUBLIC_API_MODE=mock
  ```
- `.env.example` 작성 (환경변수 문서화)
- `.gitignore` 확인 (`.env.local` 제외)

### T-810 HTTP 클라이언트 및 API 상수 구축

- `lib/api/client.ts` — fetch 래퍼 (GET, POST, PUT, PATCH, DELETE)
  - JWT 토큰 자동 주입 (`Authorization: Bearer <token>`)
  - 요청/응답 인터셉터
  - 에러 핸들링 (401 → 토큰 갱신 → 로그인 리다이렉트)
  - 타임아웃 설정
  - `multipart/form-data` 지원 (파일 업로드)
- `lib/api/endpoints.ts` — API 엔드포인트 상수 (26개, `/api/v1/` prefix)
- `lib/api/types.ts` — API 요청/응답 DTO 타입 (백엔드 Pydantic 스키마와 대응)

### T-820 서비스 인터페이스 및 Mock 구현체

- `lib/services/interface.ts` — 5개 서비스 인터페이스 정의
  - `IDocumentService` (getList, getById, upload, updateMetadata, delete, updateVersion)
  - `IOcrService` (start, getStatus, cancel, getResult, getSections, getImages)
  - `IStatisticsService` (getOverview, getMonthly, getUserStats, getDetail)
  - `ITemplateService` (getList, create, delete)
  - `IAuthService` (login, refresh, getProfile)
- `lib/services/mock/` — Mock 구현체 5개 (기존 `lib/mock/index.ts` 데이터 활용)
  - `setTimeout` 지연 시뮬레이션 (200~500ms)
  - 상태 변경은 메모리 처리 (새로고침 시 초기화)
- `lib/services/index.ts` — 팩토리 함수 (`NEXT_PUBLIC_API_MODE`로 mock/real 전환)
  - 도메인별 독립 전환 지원 (`NEXT_PUBLIC_API_MODE_DOCUMENT=real` 등)

### T-830 Real 서비스 구현체 (백엔드 API 연동)

- `lib/services/real/` — Real 구현체 5개 (HTTP 클라이언트 사용)
  - `lib/api/client.ts` 활용
  - `lib/api/endpoints.ts` 상수 참조
  - 응답 DTO → 도메인 모델 변환 로직 포함
- UI 컴포넌트의 더미 데이터 호출을 서비스 레이어 호출로 교체
- `lib/actions/` — Server Actions 구현 (서비스 호출 래퍼)
  - `document.actions.ts`, `ocr.actions.ts`, `template.actions.ts`
  - Zod 입력 검증 → 서비스 호출 → `revalidatePath`
- `lib/validations/` — Zod 스키마 작성 (document.ts, ocr.ts, template.ts, auth.ts)
- Playwright MCP를 활용한 API 연동 E2E 테스트

### T-840 타입 정합성 보정 (DocumentStatus, DTO 변환)

- `lib/types/index.ts` 수정:
  - `DocumentStatus`에 `upload_fail` 추가
  - `draft` 상태 제거 또는 재정의
  - 백엔드 Enum(UPLOADED/UPLOAD_FAIL/OCR_EXTRACTING/OCR_ACTED/OCR_EXTRACT_FAIL)과 프론트 Enum(uploaded/upload_fail/ocr_processing/ocr_completed/ocr_failed) 매핑
- `lib/services/real/` 응답 변환 레이어:
  - 백엔드 status 값 → 프론트 status 값 자동 변환
  - 날짜 형식 변환 (ISO 8601)
  - 파일 크기 단위 변환
- `lib/mock/index.ts` — `statusLabels`, `statusVariants` 업데이트 (`upload_fail` 추가)

---

## Phase 9: 통합 테스트 및 최적화

| Task ID | 태스크 | 의존성 | 상태 |
|---------|--------|--------|------|
| T-900 | 핵심 사용자 플로우 E2E 테스트 | Phase 3~8 | ⬜ |
| T-910 | 성능 최적화 및 접근성 | T-900 | ⬜ |
| T-920 | 배포 준비 | T-910 | ⬜ |

### T-900 핵심 사용자 플로우 E2E 테스트

- Playwright MCP를 활용한 전체 사용자 플로우 테스트
- **테스트 시나리오:**
  1. 로그인 → 파일 관리 페이지 진입
  2. PDF 업로드 → 문서 목록 갱신 확인
  3. OCR 실행 → 진행 상황 모니터링 → 결과 확인
  4. 통계 대시보드 데이터 표시 검증
  5. 설정 페이지 프로필 수정/템플릿 관리
  6. 사용이력 조회 및 CSV 내보내기
- 에러 핸들링 및 엣지 케이스 테스트
- Mock/Real 모드 전환 테스트
- 데스크톱(1280px) + 모바일(375px) 반응형 검증

### T-910 성능 최적화 및 접근성

- Next.js Image 최적화
- 동적 임포트 (code splitting)
- 스켈레톤 로딩 UI 적용
- 반응형 디자인 최종 검증 (모바일 퍼스트)
- 다크모드 전환 검증
- 접근성 (a11y) 기본 준수

### T-920 배포 준비

- `next build` 성공 확인
- 환경변수 프로덕션 설정
- Nginx 리버스 프록시 설정 문서화
  - 배포 구조: `클라이언트 → Nginx → Next.js (3000) / FastAPI (8000)`
- 에러 모니터링 및 로깅 설정
- CI/CD 파이프라인 기본 구성

---

## 개발 의존성 그래프

```
Phase 0 (기반 정비) ✅ ─┬─ T-001 ShadcnUI + 디자인 토큰
                         ├─ T-002 네비게이션/유틸리티      (독립)
                         ├─ T-003 타입 정의                (독립)
                         └─ T-004 Mock 데이터              (T-003 이후)

Phase 1 (공통 레이아웃) ✅ ┬─ T-005 ThemeProvider/Toggle    (T-001 이후)
                           ├─ T-006 Header + MobileNav      (T-002, T-004, T-005 이후)
                           └─ T-007 Footer + 루트 레이아웃   (T-005, T-006 이후)

Phase 2 (랜딩 페이지) ✅ ── T-008 랜딩 페이지               (T-007 이후)

Phase 3 (파일관리) ✅ ─┬─ T-310 파일 리스트
                       ├─ T-320 업로드 Dialog
                       ├─ T-330 메타 수정 Dialog
                       ├─ T-340 삭제 확인 Dialog
                       └─ T-350 버전 업데이트

Phase 4 (OCR) ✅ ─┬─ T-410 OCR 트리거
                   ├─ T-420 프로세싱 뷰
                   └─ T-430 결과 뷰어

Phase 5 (통계) ─┬─ T-510 개요          (Phase 3 이후, 독립적)
               └─ T-520 상세          (T-510 이후)

Phase 6 (설정) ─┬─ T-610 설정 메인     (독립적)
               └─ T-620 사용이력      (T-610 이후)

Phase 7 (인증) ─┬─ T-710 로그인 페이지
               ├─ T-720 JWT 인증 로직  (T-710 이후)
               └─ T-730 라우트 보호    (T-720 이후)

Phase 8 (API 연동) ┬─ T-800 인프라 설정
                    ├─ T-810 HTTP 클라이언트     (T-800 이후)
                    ├─ T-820 서비스 인터페이스    (T-810 이후)
                    ├─ T-830 Real 구현체         (T-820 이후)
                    └─ T-840 타입 정합성 보정     (T-820 이후)

Phase 9 (테스트/배포) ┬─ T-900 E2E 테스트      (Phase 3~8 이후)
                      ├─ T-910 성능 최적화      (T-900 이후)
                      └─ T-920 배포 준비        (T-910 이후)
```

### 병렬 개발 가능 구간

| Phase | 병렬 가능 태스크 | 선행 조건 |
|-------|-----------------|----------|
| Phase 3 | T-320, T-330, T-340 동시 진행 가능 | T-310 파일 리스트 선행 필수 |
| Phase 4 | T-420, T-430 동시 진행 가능 | T-410 OCR 트리거 선행 필수 |
| Phase 5~6 | Phase 5 전체와 Phase 6 전체 동시 진행 가능 | Phase 3 완료 후 |
| Phase 7 | Phase 3~6과 독립적으로 진행 가능 | 독립적 |
| Phase 8 | T-830, T-840 동시 진행 가능 | T-820 서비스 인터페이스 선행 필수 |

---

## ShadcnUI 컴포넌트 설치 현황

| 컴포넌트 | 설치 상태 | 비고 |
|---------|---------|------|
| avatar | ✅ | Phase 0 설치 |
| badge | ✅ | Phase 0 설치 |
| button | ✅ | Phase 0 설치 |
| card | ✅ | Phase 0 설치 |
| dialog | ✅ | Phase 0 설치 |
| dropdown-menu | ✅ | Phase 0 설치 |
| input | ✅ | Phase 0 설치 |
| label | ✅ | Phase 0 설치 |
| separator | ✅ | Phase 0 설치 |
| sheet | ✅ | Phase 0 설치 |
| sonner | ✅ | Phase 0 설치 |
| tooltip | ✅ | Phase 0 설치 |
| alert-dialog | ✅ | 추가 설치됨 |
| breadcrumb | ✅ | 추가 설치됨 |
| chart | ✅ | 추가 설치됨 |
| calendar | ✅ | 추가 설치됨 (DateRangePicker용, react-day-picker + date-fns 의존) |
| checkbox | ✅ | Phase 3 설치 완료 |
| form | ✅ | 추가 설치됨 |
| pagination | ✅ | 추가 설치됨 |
| popover | ✅ | 추가 설치됨 (DateRangePicker용) |
| progress | ✅ | 추가 설치됨 |
| radio-group | ✅ | Phase 3 설치 완료 |
| resizable | ✅ | 추가 설치됨 |
| scroll-area | ✅ | 추가 설치됨 |
| select | ✅ | 추가 설치됨 |
| skeleton | ✅ | 추가 설치됨 |
| switch | ✅ | 추가 설치됨 |
| table | ✅ | 추가 설치됨 |
| tabs | ✅ | 추가 설치됨 |
| textarea | ✅ | 추가 설치됨 |

> 모든 ShadcnUI 컴포넌트 설치 완료

### DateRangePicker 공통 패턴

날짜 기간 필터가 필요한 모든 컴포넌트는 동일한 패턴을 사용한다:

- **의존성**: `popover` + `calendar` (ShadcnUI) + `react-day-picker` + `date-fns`
- **UI**: `Popover` → `PopoverTrigger`(버튼) + `PopoverContent`(`Calendar mode="range"`)
- **Props**: `dateRange: DateRange | undefined`, `onDateRangeChange: (range: DateRange | undefined) => void`
- **DateRange 타입**: `react-day-picker`의 `{ from?: Date; to?: Date }`
- **로케일**: `date-fns/locale`의 `ko` (한국어)
- **표시 형식**: `MM.dd ~ MM.dd` (`date-fns` `format`)
- **초기화**: Popover 내 초기화 버튼 + 트리거 버튼 X 아이콘
- **적용 대상**:
  - `FileFilterBar` — 파일 관리 기간 필터 (uploadedAt 기준) ✅ 구현 완료
  - `LogFilterBar` — 사용이력 기간 필터 (⬜ Phase 6)
  - `AnalyticsDetailPage` — 통계 상세 기간 필터 (⬜ Phase 5)

---

## 검증 방법

각 페이지 완성 후:
1. `next build` 성공 확인
2. Playwright 스크린샷 (데스크톱 1280px + 모바일 375px)
3. Figma `get_screenshot`과 시각 비교
4. 콘솔 에러 확인
5. 다크모드 전환 검증

API 연동 및 비즈니스 로직 구현 시:
1. Playwright MCP를 활용한 E2E 테스트
2. Mock/Real 모드 전환 테스트
3. 에러 핸들링 시나리오 테스트 (401, 403, 404, 500)
4. OCR 상태 폴링 동작 검증

---

## 기존 리소스 재활용

| 리소스 | 경로 | 활용처 |
|--------|------|--------|
| Mock 데이터 | `lib/mock/index.ts` | 모든 페이지 |
| 타입 정의 | `lib/types/index.ts` | 모든 컴포넌트 |
| 상태 라벨/배지 | `lib/mock/index.ts` | 파일 테이블 |
| 파일 크기 포맷 | `lib/mock/index.ts` (`formatFileSize`) | 파일 테이블 |
| 날짜 포맷 | `lib/mock/index.ts` (`formatDate`, `formatDateTime`) | 테이블, 로그 |
| 네비게이션 | `lib/navigation.ts` | Header, MobileNav |
| cn 유틸리티 | `lib/utils.ts` | 모든 컴포넌트 |

---

## 관련 문서

| 문서 | 경로 | 설명 |
|------|------|------|
| PRD | `.claude/agents/docs/PRD.md` | 제품 요구사항 명세서 |
| API 엔드포인트 명세 | `docs/API-ENDPOINTS.md` | 26개 REST API 상세 (prefix: `/api/v1/`) |
| API 클라이언트 아키텍처 | `docs/API-CLIENT.md` | Mock/Real 전환 가이드 |
| 컴포넌트 매핑 | `docs/COMPONENT-MAP.md` | Figma 프레임 → 컴포넌트 매핑 |
| CLAUDE.md | `CLAUDE.md` | 기술 스택, 코딩 컨벤션, DocumentStatus 매핑, OCR 파이프라인 |
