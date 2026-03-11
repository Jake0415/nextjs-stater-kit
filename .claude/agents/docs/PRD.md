# MH-OCR-AI MVP PRD

> **Figma 디자인**: https://www.figma.com/design/mxCTZeei87Q5piZ75HINFq/MH-OCR-AI?node-id=1-5394&t=mXRZYVfzf3fdwCWk-0
> **관련 문서**: `docs/API-ENDPOINTS.md` | `docs/API-CLIENT.md` | `docs/COMPONENT-MAP.md` | `.claude/agents/docs/ROADMAP.md`

---

## 핵심 정보

**목적**: PDF 문서를 업로드하면 AI 파이프라인이 텍스트/표/이미지를 자동 추출하여 구조화된 메타데이터로 변환한다.
**사용자**: PDF 기술 문서를 대량으로 처리해야 하는 내부 사용자 (관리자 계정 / 일반 사용자 계정, 아이디+패스워드 인증)

---

## 사용자 여정

```
1. 로그인 페이지
   ↓ 아이디/패스워드 입력 후 [로그인] 클릭

2. 파일 관리 페이지 (기본 진입점)
   ↓ [파일 업로드] 버튼 클릭

3. 파일 업로드 다이얼로그 (파일 관리 페이지 내 오버레이)
   ↓ PDF 드래그앤드롭 또는 파일 선택 → 버전/설명 입력 → [업로드] 클릭
   ↓
   [성공] → 업로드 완료 모달 → 파일 관리 페이지로 복귀 (상태: UPLOADED)
   [실패] → 에러 모달 (형식 불일치 / 50MB 초과 / 서버 오류)

4. 파일 관리 페이지 (문서 목록 확인)
   ↓ UPLOADED 상태 행의 [OCR 추출] 버튼 클릭

5. OCR 실행 페이지
   ↓ 문서 정보 확인 + 템플릿 선택 → [OCR 텍스트 추출 시작] 클릭
   ↓
   OCR 프로세싱 뷰로 전환 (동일 페이지 상태 변경)
   ↓ 4단계 파이프라인 진행 (문서 전처리 → 텍스트/표 추출 → LLM 이미지 분석 → 메타데이터 합성)
   ↓
   [완료 (OCR_ACTED)] → OCR 결과 페이지로 이동
   [실패 (OCR_EXTRACT_FAIL)] → 에러 안내 + [재시도] 버튼
   [취소] → 파일 관리 페이지로 복귀 (상태: OCR 취소)

6. OCR 결과 페이지
   ↓ 섹션 목록 탐색 (페이지네이션) + 섹션 선택 시 제목/키워드 우측 패널 표시
   ↓ 이미지 탭 전환 시 보드 형태로 추출 이미지 표시
   ↓
   [텍스트 CSV 내보내기] → 파일 다운로드
   [이미지 다운로드] → 파일 다운로드
   [파일 관리로 돌아가기] → 파일 관리 페이지

7. 버전 업데이트 페이지 (선택 흐름)
   ↓ 파일 관리 페이지에서 행 드롭다운 → [버전 업데이트] 선택
   ↓ 메이저/마이너 선택 + 새 PDF 업로드 → [업데이트] 클릭
   → 파일 관리 페이지로 복귀

8. 통계 개요 페이지 (독립 흐름)
   ↓ 헤더 네비게이션 → [통계] 클릭
   ↓ KPI 카드 + 월별 차트 + 최근 활동 확인
   ↓ [상세 보기] 클릭
   → 통계 상세 페이지

9. 설정 페이지 (독립 흐름)
   ↓ 헤더 네비게이션 → [설정] 클릭
   ↓ 프로필 탭 / 템플릿 관리 탭 / 데이터 관리 탭 / 버전 정보 탭
   ↓ 탭 전환 → [사용이력 보기] 클릭
   → 사용이력 페이지
```

---

## 기능 명세

### 1. MVP 핵심 기능

| ID | 기능명 | 설명 | MVP 필수 이유 | 관련 페이지 |
|----|--------|------|-------------|------------|
| **F001** | 문서 업로드 | PDF(50MB 이하) 드래그앤드롭 또는 파일 선택, 버전/설명 입력, 업로드 프로그레스 표시 | 서비스 핵심 진입점, 모든 기능의 전제 조건 | 파일 관리 페이지, 파일 업로드 다이얼로그 |
| **F002** | 문서 목록 조회 | 테이블 형식으로 문서 목록 표시, 상태 배지, 페이지네이션, 파일명 검색, 상태 필터링. 관리자는 전체 사용자 문서 조회 가능 | 업로드된 문서 현황 파악 및 OCR 작업 트리거 기점 | 파일 관리 페이지 |
| **F003** | 문서 수정/삭제 | 설명(description)만 수정 가능. 삭제 시 확인 모달 후 soft delete 처리 | 데이터 정확성 유지 | 파일 관리 페이지, 메타데이터 수정 다이얼로그, 삭제 확인 다이얼로그 |
| **F004** | 문서 버전 업데이트 | 기존 문서에 새 PDF 업로드, 메이저(정수)/마이너(소수점 첫째자리) 선택, v1.0 형식으로 버전 관리 | 문서 이력 관리, 개정 추적 | 버전 업데이트 페이지 |
| **F005** | OCR 추출 실행 | 업로드 완료 문서에 대해 OCR 파이프라인 실행. 템플릿 선택 후 4단계 자동 처리: 문서 전처리 → 텍스트/표 추출 → LLM 이미지 분석 → 메타데이터 합성 | 서비스의 핵심 가치 제공 | OCR 실행 페이지 |
| **F006** | OCR 진행 모니터링 | 4단계 파이프라인 진행률 표시, 전체 진행률(%) 프로그레스바, 예상 남은 시간, 실행 로그 실시간 출력. 프로세스 취소 기능 포함 | OCR 처리 시간이 길기 때문에(약 3~10분) 상태 가시성 필수 | OCR 실행 페이지 |
| **F007** | OCR 결과 조회 | 섹션(문단/단락)별 페이지네이션, 섹션 선택 시 제목/키워드 우측 패널 표시. 이미지 탭에서 추출 이미지 보드 형태 표시, 파일명/설명/태그/출처/연결 섹션 확인 | OCR 추출의 결과물 확인 및 활용 | OCR 결과 페이지 |
| **F008** | 추출 데이터 내보내기 | 추출 텍스트 CSV 내보내기, 추출 이미지 다운로드 | 추출 결과의 실제 활용 지원 | OCR 결과 페이지 |
| **F009** | 통계 대시보드 | KPI 카드(총 업로드/OCR 완료/대기 작업, 전월 대비 변화율), 최근 6개월 월별 OCR 처리 바 차트, 최근 활동 내역, 사용자별 통계 | 운영 현황 파악 및 의사결정 지원 | 통계 개요 페이지, 통계 상세 페이지 |

