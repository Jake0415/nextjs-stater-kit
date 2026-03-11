# MH-OCR-AI 개발 로드맵

PDF 문서를 AI 파이프라인으로 자동 분석하여 구조화된 메타데이터로 변환하는 내부 도구

## 개요

MH-OCR-AI는 PDF 기술 문서를 대량 처리하는 내부 사용자를 위한 OCR 자동화 서비스로 다음 기능을 제공합니다:

- **문서 관리**: PDF 업로드, 목록 조회, 버전 관리, 수정/삭제 (F001~F004)
- **OCR 추출**: 4단계 AI 파이프라인 실행, 진행 모니터링, 결과 조회 및 내보내기 (F005~F008)
- **통계 대시보드**: KPI 카드, 월별 차트, 사용자별 통계, 상세 분석 (F009)
- **인증 및 설정**: JWT 인증, 프로필/템플릿/데이터 관리, 사용이력 (F010~F014)

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프론트엔드 | Next.js 16 (App Router) + React 19 + TypeScript |
| 스타일링 | TailwindCSS v4 + ShadcnUI (new-york) + Lucide React |
| 백엔드 | FastAPI (Python, 포트 8000) |
| 데이터베이스 | PostgreSQL (문서/사용자) + MongoDB (OCR 결과/벡터) |
| 스토리지 | MinIO (이미지 오브젝트) |
| 인증 | JWT (Bearer 토큰) |
| API 모드 | Mock/Real 이중 모드 (`NEXT_PUBLIC_API_MODE`) |

## 개발 워크플로우

1. **작업 계획**
   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - 새로운 작업을 포함하도록 `ROADMAP.md` 업데이트
   - 우선순위 작업은 마지막 완료된 작업 다음에 삽입

2. **작업 생성**
   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - `/tasks` 디렉토리에 새 작업 파일 생성
   - 명명 형식: `XXX-description.md` (예: `001-setup.md`)
   - 고수준 명세서, 관련 파일, 수락 기준, 구현 단계 포함
   - API/비즈니스 로직 작업 시 "## 테스트 체크리스트" 섹션 필수 포함 (Playwright MCP 테스트 시나리오 작성)
   - 예시를 위해 `/tasks` 디렉토리의 마지막 완료된 작업 참조

3. **작업 구현**
   - 작업 파일의 명세서를 따름
   - 기능과 기능성 구현
   - API 연동 및 비즈니스 로직 구현 시 Playwright MCP로 테스트 수행 필수
   - 각 단계 후 작업 파일 내 단계 진행 상황 업데이트
   - 구현 완료 후 Playwright MCP를 사용한 E2E 테스트 실행
   - 각 단계 완료 후 중단하고 추가 지시를 기다림

4. **로드맵 업데이트**
   - 로드맵에서 완료된 작업을 완료로 표시

---

## 개발 단계

### Phase 0: 프로젝트 기반 정비 -- 완료

- **Task 001: 디자인 토큰 및 테마 설정** -- 완료
  - See: 기존 완료 작업
  - 완료: TailwindCSS v4 디자인 토큰 적용
  - 완료: next-themes 다크모드 설정
  - 완료: ShadcnUI new-york 스타일 설정

- **Task 002: 네비게이션 구조 설정** -- 완료
  - See: `lib/navigation.ts`
  - 완료: 메인 네비게이션 링크 정의 (파일 관리, 통계, 설정)
  - 완료: 외부 서비스 링크 구조 정의

- **Task 003: TypeScript 타입 및 인터페이스 정의** -- 완료
  - See: `lib/types/index.ts`
  - 완료: 도메인 모델 타입 정의 (Document, Section, SectionImage, Template, User)
  - 완료: OCR 파이프라인 타입 정의 (OcrStage, OcrProgress, OcrLog)
  - 완료: 통계/로그 타입 정의 (Statistics, MonthlyOcrData, UserStats, ActivityLog)

- **Task 004: Mock 데이터 및 유틸리티 생성** -- 완료
  - See: `lib/mock/index.ts`
  - 완료: 전체 도메인 Mock 데이터 생성 (문서 12건, 사용자 4명, 템플릿 3건)
  - 완료: 상태 라벨/배지 매핑, 포맷 유틸리티 함수

