# 컴포넌트 매핑 테이블

## 개요

Figma 프레임 → 라우트 → 컴포넌트 파일 매핑.
각 컴포넌트별 ShadcnUI 의존성과 구현 상태를 추적한다.

---

## 라우팅 맵

| Figma ID | 페이지명 | 라우트 | 구현 방식 | 상태 |
|----------|---------|--------|---------|------|
| `1:5251` | 랜딩 | `/` | `app/page.tsx` | ✅ |
| `1:8516` | 파일관리 메인 | `/files` | `app/files/page.tsx` | ✅ |
| `1:6828` `1:8094` | 파일 업로드 | `/files` 내 Dialog | `components/features/files/upload-dialog.tsx` | ✅ |
| `1:5532` `1:6710` | 메타 수정 | `/files` 내 Dialog | `components/features/files/edit-metadata-dialog.tsx` | ✅ |
| `1:4950` `1:6936` | 삭제/초기화 확인 | 전역 모달 | `components/features/files/delete-confirm-dialog.tsx` | ✅ |
| `1:7958` `1:8204` | 버전 업데이트 | `/files/[id]/version` | `app/files/[id]/version/page.tsx` | ✅ |
| `1:5394` | OCR 트리거 | `/files/[id]/ocr` | `app/files/[id]/ocr/page.tsx` | ✅ |
| `1:5659` | OCR 프로세싱 | `/files/[id]/ocr` (상태) | `components/features/ocr/ocr-progress.tsx` | ✅ |
| `1:6020` `1:8337` | OCR 결과 뷰어 | `/files/[id]/result` | `app/files/[id]/result/page.tsx` | ✅ |
| `1:7583` | 통계 개요 | `/analytics` | `app/analytics/page.tsx` | ⬜ |
| `1:7237` | 통계 상세 | `/analytics/detail` | `app/analytics/detail/page.tsx` | ⬜ |
| `1:6215` `1:6441` | 설정 | `/settings` | `app/settings/page.tsx` | ⬜ |
| `1:5828` | 사용이력 | `/settings/logs` | `app/settings/logs/page.tsx` | ⬜ |

---

## Phase 3: 파일 관리 — 컴포넌트 분해

### T-310: 파일 관리 메인 리스트

| 컴포넌트 | 파일 경로 | ShadcnUI 의존성 | 설명 |
|---------|----------|----------------|------|
| FilesPage | `app/files/page.tsx` | - | 페이지 컨테이너 |
| FileFilterBar | `components/features/files/file-filter-bar.tsx` | input, popover, calendar | 탭 필터 + 기간 설정(DateRangePicker: 시작일~종료일 범위 선택, Popover+Calendar mode="range") + 검색 |
| FileTable | `components/features/files/file-table.tsx` | table, checkbox, badge, dropdown-menu | 문서 테이블 (체크박스, 상태배지, 액션) |
| FileTableRow | `components/features/files/file-table-row.tsx` | dropdown-menu, badge | 테이블 행 — 액션 드롭다운(MoreVertical 트리거, hover 시 표시): 메타데이터 수정(→EditMetadataDialog), 버전 업데이트(→/files/[id]/version), OCR 추출(조건부: uploaded/ocr_failed, →/files/[id]/ocr), 삭제(→DeleteConfirmDialog) |
| FilePagination | `components/features/files/file-pagination.tsx` | pagination, select | 페이지네이션 |

### T-320: 파일 업로드 Dialog

| 컴포넌트 | 파일 경로 | ShadcnUI 의존성 | 설명 |
|---------|----------|----------------|------|
| UploadDialog | `components/features/files/upload-dialog.tsx` | dialog, form, input, textarea, button | 드래그앤드롭 + 버전/설명 입력 + 프로그레스 |

### T-330: 메타데이터 수정 Dialog

| 컴포넌트 | 파일 경로 | ShadcnUI 의존성 | 설명 |
|---------|----------|----------------|------|
| EditMetadataDialog | `components/features/files/edit-metadata-dialog.tsx` | dialog, form, input, textarea, button | 파일명(읽기전용) + description 수정 |