### 2. MVP 필수 지원 기능

| ID | 기능명 | 설명 | MVP 필수 이유 | 관련 페이지 |
|----|--------|------|-------------|------------|
| **F010** | 기본 인증 | 아이디/패스워드 로그인, JWT 토큰 발급/갱신, 로그아웃. 관리자/일반 사용자 역할 구분 | 서비스 접근 제어 | 로그인 페이지 |
| **F011** | 템플릿 관리 | 템플릿 목록 조회/생성/삭제 (관리자 전용), OCR 실행 시 템플릿 선택 연동 | OCR 추출 정확도 제어 | 설정 페이지, OCR 실행 페이지 |
| **F012** | 프로필 관리 | 사용자 이름/이메일/부서 조회 및 수정 | 사용자 정보 유지 | 설정 페이지 |
| **F013** | 시스템 사용이력 | 활동 로그(업로드/OCR/삭제/수정/로그인/내보내기) 조회, 타입/사용자/기간 필터링, CSV 내보내기. 관리자는 전체 사용자 로그 조회 가능 | 감사 추적 및 장애 대응 | 사용이력 페이지 |
| **F014** | 데이터 초기화 | 문서/로그/전체 데이터 초기화 (관리자 전용), 확인 텍스트 입력 필요 | 관리 편의성 | 설정 페이지 |

### 3. MVP 이후 기능 (제외)

- 실시간 알림 시스템 (WebSocket)
- 문서 검색 엔진 통합 (전문 검색)
- 소셜/협업 기능
- 다국어 지원
- 고급 차트 (통계 커스터마이징)
- 템플릿 수정 기능 (기존 문서 처리 방안 미결)

---

## 메뉴 구조

```
MH-OCR-AI 내비게이션

헤더 공통 메뉴 (로그인 후)
├── 파일 관리  → F001, F002, F003, F004 (문서 업로드/목록/수정/삭제/버전 관리)
├── 통계       → F009 (통계 대시보드)
└── 설정       → F011, F012, F013, F014 (프로필/템플릿/로그/데이터관리)

비로그인 상태
└── 로그인     → F010

파일 관리 페이지 내 액션 (행 드롭다운)
├── [OCR 추출] 버튼 (UPLOADED 상태일 때 활성화) → F005, F006
├── 수정                                         → F003
├── 버전 업데이트                                 → F004
└── 삭제                                         → F003

OCR 실행 페이지 내 액션
├── [OCR 텍스트 추출 시작] → F005
├── [X 프로세스 취소]      → F006
└── 완료 후 → OCR 결과 페이지 → F007, F008

설정 페이지 탭
├── 프로필 탭         → F012
├── 템플릿 관리 탭    → F011 (관리자만 생성/삭제)
├── 데이터 관리 탭    → F014 (관리자 전용)
├── 버전 정보 탭      → (정적 정보)
└── [사용이력 보기]   → F013
```

---

## 페이지별 상세 기능

### 로그인 페이지

> **구현 기능:** `F010` | **Figma:** 미정 | **라우트:** `/login`

| 항목 | 내용 |
|------|------|
| **역할** | 서비스 진입을 위한 인증 전용 페이지 |
| **진입 경로** | 앱 최초 접근 시 자동 리디렉션, 미인증 상태로 보호된 페이지 접근 시 리디렉션 |
| **사용자 행동** | 아이디/패스워드 입력 후 로그인 버튼 클릭 |
| **주요 기능** | - 아이디/패스워드 입력 폼 및 유효성 검사<br>- **[로그인]** 버튼 클릭 시 JWT 발급<br>- 로그인 실패 시 에러 메시지 표시 (INVALID_CREDENTIALS, ACCOUNT_LOCKED)<br>- 로그인 성공 시 파일 관리 페이지로 리디렉션 |
| **데이터 요구사항** | - 읽기: 없음<br>- 쓰기: accessToken, refreshToken, expiresIn (localStorage 또는 쿠키) |
| **다음 이동** | 성공 → 파일 관리 페이지, 실패 → 에러 메시지 표시 유지 |

---

### 파일 관리 페이지

> **구현 기능:** `F001`, `F002`, `F003`, `F004` | **Figma:** `1:8516` | **라우트:** `/files`