### Phase 1: 공통 레이아웃 -- 완료

- **Task 005: 헤더 컴포넌트 구현** -- 완료
  - See: `components/layout/header.tsx`
  - 완료: 데스크톱/모바일 반응형 헤더
  - 완료: 로고, 네비게이션 링크, 테마 토글, 사용자 메뉴

- **Task 006: 모바일 네비게이션 구현** -- 완료
  - See: `components/layout/mobile-nav.tsx`
  - 완료: Sheet 기반 모바일 사이드 메뉴

- **Task 007: 푸터 컴포넌트 구현** -- 완료
  - See: `components/layout/footer.tsx`
  - 완료: 저작권 정보 및 외부 링크

### Phase 2: 랜딩 페이지 -- 완료

- **Task 008: 랜딩 페이지 UI 구현** -- 완료
  - See: `app/page.tsx`
  - 완료: 히어로 섹션 + 기능 카드 + 특장점 섹션
  - 완료: 반응형 레이아웃 및 다크모드 지원

---

### Phase 3: 파일 관리 UI (더미 데이터)

> **목표**: 파일 관리 전체 페이지와 다이얼로그 UI를 더미 데이터로 완성
> **관련 기능**: F001 (문서 업로드), F002 (목록 조회), F003 (수정/삭제), F004 (버전 업데이트)
> **라우트**: `/files`, `/files/[id]/version`

- **Task 009: 파일 관리 메인 페이지 UI 구현** - 우선순위
  - 파일 경로: `app/files/page.tsx`
  - Figma: `1:8516`
  - 문서 테이블 UI 구현 (체크박스, 문서명, 버전, 크기, 페이지수, 상태 배지, 업로더, 업로드일, 액션 드롭다운)
  - 상태 탭 필터 구현 (전체 / UPLOADED / OCR_EXTRACTING / OCR_ACTED / UPLOAD_FAIL / OCR_EXTRACT_FAIL)
  - 파일명 검색 입력, 기간 필터, 정렬 기능 UI
  - 페이지네이션 컴포넌트 (기본 10개)
  - [파일 업로드] 버튼 및 UPLOADED 상태 행 [OCR 추출] 버튼 배치
  - 컴포넌트 분해: `FileFilterBar`, `FileTable`, `FileTableRow`, `FilePagination`
  - 컴포넌트 경로: `components/features/files/`

- **Task 010: 파일 업로드 다이얼로그 UI 구현**
  - 파일 경로: `components/features/files/upload-dialog.tsx`
  - Figma: `1:6828`, `1:8094`
  - 드래그앤드롭 영역 + [파일 찾기] 버튼 UI
  - PDF 전용 파일 유효성 표시 (50MB 제한 안내)
  - 버전 입력 필드 (v1.0 형식) 및 설명 입력 필드
  - 업로드 프로그레스바 UI
  - 성공/실패 모달 상태 UI

- **Task 011: 메타데이터 수정 다이얼로그 UI 구현**
  - 파일 경로: `components/features/files/edit-metadata-dialog.tsx`
  - Figma: `1:5532`, `1:6710`
  - 파일명 표시 (읽기 전용) + 설명 텍스트 영역 (수정 가능)
  - [저장] / [취소] 버튼

- **Task 012: 삭제 확인 다이얼로그 UI 구현**
  - 파일 경로: `components/features/files/delete-confirm-dialog.tsx`
  - Figma: `1:4950`, `1:6936`
  - AlertDialog 기반 삭제 경고 UI
  - 삭제 대상 문서명 표시 및 위험 액션 [삭제] 버튼 (빨간색)

- **Task 013: 버전 업데이트 페이지 UI 구현**
  - 파일 경로: `app/files/[id]/version/page.tsx`
  - Figma: `1:7958`, `1:8204`
  - 현재 버전 표시 (v1.0 형식)
  - 업데이트 유형 선택 UI (메이저/마이너 라디오 버튼)
  - 새 PDF 업로드 영역 (드래그앤드롭, 50MB 제한)
  - 변경 설명 입력 필드 및 버전 이력 목록 표시
  - [업데이트] 버튼