### T-340: 삭제/초기화 확인 Dialog

| 컴포넌트 | 파일 경로 | ShadcnUI 의존성 | 설명 |
|---------|----------|----------------|------|
| DeleteConfirmDialog | `components/features/files/delete-confirm-dialog.tsx` | alert-dialog, input, button | 삭제 경고 + 확인 입력 |

### T-350: 버전 업데이트 페이지

| 컴포넌트 | 파일 경로 | ShadcnUI 의존성 | 설명 |
|---------|----------|----------------|------|
| VersionUpdatePage | `app/files/[id]/version/page.tsx` | card, select, form, input, button | 현재 버전 표시 + 메이저/마이너 선택 + 파일 업로드 |

---

## Phase 4: OCR 기능 — 컴포넌트 분해

### T-410: OCR 트리거 페이지

| 컴포넌트 | 파일 경로 | ShadcnUI 의존성 | 설명 |
|---------|----------|----------------|------|
| OcrTriggerPage | `app/files/[id]/ocr/page.tsx` | card, button | 페이지 컨테이너 |
| DocumentInfoCard | `components/features/ocr/document-info-card.tsx` | card, badge | 문서 정보 표시 카드 |
| TemplateSelector | `components/features/ocr/template-selector.tsx` | select, card | 템플릿 선택 |

### T-420: OCR 프로세싱 뷰

| 컴포넌트 | 파일 경로 | ShadcnUI 의존성 | 설명 |
|---------|----------|----------------|------|
| OcrProgressView | `components/features/ocr/ocr-progress.tsx` | card, progress, button | 전체 진행 상태 컨테이너 |
| PipelineStage | `components/features/ocr/pipeline-stage.tsx` | progress, badge | 개별 파이프라인 단계 표시 |
| OcrLogViewer | `components/features/ocr/ocr-log-viewer.tsx` | scroll-area, badge | 실시간 로그 뷰어 |

### T-430: OCR 결과 뷰어

| 컴포넌트 | 파일 경로 | ShadcnUI 의존성 | 설명 |
|---------|----------|----------------|------|
| OcrResultPage | `app/files/[id]/result/page.tsx` | resizable, tabs | 좌우 분할 레이아웃 |
| ExtractedDataGrid | `components/features/ocr/extracted-data-grid.tsx` | card, table, badge, tabs | 추출 데이터 그리드 (섹션별) |
| MetadataPanel | `components/features/ocr/metadata-panel.tsx` | card, separator | 메타데이터 패널 (우측) |
| SectionCard | `components/features/ocr/section-card.tsx` | card, badge | 개별 섹션 카드 |

---

## Phase 5: 통계 대시보드 — 컴포넌트 분해

### T-510: 통계 개요

| 컴포넌트 | 파일 경로 | ShadcnUI 의존성 | 설명 |
|---------|----------|----------------|------|
| AnalyticsPage | `app/analytics/page.tsx` | - | 페이지 컨테이너 |
| KpiCard | `components/features/analytics/kpi-card.tsx` | card, skeleton | KPI 카드 (총 업로드, OCR 완료, 대기 작업) |
| OcrBarChart | `components/features/analytics/ocr-bar-chart.tsx` | card, chart | 월별 OCR 처리 바 차트 |
| RecentActivityList | `components/features/analytics/recent-activity-list.tsx` | card, badge | 최근 활동 리스트 |
| UserStatsCard | `components/features/analytics/user-stats-card.tsx` | card, avatar | 사용자별 통계 카드 |

### T-520: 통계 상세

| 컴포넌트 | 파일 경로 | ShadcnUI 의존성 | 설명 |
|---------|----------|----------------|------|
| AnalyticsDetailPage | `app/analytics/detail/page.tsx` | card, chart, select, skeleton, popover, calendar | 상세 통계 (타임라인, 문서 유형, 에러 분포, 기간 필터: DateRangePicker 시작일~종료일 범위 선택) |