| 항목 | 내용 |
|------|------|
| **역할** | 전체 문서 목록 조회 및 모든 문서 관련 액션의 기점 |
| **진입 경로** | 로그인 성공 후 자동 이동, 헤더 메뉴 [파일 관리] 클릭 |
| **사용자 행동** | 문서 목록 탐색, 상태 필터링, 검색, 업로드/수정/삭제/버전업데이트/OCR 실행 트리거 |
| **주요 기능** | - 문서 테이블: 체크박스, 문서명, 버전, 크기(MB 소수점 1자리), 총 페이지수, 상태 배지, 업로더, 업로드일, 액션<br>- 상태 탭 필터: 전체 / UPLOADED / OCR_EXTRACTING / OCR_ACTED / UPLOAD_FAIL / OCR_EXTRACT_FAIL<br>- 파일명 검색, 기간 필터, 정렬<br>- 페이지네이션 (기본 10개)<br>- **[파일 업로드]** 버튼 → 파일 업로드 다이얼로그<br>- 행 드롭다운: 수정 → 메타데이터 수정 다이얼로그 / 버전 업데이트 → 버전 업데이트 페이지 / 삭제 → 삭제 확인 다이얼로그<br>- UPLOADED 상태 행: **[OCR 추출]** 버튼 활성화 → OCR 실행 페이지 이동<br>- 관리자: 전체 사용자 문서 조회 가능 |
| **데이터 요구사항** | - 읽기: document 목록 (id, name, version, size, total_page, status, created_at, uploaded_by)<br>- 쓰기: 삭제(soft delete) 시 deleted_at 갱신 |
| **다음 이동** | [OCR 추출] → OCR 실행 페이지, [버전 업데이트] → 버전 업데이트 페이지 |

---

### 파일 업로드 다이얼로그

> **구현 기능:** `F001` | **Figma:** `1:6828`, `1:8094` | **라우트:** `/files` 내 Dialog

| 항목 | 내용 |
|------|------|
| **역할** | PDF 파일 업로드 및 초기 메타데이터 입력 |
| **진입 경로** | 파일 관리 페이지 [파일 업로드] 버튼 클릭 |
| **사용자 행동** | PDF 파일 선택 또는 드래그앤드롭, 버전/설명 입력, 업로드 실행 |
| **주요 기능** | - 드래그앤드롭 영역 + [파일 찾기] 버튼<br>- 파일 유효성 검사: PDF만 허용, 50MB 이하<br>- 버전 입력 필드 (v1.0 형식, 메이저/마이너 구분)<br>- 설명 입력 필드 (선택)<br>- 업로드 프로그레스바 표시<br>- **[업로드]** 버튼<br>- 성공 시 완료 모달, 실패 시 에러 모달 (FILE_TOO_LARGE, INVALID_FILE_TYPE) |
| **데이터 요구사항** | - 읽기: 없음<br>- 쓰기: document (name, version, size, description, status=UPLOADED, user_id, created_at) |
| **다음 이동** | 성공 → 완료 모달 후 파일 관리 페이지, 실패 → 에러 모달 표시 |

---

### 메타데이터 수정 다이얼로그

> **구현 기능:** `F003` | **Figma:** `1:5532`, `1:6710` | **라우트:** `/files` 내 Dialog

| 항목 | 내용 |
|------|------|
| **역할** | 문서 설명(description)만 수정 가능한 편집 다이얼로그 |
| **진입 경로** | 파일 관리 페이지 행 드롭다운 → [수정] 선택 |
| **사용자 행동** | 설명 텍스트 수정 후 저장 |
| **주요 기능** | - 파일명 표시 (읽기 전용)<br>- 설명 텍스트 영역 (수정 가능)<br>- **[저장]** 버튼<br>- **[취소]** 버튼 |
| **데이터 요구사항** | - 읽기: document.name, document.description<br>- 쓰기: document.description 갱신 (PATCH) |
| **다음 이동** | 성공 → 다이얼로그 닫힘 + 파일 관리 페이지 목록 갱신 |

---

### 삭제 확인 다이얼로그

> **구현 기능:** `F003` | **Figma:** `1:4950`, `1:6936` | **라우트:** `/files` 내 전역 모달

| 항목 | 내용 |
|------|------|
| **역할** | 문서 삭제 전 사용자 확인을 통한 실수 방지 |
| **진입 경로** | 파일 관리 페이지 행 드롭다운 → [삭제] 선택 |
| **사용자 행동** | 삭제 경고 확인 후 [삭제] 클릭 |
| **주요 기능** | - 삭제 대상 문서명 표시<br>- 경고 문구 표시<br>- **[삭제]** 버튼 (위험 액션, 빨간색)<br>- **[취소]** 버튼 |
| **데이터 요구사항** | - 읽기: document.name<br>- 쓰기: document.deleted_at 갱신 (soft delete, DELETE) |
| **다음 이동** | 성공 → 다이얼로그 닫힘 + 해당 행 목록에서 제거 |

---

### 버전 업데이트 페이지

> **구현 기능:** `F004` | **Figma:** `1:7958`, `1:8204` | **라우트:** `/files/[id]/version`

| 항목 | 내용 |
|------|------|
| **역할** | 기존 문서에 새 버전의 PDF를 교체 업로드하는 페이지 |
| **진입 경로** | 파일 관리 페이지 행 드롭다운 → [버전 업데이트] 선택 |
| **사용자 행동** | 현재 버전 확인, 메이저/마이너 선택, 새 PDF 업로드 후 업데이트 |
| **주요 기능** | - 현재 버전 표시 (예: v1.0)<br>- 업데이트 유형 선택: 메이저(v2.0) / 마이너(v1.1)<br>- 새 PDF 파일 업로드 영역 (드래그앤드롭, 50MB 제한)<br>- 변경 설명 입력 (선택)<br>- **[업데이트]** 버튼<br>- 버전 이력 표시 (기존 버전 목록) |
| **데이터 요구사항** | - 읽기: document.version, document.versions (VersionHistory[])<br>- 쓰기: 새 document 버전 생성, changeType(major\|minor), 새 PDF 파일 |
| **다음 이동** | 성공 → 파일 관리 페이지 |

---

### OCR 실행 페이지

> **구현 기능:** `F005`, `F006` | **Figma:** `1:5394`, `1:5659` | **라우트:** `/files/[id]/ocr`