---

### Phase 4: OCR 기능 UI (더미 데이터)

> **목표**: OCR 실행/모니터링/결과 조회 전체 UI를 더미 데이터로 완성
> **관련 기능**: F005 (OCR 실행), F006 (진행 모니터링), F007 (결과 조회), F008 (내보내기)
> **라우트**: `/files/[id]/ocr`, `/files/[id]/result`

- **Task 014: OCR 실행 페이지 UI 구현 (실행 전 상태)** - 우선순위
  - 파일 경로: `app/files/[id]/ocr/page.tsx`
  - Figma: `1:5394`
  - 우측 파일 정보 패널 (파일명, 용량, 버전, 업로더)
  - 템플릿 선택 드롭다운 UI
  - [OCR 텍스트 추출 시작] 버튼
  - 컴포넌트 분해: `DocumentInfoCard`, `TemplateSelector`
  - 컴포넌트 경로: `components/features/ocr/`

- **Task 015: OCR 프로세싱 뷰 UI 구현 (실행 중 상태)**
  - 파일 경로: `components/features/ocr/ocr-progress.tsx`
  - Figma: `1:5659`
  - 전체 진행률(%) 프로그레스바 및 예상 남은 시간 표시
  - 4단계 파이프라인 리스트 UI (문서 전처리 / 텍스트 및 표 추출 / LLM 이미지 분석 / 메타데이터 합성)
  - 현재 활성 단계 시각적 강조
  - 실행 로그 스크롤 영역 (ScrollArea)
  - [X 프로세스 취소] 버튼 및 취소 확인 모달
  - 에러 상태 UI (실패 단계 표시, 툴팁 사유, [재시도] 버튼)
  - 컴포넌트 분해: `OcrProgressView`, `PipelineStage`, `OcrLogViewer`

- **Task 016: OCR 결과 페이지 UI 구현**
  - 파일 경로: `app/files/[id]/result/page.tsx`
  - Figma: `1:6020`, `1:8337`
  - 좌우 분할 레이아웃 (Resizable)
  - **텍스트 탭**: 섹션 목록 (SEC-XXXX, 페이지 번호, 미리보기) + 페이지네이션, 섹션 선택 시 우측 패널 (제목, 키워드, 전체 텍스트)
  - **이미지 탭**: 추출 이미지 그리드 보드 + 페이지네이션, 이미지 선택 시 우측 패널 (파일명, AI 설명, 출처, 페이지, 태그, 연결 섹션)
  - [텍스트 CSV 내보내기] 버튼, [이미지 다운로드] 버튼
  - [파일 관리로 돌아가기] 버튼
  - 컴포넌트 분해: `ExtractedDataGrid`, `MetadataPanel`, `SectionCard`

---

### Phase 5: 통계 대시보드 UI (더미 데이터)

> **목표**: 통계 개요 및 상세 페이지 UI를 더미 데이터로 완성
> **관련 기능**: F009 (통계 대시보드)
> **라우트**: `/analytics`, `/analytics/detail`

- **Task 017: 통계 개요 페이지 UI 구현** - 우선순위
  - 파일 경로: `app/analytics/page.tsx`
  - Figma: `1:7583`
  - KPI 카드 3개 (총 업로드 수, OCR 완료 수, 대기 작업 수 + 전월 대비 변화율)
  - 월별 OCR 처리 바 차트 (최근 6개월, 완료/실패 구분, ShadcnUI Chart)
  - 최근 활동 내역 리스트
  - 사용자별 처리 통계 카드 (처리 건수, 성공률)
  - [상세 보기] 버튼
  - 컴포넌트 분해: `KpiCard`, `OcrBarChart`, `RecentActivityList`, `UserStatsCard`
  - 컴포넌트 경로: `components/features/analytics/`

- **Task 018: 통계 상세 페이지 UI 구현**
  - 파일 경로: `app/analytics/detail/page.tsx`
  - Figma: `1:7237`
  - 기간 필터 (dateFrom ~ dateTo)
  - 그룹 기준 선택 (일별/주별/월별)
  - 타임라인 차트 (업로드/OCR 완료/OCR 실패)
  - 문서 유형별 처리 건수 표시
  - 에러 유형별 분포 표시
  - Skeleton 로딩 UI