---

## Phase 6: 설정 — 컴포넌트 분해

### T-610: 설정 메인

| 컴포넌트 | 파일 경로 | ShadcnUI 의존성 | 설명 |
|---------|----------|----------------|------|
| SettingsPage | `app/settings/page.tsx` | tabs, breadcrumb | 탭 기반 설정 페이지 |
| ProfileTab | `components/features/settings/profile-tab.tsx` | form, input, button, avatar | 프로필 정보 수정 |
| TemplateManageTab | `components/features/settings/template-manage-tab.tsx` | table, button, badge | 템플릿 관리 |
| DataManageTab | `components/features/settings/data-manage-tab.tsx` | card, switch, button, alert-dialog | 데이터 관리 (초기화 등) |
| VersionInfoTab | `components/features/settings/version-info-tab.tsx` | card | 시스템 버전 정보 |
| TemplateAddDialog | `components/features/settings/template-add-dialog.tsx` | dialog, form, input, textarea | 템플릿 추가 다이얼로그 |

### T-620: 시스템 사용이력

| 컴포넌트 | 파일 경로 | ShadcnUI 의존성 | 설명 |
|---------|----------|----------------|------|
| LogsPage | `app/settings/logs/page.tsx` | breadcrumb | 페이지 컨테이너 |
| LogFilterBar | `components/features/settings/log-filter-bar.tsx` | select, input, button, popover, calendar | 필터 바 (타입, 사용자, 기간: DateRangePicker 시작일~종료일 범위 선택) |
| LogTable | `components/features/settings/log-table.tsx` | table, badge, pagination | 로그 테이블 |

---

## ShadcnUI 의존성 요약

### 설치 완료

alert-dialog, avatar, badge, breadcrumb, button, calendar, card, chart, checkbox, dialog, dropdown-menu, form, input, label, pagination, popover, progress, radio-group, resizable, scroll-area, select, separator, sheet, skeleton, sonner, switch, table, tabs, textarea, tooltip

> Phase 5~6에 필요한 컴포넌트 포함, 모두 설치 완료

---

## 기존 재활용 리소스

| 리소스 | 경로 | 활용 컴포넌트 |
|--------|------|-------------|
| Mock 문서 데이터 | `lib/mock/index.ts` → `mockDocuments` | FileTable, FileTableRow |
| Mock 사용자 데이터 | `lib/mock/index.ts` → `mockUsers`, `currentUser` | ProfileTab, UserStatsCard |
| Mock 템플릿 데이터 | `lib/mock/index.ts` → `mockTemplates` | TemplateSelector, TemplateManageTab |
| Mock 통계 데이터 | `lib/mock/index.ts` → `mockStatistics`, `mockMonthlyOcrData` | KpiCard, OcrBarChart |
| Mock 사용자 통계 | `lib/mock/index.ts` → `mockUserStats` | UserStatsCard |
| Mock 활동 로그 | `lib/mock/index.ts` → `mockActivityLogs` | RecentActivityList, LogTable |
| Mock 섹션 데이터 | `lib/mock/index.ts` → `mockSections`, `mockSectionImages` | ExtractedDataGrid, MetadataPanel |
| 상태 라벨/배지 | `lib/mock/index.ts` → `statusLabels`, `statusVariants` | FileTableRow, DocumentInfoCard |
| 파일 크기 포맷 | `lib/mock/index.ts` → `formatFileSize()` | FileTable, DocumentInfoCard |
| 날짜 포맷 | `lib/mock/index.ts` → `formatDate()`, `formatDateTime()` | FileTable, LogTable |
| 도메인 타입 | `lib/types/index.ts` | 모든 컴포넌트 |
| cn 유틸리티 | `lib/utils.ts` | 모든 컴포넌트 |
| 네비게이션 설정 | `lib/navigation.ts` | Header, MobileNav |