| 항목 | 내용 |
|------|------|
| **역할** | OCR 파이프라인 실행 트리거 및 진행 상황 모니터링. 실행 전/실행 중 두 가지 상태를 동일 페이지에서 전환 |
| **진입 경로** | 파일 관리 페이지에서 UPLOADED 상태 행의 [OCR 추출] 버튼 클릭 |
| **사용자 행동** | 문서 정보 확인, 템플릿 선택, OCR 시작, 진행 상황 모니터링, 완료 후 결과 확인 이동 |
| **주요 기능** | **실행 전 상태:**<br>- 우측 파일 정보 패널: 파일명, 용량, 버전, 업로더 표시<br>- 템플릿 선택 드롭다운<br>- **[OCR 텍스트 추출 시작]** 버튼<br><br>**실행 중 상태 (프로세싱 뷰):**<br>- 전체 진행률(%) 프로그레스바<br>- 예상 남은 시간 실시간 표시<br>- 4단계 파이프라인 리스트 및 현재 활성 단계 표시:<br>  1) 문서 전처리 (preprocessing)<br>  2) 텍스트 및 표 추출 (text_extraction)<br>  3) LLM 이미지 분석 (llm_analysis)<br>  4) 메타데이터 합성 (metadata_synthesis)<br>- 실행 로그 영역 (실시간 스크롤)<br>- **[X 프로세스 취소]** 버튼 → 취소 확인 모달<br><br>**에러 상태:**<br>- 파이프라인 실패 단계 표시, 툴팁으로 실패 사유 안내<br>- **[재시도]** 버튼 |
| **데이터 요구사항** | - 읽기: document 상세 (name, size, version, uploaded_by), templates 목록, OcrProgress (currentStage, stageProgress, logs, startedAt)<br>- 쓰기: OCR 작업 생성 (POST /api/v1/ocr/{id}/start), OCR 취소 (POST /api/v1/ocr/{id}/cancel) |
| **다음 이동** | 완료 → OCR 결과 페이지, 실패 → 에러 표시 + 재시도, 취소 → 파일 관리 페이지 |

---

### OCR 결과 페이지

> **구현 기능:** `F007`, `F008` | **Figma:** `1:6020`, `1:8337` | **라우트:** `/files/[id]/result`

| 항목 | 내용 |
|------|------|
| **역할** | OCR 추출 완료 후 텍스트 섹션 및 이미지 결과 탐색, 데이터 내보내기 |
| **진입 경로** | OCR 실행 완료 후 자동 이동, 파일 관리 페이지에서 OCR_ACTED 상태 행 클릭 |
| **사용자 행동** | 섹션 목록 탐색, 섹션 선택으로 상세 내용 확인, 이미지 탭 전환, 데이터 내보내기 |
| **주요 기능** | **텍스트 탭:**<br>- 섹션 목록 (SectionId: SEC-XXXX 형식, 페이지 번호, 텍스트 미리보기) 페이지네이션<br>- 섹션 선택 시 우측 패널: 제목, 키워드, 전체 텍스트 내용 표시<br>- **[텍스트 CSV 내보내기]** 버튼<br><br>**이미지 탭:**<br>- 추출 이미지 보드 형태 표시 (그리드 레이아웃) + 페이지네이션<br>- 이미지 선택 시 우측 패널: 파일명, 설명(AI 자동 생성), 출처(이미지 URL), 페이지 번호, 태그(AI 자동 생성), 연결 섹션 ID 표시<br>- **[이미지 다운로드]** 버튼 (단일/전체)<br><br>**공통:**<br>- **[파일 관리로 돌아가기]** 버튼<br>- 좌우 분할 레이아웃 (resizable) |
| **데이터 요구사항** | - 읽기: sections[] (section_id, title, page, text, keyword), section_images[] (name, description, image_url, page_num, tag, type)<br>- 쓰기: 없음 (내보내기는 GET 요청으로 파일 다운로드) |
| **다음 이동** | [파일 관리로 돌아가기] → 파일 관리 페이지 |

---

### 통계 개요 페이지

> **구현 기능:** `F009` | **Figma:** `1:7583` | **라우트:** `/analytics`

| 항목 | 내용 |
|------|------|
| **역할** | 서비스 운영 현황을 한눈에 파악하는 대시보드 |
| **진입 경로** | 헤더 메뉴 [통계] 클릭 |
| **사용자 행동** | KPI 수치 확인, 월별 추세 확인, 최근 활동 및 사용자별 실적 확인 |
| **주요 기능** | - KPI 카드 3개: 총 업로드 수, OCR 완료 수, 대기 작업 수 (각 전월 대비 변화율 표시)<br>- 월별 OCR 처리 바 차트 (최근 6개월, 완료/실패 구분)<br>- 최근 활동 내역 리스트 (업로드/OCR 완료/실패 등)<br>- 사용자별 처리 통계 카드 (처리 건수, 성공률)<br>- **[상세 보기]** 버튼 → 통계 상세 페이지<br>- 데이터 없을 시 카운트 0, 빈 리스트 표시 |
| **데이터 요구사항** | - 읽기: statistics (totalUploads, totalUploadsTrend, ocrCompleted, ocrCompletedTrend, pendingTasks, pendingTasksTrend), monthlyOcrData[], userStats[], activityLogs[]<br>- 쓰기: 없음 |
| **다음 이동** | [상세 보기] → 통계 상세 페이지 |

---

### 통계 상세 페이지

> **구현 기능:** `F009` | **Figma:** `1:7237` | **라우트:** `/analytics/detail`