---

### Phase 6: 설정 및 로그 UI (더미 데이터)

> **목표**: 설정 허브 및 사용이력 페이지 UI를 더미 데이터로 완성
> **관련 기능**: F011 (템플릿 관리), F012 (프로필), F013 (사용이력), F014 (데이터 초기화)
> **라우트**: `/settings`, `/settings/logs`

- **Task 019: 설정 페이지 UI 구현** - 우선순위
  - 파일 경로: `app/settings/page.tsx`
  - Figma: `1:6215`, `1:6441`
  - 탭 기반 레이아웃 (프로필 / 템플릿 관리 / 데이터 관리 / 버전 정보)
  - **프로필 탭**: 이름/이메일/부서 입력 폼 + [저장] 버튼
  - **템플릿 관리 탭**: 템플릿 목록 테이블 (이름, 코드번호, 설명, 생성일) + [템플릿 추가] 다이얼로그 + 행별 [삭제] 버튼, 관리자/일반 사용자 권한 분기 UI
  - **데이터 관리 탭**: 초기화 대상 선택 (문서/로그/전체) + 확인 텍스트 입력 ("데이터 초기화") + [초기화 실행] 버튼 (관리자 전용)
  - **버전 정보 탭**: 시스템 버전, 빌드 정보 (정적)
  - [사용이력 보기] 버튼
  - 컴포넌트 분해: `ProfileTab`, `TemplateManageTab`, `DataManageTab`, `VersionInfoTab`, `TemplateAddDialog`
  - 컴포넌트 경로: `components/features/settings/`

- **Task 020: 사용이력 페이지 UI 구현**
  - 파일 경로: `app/settings/logs/page.tsx`
  - Figma: `1:5828`
  - 필터 바 (로그 타입, 사용자, 기간)
  - 로그 테이블 (타입 배지, 메시지, 사용자, 타임스탬프) + 페이지네이션 (기본 20개)
  - [CSV 내보내기] 버튼
  - 관리자: 전체 사용자 로그 조회 (userId 필터 포함)
  - 컴포넌트 분해: `LogFilterBar`, `LogTable`

---

### Phase 7: 로그인 및 인증 UI

> **목표**: 인증 화면 UI 및 보호 라우트 구조 구현
> **관련 기능**: F010 (기본 인증)
> **라우트**: `/login`

- **Task 021: 로그인 페이지 UI 구현** - 우선순위
  - 파일 경로: `app/login/page.tsx`
  - 아이디/패스워드 입력 폼 (React Hook Form + Zod 유효성 검사)
  - [로그인] 버튼
  - 로그인 실패 에러 메시지 표시 UI (INVALID_CREDENTIALS, ACCOUNT_LOCKED)
  - 로그인 페이지 전용 레이아웃 (헤더/푸터 없음)

- **Task 022: 인증 보호 라우트 구조 구현**
  - 파일 경로: `lib/auth.ts`, `components/providers/auth-provider.tsx`
  - 인증 상태 관리 Provider (React Context)
  - 미인증 시 `/login` 리디렉션 미들웨어 구조
  - JWT 토큰 저장/갱신 유틸리티 구조 (클라이언트 사이드)
  - 관리자/일반 사용자 역할 분기 유틸리티

---

### Phase 8: API 클라이언트 및 서비스 레이어 구축

> **목표**: Mock/Real 이중 모드 API 클라이언트와 서비스 계층 구현
> **관련 문서**: `docs/API-CLIENT.md`, `docs/API-ENDPOINTS.md`

- **Task 023: API 클라이언트 기반 구축** - 우선순위
  - 파일 경로: `lib/api/client.ts`, `lib/api/config.ts`
  - Fetch 기반 HTTP 클라이언트 구현 (인터셉터, 에러 핸들링)
  - `NEXT_PUBLIC_API_MODE=mock|real` 환경변수 기반 모드 전환
  - JWT Bearer 토큰 자동 주입 인터셉터
  - 공통 에러 타입 및 응답 래퍼 타입 정의
  - 요청/응답 DTO 타입 정의 (Zod 스키마)