| 항목 | 내용 |
|------|------|
| **역할** | 기간/그룹별 상세 통계 조회 |
| **진입 경로** | 통계 개요 페이지 [상세 보기] 클릭 |
| **사용자 행동** | 기간 및 그룹 기준 설정, 타임라인/문서 유형/에러 분포 확인 |
| **주요 기능** | - 기간 필터 (dateFrom ~ dateTo)<br>- 그룹 기준 선택: 일별/주별/월별<br>- 타임라인 차트 (업로드/OCR 완료/OCR 실패)<br>- 문서 유형별 처리 건수<br>- 에러 유형별 분포<br>- 스켈레톤 로딩 UI |
| **데이터 요구사항** | - 읽기: DetailStatistics (summary, timeline[], topDocumentTypes[], errorDistribution[])<br>- 쓰기: 없음 |
| **다음 이동** | 브라우저 뒤로가기 또는 헤더 메뉴 |

---

### 설정 페이지

> **구현 기능:** `F011`, `F012`, `F014` | **Figma:** `1:6215`, `1:6441` | **라우트:** `/settings`

| 항목 | 내용 |
|------|------|
| **역할** | 프로필 관리, 템플릿 관리, 데이터 관리, 버전 정보를 탭으로 구분한 설정 허브 |
| **진입 경로** | 헤더 메뉴 [설정] 클릭 |
| **사용자 행동** | 탭 전환으로 각 설정 영역 접근, 프로필 수정, 템플릿 추가/삭제, 데이터 초기화 |
| **주요 기능** | **프로필 탭 (F012):**<br>- 이름/이메일/부서 조회 및 수정<br>- **[저장]** 버튼<br><br>**템플릿 관리 탭 (F011, 관리자 전용):**<br>- 템플릿 목록 테이블 (이름, 코드번호, 설명, 생성일)<br>- **[템플릿 추가]** 버튼 → 템플릿 추가 다이얼로그<br>- 행별 **[삭제]** 버튼 (TEMPLATE_IN_USE 에러 처리)<br>- 일반 사용자: 목록 조회만 가능<br><br>**데이터 관리 탭 (F014, 관리자 전용):**<br>- 초기화 대상 선택: 문서/로그/전체<br>- 확인 텍스트 입력 ("데이터 초기화")<br>- **[초기화 실행]** 버튼 (위험 액션)<br><br>**버전 정보 탭:**<br>- 시스템 버전, 빌드 정보 표시 (정적)<br><br>**공통:**<br>- **[사용이력 보기]** 버튼 → 사용이력 페이지 |
| **데이터 요구사항** | - 읽기: UserProfile (name, email, department, createdAt), Template[] (id, name, codeNumber, description, createdAt)<br>- 쓰기: UserProfile 수정 (PATCH), Template 생성 (POST admin), Template 삭제 (DELETE admin), 데이터 초기화 (DELETE admin) |
| **다음 이동** | [사용이력 보기] → 사용이력 페이지 |

---

### 사용이력 페이지

> **구현 기능:** `F013` | **Figma:** `1:5828` | **라우트:** `/settings/logs`

| 항목 | 내용 |
|------|------|
| **역할** | 시스템 활동 로그 조회 및 CSV 내보내기 |
| **진입 경로** | 설정 페이지 [사용이력 보기] 버튼 클릭 |
| **사용자 행동** | 로그 유형/사용자/기간 필터 설정, 로그 목록 탐색, CSV 내보내기 |
| **주요 기능** | - 필터 바: 로그 타입(upload/ocr/delete/update/login/export), 사용자, 기간(dateFrom~dateTo)<br>- 로그 테이블: 타입 배지, 메시지, 사용자, 타임스탬프 + 페이지네이션 (기본 20개)<br>- **[CSV 내보내기]** 버튼 (현재 필터 조건 적용)<br>- 관리자: 전체 사용자 로그 조회 (userId 필터 포함) |
| **데이터 요구사항** | - 읽기: ActivityLog[] (id, type, message, user, timestamp)<br>- 쓰기: 없음 (CSV 내보내기는 GET 요청) |
| **다음 이동** | 브라우저 뒤로가기 → 설정 페이지 |

---

## 도메인 모델

### Document (PostgreSQL)

| 필드 | 설명 | 타입/관계 |
|------|------|----------|
| id | 고유 식별자 | UUID (PK) |
| user_id | 업로더 | → User.id (FK) |
| name | 확장자 포함 문서명 (**.pdf) | VARCHAR |
| version | 버전 (v1.0 형식, 메이저.마이너) | VARCHAR |
| size | 파일 크기 (MB, DB 소수점 4자리 저장) | DECIMAL(10,4) |
| total_page | 총 페이지 수 | INTEGER |
| description | 문서 설명 | TEXT |
| status | 문서 상태 Enum | ENUM(UPLOADED, UPLOAD_FAIL, OCR_EXTRACTING, OCR_ACTED, OCR_EXTRACT_FAIL) |
| created_at | 업로드 일자 | TIMESTAMP |
| updated_at | 수정 일자 | TIMESTAMP |
| deleted_at | 삭제 일자 (soft delete) | TIMESTAMP |

### Metadata (PostgreSQL)

| 필드 | 설명 | 타입/관계 |
|------|------|----------|
| id | 고유 식별자 | UUID (PK) |
| document_id | 연결 문서 | → Document.id (FK), UNIQUE |
| created_at | 생성 일자 | TIMESTAMP |
| updated_at | 수정 일자 | TIMESTAMP |
| deleted_at | 삭제 일자 | TIMESTAMP |

> Document 1:0..1 Metadata 관계 (OCR 완료 시 생성)

### Section (MongoDB — rag_vectordb)

| 필드 | 설명 | 타입/관계 |
|------|------|----------|
| _id | 고유 식별자 | ObjectId |
| metadata_id | 연결 메타데이터 | → Metadata.id (참조) |
| section_id | SEC-XXXX 형식 (정수=페이지번호, 소수=텍스트 순서) | String |
| title | 섹션 제목 | String |
| page | 페이지 번호 | Integer |
| text | 추출 텍스트 내용 | String |
| keyword | AI 키워드 추출 결과 | String |
| created_at | 생성 일자 | Date |

### SectionImage (MinIO + MongoDB 메타)

| 필드 | 설명 | 타입/관계 |
|------|------|----------|
| _id | 고유 식별자 | ObjectId |
| section_id | 연결 섹션 | → Section._id (참조) |
| name | 확장자 포함 이미지명 | String |
| description | AI 자동 생성 이미지 설명 | String |
| image_url | MinIO 저장 경로 | String |
| page_num | 출처 페이지 번호 | Integer |
| tag | AI 자동 생성 태그 목록 | String[] |
| type | 이미지 유형 | Enum(image, chart, diagram, equation) |

### User (PostgreSQL)

| 필드 | 설명 | 타입/관계 |
|------|------|----------|
| id | 고유 식별자 | UUID (PK) |
| username | 로그인 아이디 | VARCHAR, UNIQUE |
| password_hash | 해시된 패스워드 | VARCHAR |
| name | 표시 이름 | VARCHAR |
| email | 이메일 | VARCHAR |
| department | 부서 | VARCHAR |
| role | 역할 | ENUM(admin, user) |
| created_at | 가입 일자 | TIMESTAMP |

### Template (PostgreSQL)

| 필드 | 설명 | 타입/관계 |
|------|------|----------|
| id | 고유 식별자 | UUID (PK) |
| name | 템플릿 이름 | VARCHAR |
| code_number | 코드 번호 | VARCHAR |
| description | 설명 | TEXT |
| schema | 템플릿 스키마 (documentFields + contentCategories) | JSONB |
| created_at | 생성 일자 | TIMESTAMP |

---

## API 엔드포인트 통합 명세

> 백엔드: FastAPI (Python), 기본 포트 8000, API prefix: `/api/v1`
> 자동 API 문서: `http://localhost:8000/docs` (Swagger UI), `http://localhost:8000/redoc` (ReDoc)
> Pydantic 기반 요청/응답 검증 (프론트 Zod와 별도)
> 상세: `docs/API-ENDPOINTS.md` 참조

### 통합 엔드포인트 목록 (26개)

| # | 메서드 | 엔드포인트 | 설명 | 권한 |
|---|--------|-----------|------|------|
| **인증 (Auth)** | | | | |
| 1 | POST | `/api/v1/auth/login` | 로그인 (JWT 발급) | 비인증 |
| 2 | POST | `/api/v1/auth/refresh` | 액세스 토큰 갱신 | 비인증 |
| **문서 (Documents)** | | | | |
| 3 | GET | `/api/v1/documents` | 문서 목록 (필터/정렬/페이지네이션) | 인증 |
| 4 | POST | `/api/v1/documents` | 문서 업로드 (multipart/form-data) | 인증 |
| 5 | GET | `/api/v1/documents/{id}` | 문서 상세 + 버전 이력 | 인증 |
| 6 | PATCH | `/api/v1/documents/{id}` | 문서 설명 수정 | 인증 |
| 7 | DELETE | `/api/v1/documents/{id}` | 문서 삭제 (soft delete) | 인증 |
| 8 | POST | `/api/v1/documents/{id}/version` | 버전 업데이트 (multipart/form-data) | 인증 |
| **OCR** | | | | |
| 9 | POST | `/api/v1/ocr/{documentId}/start` | OCR 파이프라인 시작 (templateId 포함) | 인증 |
| 10 | GET | `/api/v1/ocr/{documentId}/status` | OCR 진행 상태 조회 (폴링 2초 권장) | 인증 |
| 11 | POST | `/api/v1/ocr/{documentId}/cancel` | OCR 작업 취소 | 인증 |
| 12 | GET | `/api/v1/ocr/{documentId}/result` | OCR 완료 결과 요약 | 인증 |
| 13 | GET | `/api/v1/ocr/{documentId}/sections` | OCR 추출 섹션 목록 | 인증 |
| 14 | GET | `/api/v1/ocr/{documentId}/images` | OCR 추출 이미지 목록 | 인증 |
| **통계 (Statistics)** | | | | |
| 15 | GET | `/api/v1/statistics/overview` | KPI 통계 개요 (전월 대비 변화율 포함) | 인증 |
| 16 | GET | `/api/v1/statistics/monthly` | 최근 N개월 월별 OCR 처리 통계 | 인증 |
| 17 | GET | `/api/v1/statistics/users` | 사용자별 처리 통계 | 인증 |
| 18 | GET | `/api/v1/statistics/detail` | 상세 통계 (기간/그룹 필터) | 인증 |
| **템플릿 (Templates)** | | | | |
| 19 | GET | `/api/v1/templates` | 템플릿 목록 | 인증 |
| 20 | POST | `/api/v1/templates` | 템플릿 생성 | 인증 (admin) |
| 21 | DELETE | `/api/v1/templates/{id}` | 템플릿 삭제 | 인증 (admin) |
| **설정 (Settings)** | | | | |
| 22 | GET | `/api/v1/settings/profile` | 프로필 조회 | 인증 |
| 23 | PATCH | `/api/v1/settings/profile` | 프로필 수정 | 인증 |
| **로그 (Logs)** | | | | |
| 24 | GET | `/api/v1/logs` | 활동 로그 (필터/페이지네이션) | 인증 |
| 25 | GET | `/api/v1/logs/export` | 로그 CSV 내보내기 | 인증 |
| **관리 (Admin)** | | | | |
| 26 | DELETE | `/api/v1/admin/data` | 데이터 초기화 | 인증 (admin) |

### OCR 상태 전이

```
VALIDATING → TYPE_CHECKING → EXTRACTING → ANALYZING → AI_PROCESSING → COMPLETED
                                                                      → FAILED
```

### DocumentStatus Enum

백엔드(Python) → 프론트엔드(TypeScript) 변환은 `lib/services/real/` 응답 변환 레이어에서 처리한다.