- **Task 024: Mock API 어댑터 구현**
  - 파일 경로: `lib/api/mock/`
  - 기존 `lib/mock/index.ts` 데이터를 활용한 Mock 응답 어댑터
  - 인증 Mock (로그인/토큰 갱신)
  - 문서 CRUD Mock (목록/상세/업로드/수정/삭제/버전 업데이트)
  - OCR Mock (시작/상태 폴링/취소/결과)
  - 통계 Mock (개요/월별/사용자별/상세)
  - 설정 Mock (프로필/템플릿/로그/데이터 초기화)

- **Task 025: 서비스 레이어 구현**
  - 파일 경로: `lib/services/`
  - `AuthService` - 로그인, 토큰 갱신, 로그아웃
  - `DocumentService` - 문서 CRUD, 버전 관리, 내보내기
  - `OcrService` - OCR 시작, 상태 폴링, 취소, 결과/섹션/이미지 조회
  - `StatisticsService` - 통계 개요, 월별, 사용자별, 상세
  - `SettingsService` - 프로필, 템플릿, 로그, 데이터 초기화

---

### Phase 9: 핵심 비즈니스 로직 연동

> **목표**: UI에 하드코딩된 더미 데이터를 서비스 레이어 호출로 교체하고 비즈니스 로직 구현
> **테스트**: 모든 Task에 Playwright MCP E2E 테스트 포함

- **Task 026: 인증 로직 연동** - 우선순위
  - 로그인 폼 제출 시 `AuthService.login()` 호출
  - JWT 토큰 저장 (localStorage/쿠키) 및 자동 갱신
  - 로그아웃 처리 및 토큰 제거
  - 인증 미들웨어 활성화 (보호 라우트 리디렉션)
  - Playwright MCP 테스트: 로그인 성공/실패, 미인증 리디렉션, 토큰 만료

- **Task 027: 문서 관리 로직 연동**
  - 파일 목록 API 호출 (필터/검색/정렬/페이지네이션)
  - 파일 업로드 로직 (multipart/form-data, 프로그레스 추적, 유효성 검사)
  - 메타데이터 수정 (PATCH) 및 삭제 (soft delete) 로직
  - 버전 업데이트 로직 (메이저/마이너 분기, 새 PDF 업로드)
  - 관리자 전체 문서 조회 권한 분기
  - Playwright MCP 테스트: 업로드 플로우, 목록 필터링, 수정/삭제, 버전 업데이트

- **Task 028: OCR 기능 로직 연동**
  - OCR 시작 API 호출 (템플릿 선택 포함)
  - 상태 폴링 구현 (2초 간격, 4단계 파이프라인 진행률 반영)
  - OCR 취소 로직 및 확인 모달
  - 결과 페이지 데이터 바인딩 (섹션 목록, 이미지 목록)
  - CSV 내보내기 및 이미지 다운로드 로직
  - 에러 상태 처리 (실패 단계 표시, 재시도)
  - Playwright MCP 테스트: OCR 시작 -> 진행 모니터링 -> 완료/실패, 취소, 결과 조회, 내보내기

- **Task 029: 통계 및 설정 로직 연동**
  - 통계 개요/상세 API 호출 및 차트 데이터 바인딩
  - 프로필 조회/수정 로직
  - 템플릿 CRUD 로직 (관리자 권한 분기)
  - 사용이력 조회 (필터/페이지네이션) 및 CSV 내보내기
  - 데이터 초기화 로직 (관리자 전용, 확인 텍스트 검증)
  - Playwright MCP 테스트: 통계 로딩, 프로필 수정, 템플릿 추가/삭제, 로그 필터링, 데이터 초기화

- **Task 030: 핵심 기능 통합 테스트**
  - Playwright MCP를 사용한 전체 사용자 여정 E2E 테스트
  - 로그인 -> 파일 업로드 -> OCR 실행 -> 결과 확인 -> 내보내기 전체 플로우
  - 관리자/일반 사용자 권한별 접근 제어 검증
  - 에러 핸들링 및 엣지 케이스 테스트 (50MB 초과, 잘못된 파일 형식, 네트워크 오류)
  - 반응형 레이아웃 테스트 (데스크톱 1280px + 모바일 375px)

---

### Phase 10: 성능 최적화 및 배포

> **목표**: 프로덕션 품질 달성 및 배포 파이프라인 구축

- **Task 031: 성능 최적화**
  - React Server Components 최적화 (클라이언트 번들 최소화)
  - 이미지 최적화 (Next.js Image 컴포넌트)
  - 데이터 페칭 캐싱 전략 (SWR 또는 React Query)
  - 코드 스플리팅 및 지연 로딩
  - Skeleton UI 로딩 상태 전체 적용

- **Task 032: 배포 및 CI/CD 파이프라인 구축**
  - 환경변수 설정 (production/staging)
  - Next.js 빌드 최적화 및 정적 분석
  - Git 기반 CI/CD 파이프라인 구성 (자동 빌드/배포)
  - 에러 모니터링 및 로깅 시스템 연동
  - `next build` 성공 검증 및 Lighthouse 성능 점수 확인

---

## 타입 정의 현황 (PRD 도메인 모델 매핑)

> 현재 `lib/types/index.ts`에 정의된 타입과 PRD 도메인 모델 간 정합성

| PRD 도메인 | 현재 타입 | 상태 | 비고 |
|-----------|---------|------|------|
| Document | `Document` | 정의됨 | status Enum 값 PRD와 일치 필요 (UPLOADED/OCR_EXTRACTING 등) |
| User | `User` | 정의됨 | email, department, username 필드 추가 필요 |
| Template | `Template` | 정의됨 | schema(JSONB) 필드 추가 필요 |
| Section | `Section` | 정의됨 | PRD의 section_id(SEC-XXXX), title, keyword 필드 반영 필요 |
| SectionImage | `SectionImage` | 정의됨 | PRD의 image_url, type(Enum) 필드 반영 필요 |
| Metadata | 미정의 | 추가 필요 | Document 1:0..1 관계 |
| OcrProgress | `OcrProgress` | 정의됨 | estimatedRemaining 필드 추가 필요 |
| Statistics | `Statistics` | 정의됨 | - |
| ActivityLog | `ActivityLog` | 정의됨 | - |
| VersionHistory | 미정의 | 추가 필요 | 버전 업데이트 페이지용 |
| DetailStatistics | 미정의 | 추가 필요 | 통계 상세 페이지용 |

> 타입 보강은 Phase 8 (Task 023) 에서 API DTO 타입 정의 시 함께 수행

---

## ShadcnUI 컴포넌트 현황

| 컴포넌트 | 설치 상태 | 사용 Phase |
|---------|---------|-----------|
| avatar, badge, button, card, dialog, dropdown-menu, input, label, separator, sheet, sonner, tooltip | 설치됨 | 전체 |
| table, select, pagination, tabs, form, textarea, alert-dialog | 설치됨 | Phase 3+ |
| progress, scroll-area, resizable | 설치됨 | Phase 4+ |
| chart, skeleton | 설치됨 | Phase 5+ |
| switch, breadcrumb | 설치됨 | Phase 6+ |

> 모든 ShadcnUI 컴포넌트가 이미 설치 완료 상태. 별도 설치 Task 불필요.

---

## 개발 의존성 그래프