| 백엔드 값 (Python Enum) | 프론트엔드 값 (TypeScript) | 설명 |
|------------------------|--------------------------|------|
| `UPLOADED` | `uploaded` | 업로드 완료, OCR 실행 가능 |
| `UPLOAD_FAIL` | `upload_fail` | 업로드 실패 |
| `OCR_EXTRACTING` | `ocr_processing` | OCR 추출 중 |
| `OCR_ACTED` | `ocr_completed` | OCR 완료 |
| `OCR_EXTRACT_FAIL` | `ocr_failed` | OCR 실패 |

> `lib/types/index.ts`에 `upload_fail` 상태 추가 필요. `draft` 상태는 제거 또는 재정의 필요.

---

## OCR 파이프라인 기술 명세

### 4단계 하이브리드 파이프라인 (백엔드 9단계 → 프론트 4단계 추상화)

백엔드는 D2V(Document→Vector) 9단계로 처리하며, 프론트엔드는 아래 4단계로 추상화하여 진행률을 표시한다.

| 프론트 단계 | 백엔드 Stage | 이름 | 처리 내용 | 도구 |
|-----------|------------|------|----------|------|
| preprocessing | Stage 0 | 문서 전처리 | PyMuPDF PDF 파싱. 스캔 PDF: OpenCV 전처리 + PaddleOCR | PyMuPDF, OpenCV, PaddleOCR |
| text_extraction | Stage 1-4 | 텍스트 및 표 추출 | 세그먼테이션, TOC, 레이아웃 분석, 표 추출 | Camelot/Tabula, DocLayout-YOLO, PP-Structure |
| llm_analysis | Stage 5-6 | LLM 이미지 분석 | 청킹, 이미지 캡셔닝, 다이어그램/차트 분석, AI 태그 생성 | GPT-4o (VLM), gpt-4o-mini |
| metadata_synthesis | Stage 7 | 메타데이터 합성 | 키워드 추출(배치), 임베딩 벡터 생성, MongoDB 저장 | gpt-4o-mini, text-embedding-3-small |

### 처리 시간 기준 (11페이지 한국어 문서)

| 최적화 전 | 최적화 후 |
|----------|---------|
| 약 10분 | 약 3~4분 |

### OCR 결과 프론트엔드 소비 데이터

- `sections[]`: section_id, title, content, page_number, keyword
- `images[]`: name, description, image_url, tag[], type (image/chart/diagram/equation)
- `table[]`: name, table_md (마크다운 문자열)

### OCR 결과 MongoDB 저장 구조

```json
{
  "ocr_result_id": "...",
  "ref_document_id": 1,
  "page": [
    {
      "page_num": 1,
      "sections": [
        {
          "section_id": "SEC-0000",
          "title": "섹션 제목",
          "content": "추출 텍스트",
          "page_number": 1,
          "keyword": "키워드1, 키워드2",
          "sequence_id": 0
        }
      ],
      "images": [
        {
          "name": "image.jpg",
          "description": "AI 생성 설명",
          "ext": "jpg",
          "image_url": "minio://bucket/path",
          "tag": ["태그1", "태그2"],
          "type": "image | chart | diagram | equation",
          "sequence_id": 2
        }
      ],
      "table": [
        {
          "name": "테이블명",
          "table_md": "| 헤더1 | 헤더2 |\n|------|------|",
          "sequence_id": 3
        }
      ]
    }
  ]
}
```

### MongoDB 컬렉션 구조 (rag_vectordb)

| 컬렉션 | 용도 |
|--------|------|
| documents | 문서 메타 + raw_text |
| toc_nodes | 계층 목차 구조 |
| retrieval_chunks | 검색용 청크 + 임베딩 벡터 |
| generation_chunks | 답변 생성용 상세 청크 |
| entities | 이미지/다이어그램 + vision 결과 |

---

## 라우팅 매핑 테이블

| 페이지명 | 프론트엔드 라우트 | Figma ID | 인증 필요 | 파일 경로 |
|---------|----------------|---------|---------|---------|
| 랜딩 페이지 | `/` | `1:5251` | 불필요 | `app/page.tsx` |
| 로그인 페이지 | `/login` | 미정 | 불필요 | `app/login/page.tsx` |
| 파일 관리 페이지 | `/files` | `1:8516` | 필요 | `app/files/page.tsx` |
| 버전 업데이트 페이지 | `/files/[id]/version` | `1:7958`, `1:8204` | 필요 | `app/files/[id]/version/page.tsx` |
| OCR 실행 페이지 | `/files/[id]/ocr` | `1:5394`, `1:5659` | 필요 | `app/files/[id]/ocr/page.tsx` |
| OCR 결과 페이지 | `/files/[id]/result` | `1:6020`, `1:8337` | 필요 | `app/files/[id]/result/page.tsx` |
| 통계 개요 페이지 | `/analytics` | `1:7583` | 필요 | `app/analytics/page.tsx` |
| 통계 상세 페이지 | `/analytics/detail` | `1:7237` | 필요 | `app/analytics/detail/page.tsx` |
| 설정 페이지 | `/settings` | `1:6215`, `1:6441` | 필요 | `app/settings/page.tsx` |
| 사용이력 페이지 | `/settings/logs` | `1:5828` | 필요 | `app/settings/logs/page.tsx` |

---

## 기술 스택

### 프론트엔드 프레임워크

- **Next.js 16** (App Router, Turbopack) — React 풀스택 프레임워크
- **TypeScript 5.6+** — 타입 안전성 보장
- **React 19** — UI 라이브러리

### 스타일링 및 UI

- **TailwindCSS v4** (설정파일 없는 새로운 CSS 엔진) — 유틸리티 CSS
- **ShadcnUI** (new-york 스타일, neutral 색상) — React 컴포넌트 라이브러리
- **Lucide React** — 아이콘 라이브러리
- **next-themes** — 다크모드 지원