```
Phase 0~2 (완료) ─── 프로젝트 기반, 레이아웃, 랜딩 페이지

Phase 3 (파일 관리 UI) ─┬─ Task 009 파일 리스트 (먼저)
                         ├─ Task 010 업로드 Dialog      (Task 009 이후)
                         ├─ Task 011 메타 수정 Dialog    (Task 009 이후)
                         ├─ Task 012 삭제 확인 Dialog    (Task 009 이후)
                         └─ Task 013 버전 업데이트       (Task 009 이후)

Phase 4 (OCR UI) ──────┬─ Task 014 OCR 트리거     (Phase 3 이후)
                        ├─ Task 015 프로세싱 뷰    (Task 014 이후)
                        └─ Task 016 결과 뷰어      (Task 014 이후)

Phase 5 (통계 UI) ─────┬─ Task 017 개요           (독립적, Phase 3 이후)
                        └─ Task 018 상세           (Task 017 이후)

Phase 6 (설정 UI) ─────┬─ Task 019 설정 메인      (독립적)
                        └─ Task 020 사용이력       (Task 019 이후)

Phase 7 (인증 UI) ─────┬─ Task 021 로그인 페이지   (독립적)
                        └─ Task 022 보호 라우트     (Task 021 이후)

Phase 8 (API 레이어) ──┬─ Task 023 API 클라이언트  (Phase 3~7 이후)
                        ├─ Task 024 Mock 어댑터    (Task 023 이후)
                        └─ Task 025 서비스 레이어   (Task 024 이후)

Phase 9 (로직 연동) ───┬─ Task 026 인증 연동       (Phase 8 이후)
                        ├─ Task 027 문서 관리 연동  (Task 026 이후)
                        ├─ Task 028 OCR 연동       (Task 027 이후)
                        ├─ Task 029 통계/설정 연동  (Task 026 이후)
                        └─ Task 030 통합 테스트     (Task 027~029 이후)

Phase 10 (배포) ───────┬─ Task 031 성능 최적화     (Phase 9 이후)
                        └─ Task 032 CI/CD 구축     (Task 031 이후)
```

---

## 병렬 개발 가능 구간

| 구간 | 병렬 작업 | 조건 |
|------|---------|------|
| Phase 3 내부 | Task 010~013은 Task 009 완료 후 동시 진행 가능 | Task 009 완료 |
| Phase 4~6 | Phase 5(통계)와 Phase 6(설정)은 Phase 3 완료 후 독립 진행 가능 | Phase 3 완료 |
| Phase 7 | 인증 UI는 Phase 3~6과 독립적으로 병행 가능 | 없음 |
| Phase 9 내부 | Task 029(통계/설정)는 Task 027(문서 관리)과 독립 진행 가능 | Task 026 완료 |

---

## 검증 방법

각 페이지/기능 완성 후:
1. `next build` 성공 확인
2. Playwright MCP 스크린샷 (데스크톱 1280px + 모바일 375px)
3. Figma `get_screenshot`과 시각 비교
4. 콘솔 에러 확인
5. 다크모드 전환 검증
6. API 연동 Task는 Playwright MCP로 E2E 테스트 수행

---

## 기존 리소스 재활용

| 리소스 | 경로 | 활용처 |
|--------|------|--------|
| Mock 데이터 | `lib/mock/index.ts` | Phase 3~7 모든 UI 페이지 |
| 타입 정의 | `lib/types/index.ts` | 모든 컴포넌트 |
| 상태 라벨/배지 | `lib/mock/index.ts` | 파일 테이블, 로그 테이블 |
| 포맷 유틸리티 | `lib/mock/index.ts` (`formatFileSize`, `formatDate`, `formatDateTime`) | 테이블, 카드 |
| 네비게이션 | `lib/navigation.ts` | Header, MobileNav |
| cn 유틸리티 | `lib/utils.ts` | 모든 컴포넌트 |

---

## 라우팅 매핑 (전체)

| 페이지 | 라우트 | 파일 경로 | Phase |
|--------|--------|---------|-------|
| 랜딩 | `/` | `app/page.tsx` | 완료 |
| 로그인 | `/login` | `app/login/page.tsx` | 7 |
| 파일 관리 | `/files` | `app/files/page.tsx` | 3 |
| 버전 업데이트 | `/files/[id]/version` | `app/files/[id]/version/page.tsx` | 3 |
| OCR 실행 | `/files/[id]/ocr` | `app/files/[id]/ocr/page.tsx` | 4 |
| OCR 결과 | `/files/[id]/result` | `app/files/[id]/result/page.tsx` | 4 |
| 통계 개요 | `/analytics` | `app/analytics/page.tsx` | 5 |
| 통계 상세 | `/analytics/detail` | `app/analytics/detail/page.tsx` | 5 |
| 설정 | `/settings` | `app/settings/page.tsx` | 6 |
| 사용이력 | `/settings/logs` | `app/settings/logs/page.tsx` | 6 |