### 이미 설치된 ShadcnUI 컴포넌트

avatar, badge, button, card, dialog, dropdown-menu, input, label, separator, sheet, sonner, tooltip

### 추가 설치 필요 ShadcnUI 컴포넌트

| Phase | 컴포넌트 |
|-------|---------|
| Phase 3 (파일관리) | table, select, pagination, tabs, checkbox, form, textarea, radio-group, alert-dialog |
| Phase 4 (OCR) | progress, scroll-area, resizable |
| Phase 5 (통계) | chart, skeleton |
| Phase 6 (설정) | switch, breadcrumb |

### 폼 및 검증

- **React Hook Form 7.x** — 폼 상태 관리
- **Zod** — 스키마 기반 입력 검증 (프론트엔드 전용, 백엔드 Pydantic과 별도)

### 프론트엔드 파일 구조

```
app/              → 페이지 및 라우팅 (App Router)
app/api/          → API 라우트 핸들러
components/ui/    → ShadcnUI 컴포넌트 (자동 생성, 직접 수정 최소화)
components/layout/→ 레이아웃 컴포넌트 (Header, Footer, Nav)
components/features/ → 기능별 커스텀 컴포넌트
lib/api/          → HTTP 클라이언트, 엔드포인트 상수, DTO 타입
lib/services/     → 서비스 추상화 (interface + mock/ + real/)
lib/actions/      → Server Actions
lib/mock/         → Mock 데이터
lib/types/        → 도메인 타입 정의
lib/validations/  → Zod 스키마 (입력 검증)
hooks/            → 커스텀 훅
public/           → 정적 에셋
```

> **중요**: `lib/types/` 도메인 타입과 `lib/api/` DTO 타입을 혼용하지 않는다. 백엔드 API 응답은 반드시 `lib/services/real/` 서비스 레이어를 경유하여 도메인 타입으로 변환한다.

### 백엔드

- **FastAPI (Python)** — REST API 서버 (포트 8000)
- **아키텍처**: DDD + 레이어드/클린 아키텍처
- **데이터 삭제 정책**: Soft delete (deleted_at 타임스탬프)
- **PostgreSQL** — 주 데이터베이스 (문서 메타, 사용자, 템플릿)
- **MongoDB** — OCR 결과 저장 (섹션, 청크, 임베딩 벡터)
- **MinIO** — 이미지 파일 오브젝트 스토리지

### 인프라

- **Nginx** — 리버스 프록시 (프론트 포트 3000 + 백엔드 포트 8000 통합)
- 배포 구조: `클라이언트 → Nginx → Next.js (3000) / FastAPI (8000)`

### API 통신

- **JWT** (Bearer 토큰) — 인증, `Authorization: Bearer <JWT>` 헤더 자동 주입
- **파일 업로드**: `multipart/form-data` (PDF, 최대 50MB)
- **OCR 상태 폴링**: `/api/v1/ocr/{documentId}/status`, 2초 간격
- **비동기 OCR**: OCR 실행 시 `202 Accepted` 응답 후 폴링 방식
- **에러 표시**: `sonner` 토스트
- **Mock/Real 이중 모드**: `NEXT_PUBLIC_API_MODE=mock|real` 환경변수로 전환 (`docs/API-CLIENT.md` 참조)
- **개발 환경**: `next.config.ts` rewrites로 `/api/v1/*` → `http://localhost:8000/api/v1/*` 프록시
- **프로덕션**: Nginx에서 리버스 프록시 처리

### 배포 환경변수

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000    # 백엔드 API 베이스 URL
NEXT_PUBLIC_API_MODE=mock                    # mock | real
```

---

## 개발 금지 사항

- `app/globals.css`의 CSS 변수 섹션을 수동으로 직접 수정하지 않기 (디자인 토큰 동기화 커맨드 사용)
- `node_modules/` 내부 파일 수정 금지
- ShadcnUI 컴포넌트(`components/ui/`)는 가급적 원본 유지, 커스텀 필요 시 래퍼 컴포넌트 생성
- `package.json`에 불필요한 의존성 추가 금지
- 프론트엔드에서 백엔드 DB 직접 접근 금지 (반드시 REST API 경유)
- `lib/types/` 도메인 타입과 `lib/api/` DTO 타입을 혼용하지 않기
- 백엔드 API 응답을 컴포넌트에서 직접 사용하지 않기 (서비스 레이어 경유)

---

## 정합성 검증

### 기능 ID → 페이지 연결

| 기능 ID | 기능명 | 구현 페이지 |
|--------|--------|-----------|
| F001 | 문서 업로드 | 파일 관리 페이지, 파일 업로드 다이얼로그 |
| F002 | 문서 목록 조회 | 파일 관리 페이지 |
| F003 | 문서 수정/삭제 | 파일 관리 페이지, 메타데이터 수정 다이얼로그, 삭제 확인 다이얼로그 |
| F004 | 문서 버전 업데이트 | 파일 관리 페이지, 버전 업데이트 페이지 |
| F005 | OCR 추출 실행 | OCR 실행 페이지 |
| F006 | OCR 진행 모니터링 | OCR 실행 페이지 |
| F007 | OCR 결과 조회 | OCR 결과 페이지 |
| F008 | 추출 데이터 내보내기 | OCR 결과 페이지 |
| F009 | 통계 대시보드 | 통계 개요 페이지, 통계 상세 페이지 |
| F010 | 기본 인증 | 로그인 페이지 |
| F011 | 템플릿 관리 | 설정 페이지, OCR 실행 페이지 |
| F012 | 프로필 관리 | 설정 페이지 |
| F013 | 시스템 사용이력 | 사용이력 페이지 |
| F014 | 데이터 초기화 | 설정 페이지 |
