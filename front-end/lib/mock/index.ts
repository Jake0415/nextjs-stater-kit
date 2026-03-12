import type {
  User,
  Document,
  Template,
  Statistics,
  MonthlyOcrData,
  UserStats,
  ActivityLog,
  Section,
  SectionImage,
} from "@/lib/types";

// 사용자
export const mockUsers: User[] = [
  { id: "u1", name: "Alex Chen", role: "admin", avatar: "/avatars/alex.jpg" },
  { id: "u2", name: "김민지", role: "user" },
  { id: "u3", name: "이승우", role: "user" },
  { id: "u4", name: "박지현", role: "admin" },
];

export const currentUser: User = mockUsers[0];

// 템플릿
export const mockTemplates: Template[] = [
  {
    id: "t1",
    name: "표준 문서 템플릿",
    codeNumber: "TPL-001",
    description: "일반 비정형 PDF 문서용 기본 추출 템플릿",
    createdAt: "2025-12-01",
  },
  {
    id: "t2",
    name: "계약서 템플릿",
    codeNumber: "TPL-002",
    description: "법적 문서 및 계약서 특화 추출 템플릿",
    createdAt: "2025-12-15",
  },
  {
    id: "t3",
    name: "기술 문서 템플릿",
    codeNumber: "TPL-003",
    description: "기술 매뉴얼 및 사양서 추출 템플릿",
    createdAt: "2026-01-10",
  },
];

// 문서
export const mockDocuments: Document[] = [
  {
    id: "d1",
    filename: "2024_연간보고서_v2.pdf",
    description: "2024년도 연간 종합 보고서",
    status: "ocr_completed",
    version: "2.0.0",
    fileSize: 15_400_000,
    pageCount: 48,
    uploadedBy: mockUsers[0],
    uploadedAt: "2026-02-15T09:30:00Z",
    updatedAt: "2026-02-15T10:15:00Z",
    templateId: "t1",
  },
  {
    id: "d2",
    filename: "프로젝트_계획서_최종.pdf",
    description: "MH OCR AI 프로젝트 계획서",
    status: "ocr_completed",
    version: "1.1.0",
    fileSize: 8_200_000,
    pageCount: 24,
    uploadedBy: mockUsers[1],
    uploadedAt: "2026-02-18T14:00:00Z",
    updatedAt: "2026-02-18T14:45:00Z",
    templateId: "t1",
  },
  {
    id: "d3",
    filename: "계약서_A사_2026.pdf",
    description: "A사와의 서비스 이용 계약서",
    status: "ocr_processing",
    version: "1.0.0",
    fileSize: 3_500_000,
    pageCount: 12,
    uploadedBy: mockUsers[2],
    uploadedAt: "2026-03-01T11:20:00Z",
    updatedAt: "2026-03-01T11:20:00Z",
    ocrProgress: 65,
    templateId: "t2",
  },
  {
    id: "d4",
    filename: "기술_사양서_v3.pdf",
    description: "시스템 기술 사양서 3차 개정판",
    status: "uploaded",
    version: "3.0.0",
    fileSize: 22_100_000,
    pageCount: 96,
    uploadedBy: mockUsers[0],
    uploadedAt: "2026-03-05T16:45:00Z",
    updatedAt: "2026-03-05T16:45:00Z",
  },
  {
    id: "d5",
    filename: "회의록_20260308.pdf",
    description: "3월 정기 회의록",
    status: "draft",
    version: "1.0.0",
    fileSize: 1_200_000,
    pageCount: 6,
    uploadedBy: mockUsers[3],
    uploadedAt: "2026-03-08T10:00:00Z",
    updatedAt: "2026-03-08T10:00:00Z",
  },
  {
    id: "d6",
    filename: "품질관리_매뉴얼.pdf",
    description: "QA/QC 프로세스 매뉴얼",
    status: "ocr_completed",
    version: "1.2.0",
    fileSize: 18_700_000,
    pageCount: 72,
    uploadedBy: mockUsers[1],
    uploadedAt: "2026-01-20T08:30:00Z",
    updatedAt: "2026-02-10T14:20:00Z",
    templateId: "t3",
  },
  {
    id: "d7",
    filename: "예산_보고서_Q1.pdf",
    description: "2026년 1분기 예산 집행 보고서",
    status: "ocr_completed",
    version: "1.0.0",
    fileSize: 5_600_000,
    pageCount: 18,
    uploadedBy: mockUsers[2],
    uploadedAt: "2026-02-28T09:00:00Z",
    updatedAt: "2026-02-28T09:35:00Z",
    templateId: "t1",
  },
  {
    id: "d8",
    filename: "인사_규정_개정안.pdf",
    description: "2026년 인사 규정 개정안",
    status: "ocr_failed",
    version: "1.0.0",
    fileSize: 4_100_000,
    pageCount: 32,
    uploadedBy: mockUsers[3],
    uploadedAt: "2026-03-02T13:15:00Z",
    updatedAt: "2026-03-02T13:40:00Z",
    templateId: "t1",
  },
  {
    id: "d9",
    filename: "보안_감사_리포트.pdf",
    description: "연간 보안 감사 결과 보고서",
    status: "ocr_completed",
    version: "1.0.0",
    fileSize: 9_800_000,
    pageCount: 44,
    uploadedBy: mockUsers[0],
    uploadedAt: "2026-02-25T15:30:00Z",
    updatedAt: "2026-02-25T16:10:00Z",
    templateId: "t1",
  },
  {
    id: "d10",
    filename: "시스템_아키텍처_설계서.pdf",
    description: "MH OCR AI 시스템 아키텍처 설계 문서",
    status: "uploaded",
    version: "2.1.0",
    fileSize: 28_300_000,
    pageCount: 120,
    uploadedBy: mockUsers[0],
    uploadedAt: "2026-03-09T11:00:00Z",
    updatedAt: "2026-03-09T11:00:00Z",
  },
  {
    id: "d11",
    filename: "교육_자료_AI_기초.pdf",
    description: "AI 기술 기초 교육 자료",
    status: "ocr_completed",
    version: "1.0.0",
    fileSize: 12_500_000,
    pageCount: 56,
    uploadedBy: mockUsers[1],
    uploadedAt: "2026-01-15T10:00:00Z",
    updatedAt: "2026-01-15T10:45:00Z",
    templateId: "t3",
  },
  {
    id: "d12",
    filename: "API_명세서_v4.pdf",
    description: "REST API 상세 명세서",
    status: "ocr_processing",
    version: "4.0.0",
    fileSize: 7_400_000,
    pageCount: 38,
    uploadedBy: mockUsers[2],
    uploadedAt: "2026-03-10T08:00:00Z",
    updatedAt: "2026-03-10T08:00:00Z",
    ocrProgress: 30,
    templateId: "t3",
  },
];

// 섹션 (OCR 결과 — 여러 문서)
export const mockSections: Section[] = [
  // ── d1: 2024_연간보고서_v2.pdf ──
  {
    id: "s1",
    documentId: "d1",
    sectionLabel: "SEC-1.1",
    title: "Fiscal Performance Overview",
    pageNumber: 1,
    type: "text",
    content:
      "The fiscal year analysis indicates a significant growth in AI-driven processing capabilities. OCR Pro AI has successfully extracted metadata from over 100 pages of high-density documentation.",
    confidence: 0.98,
    tags: ["개요", "표지"],
    keywords: ["REVENUE", "AI ARCHITECTURE", "SCALABILITY"],
  },
  {
    id: "s2",
    documentId: "d1",
    sectionLabel: "SEC-1.2",
    title: "Recognition Accuracy",
    pageNumber: 1,
    type: "table",
    content:
      "Compared to traditional OCR engines, the PRO-X1 architecture allows for a 40% increase in character recognition accuracy within complex table structures.",
    confidence: 0.95,
    tags: ["매출", "재무", "분기별"],
    keywords: ["OCR", "ACCURACY"],
  },
  {
    id: "s3",
    documentId: "d1",
    sectionLabel: "SEC-1.3",
    title: "Cloud Infrastructure",
    pageNumber: 2,
    type: "text",
    content:
      "Initial findings suggest that the scalability of the cloud infrastructure outperformed initial benchmarks by 15% during peak load testing cycles.",
    confidence: 0.92,
    tags: ["조직도", "인사"],
    keywords: ["CLOUD", "SCALABILITY"],
  },
  {
    id: "s4",
    documentId: "d1",
    sectionLabel: "SEC-2.1",
    title: "Neural Layout Analysis",
    pageNumber: 2,
    type: "text",
    content:
      "Technological breakthroughs in the realm of neural layout analysis have enabled the system to preserve hierarchical relationships between headers and body text.",
    confidence: 0.97,
    tags: ["프로젝트", "성과"],
    keywords: ["NEURAL", "LAYOUT"],
  },
  {
    id: "s5",
    documentId: "d1",
    sectionLabel: "SEC-2.2",
    title: "Image Caption Correlation",
    pageNumber: 3,
    type: "text",
    content:
      "The system achieved a 99.9% success rate in correlating extracted image captions with their respective body text paragraphs.",
    confidence: 0.94,
    tags: ["인사", "채용"],
    keywords: ["IMAGE", "CORRELATION"],
  },
  {
    id: "s6",
    documentId: "d1",
    sectionLabel: "SEC-3.1",
    title: "Operational Efficiency",
    pageNumber: 4,
    type: "text",
    content:
      "Operational expenditure was reduced by 22% following the implementation of the automated document sorting pipeline.",
    confidence: 0.96,
    tags: ["운영", "효율"],
    keywords: ["OPERATIONS", "EFFICIENCY"],
  },

  // ── d2: 프로젝트_계획서_최종.pdf ──
  {
    id: "s7",
    documentId: "d2",
    sectionLabel: "SEC-1.1",
    title: "프로젝트 개요",
    pageNumber: 1,
    type: "text",
    content:
      "MH OCR AI 프로젝트는 비정형 문서의 자동 텍스트 추출 및 메타데이터 생성을 목표로 한다. 주요 기술 스택은 Next.js, FastAPI, PostgreSQL을 기반으로 구성된다.",
    confidence: 0.97,
    tags: ["개요", "목표"],
    keywords: ["OCR", "AI ARCHITECTURE"],
  },
  {
    id: "s8",
    documentId: "d2",
    sectionLabel: "SEC-1.2",
    title: "일정 및 마일스톤",
    pageNumber: 2,
    type: "table",
    content:
      "Phase 1: 기반 정비 (2주) → Phase 2: 핵심 기능 구현 (4주) → Phase 3: API 연동 (3주) → Phase 4: 테스트 및 최적화 (2주). 총 11주 소요 예상.",
    confidence: 0.94,
    tags: ["일정", "마일스톤"],
    keywords: ["SCALABILITY", "EFFICIENCY"],
  },
  {
    id: "s9",
    documentId: "d2",
    sectionLabel: "SEC-2.1",
    title: "시스템 아키텍처",
    pageNumber: 4,
    type: "text",
    content:
      "프론트엔드(Next.js)에서 백엔드(FastAPI) API를 호출하며, Nginx 리버스 프록시를 통해 라우팅된다. 문서 파일은 MinIO 오브젝트 스토리지에 저장된다.",
    confidence: 0.96,
    tags: ["아키텍처", "설계"],
    keywords: ["CLOUD", "ARCHITECTURE"],
  },
  {
    id: "s10",
    documentId: "d2",
    sectionLabel: "SEC-2.2",
    title: "데이터 모델 정의",
    pageNumber: 6,
    type: "table",
    content:
      "핵심 엔티티: Document(문서), Section(섹션), SectionImage(이미지), Template(템플릿), User(사용자). 문서당 평균 15~20개의 섹션이 생성된다.",
    confidence: 0.93,
    tags: ["데이터", "모델"],
    keywords: ["TABLE", "LAYOUT"],
  },
  {
    id: "s11",
    documentId: "d2",
    sectionLabel: "SEC-3.1",
    title: "보안 및 인증",
    pageNumber: 8,
    type: "text",
    content:
      "JWT 토큰 기반 인증을 사용하며, Access Token(15분) + Refresh Token(7일) 이중 구조로 운영한다. 관리자와 일반 사용자 역할을 구분한다.",
    confidence: 0.95,
    tags: ["보안", "인증"],
    keywords: ["OPERATIONS", "ACCURACY"],
  },

  // ── d4: 기술_사양서_v3.pdf (uploaded → OCR 트리거 대상) ──
  {
    id: "s12",
    documentId: "d4",
    sectionLabel: "SEC-1.1",
    title: "시스템 요구사항",
    pageNumber: 1,
    type: "text",
    content:
      "본 시스템은 초당 100건 이상의 동시 OCR 처리를 지원해야 하며, 평균 응답 시간은 2초 이내를 목표로 한다. GPU 가속 환경에서의 배치 처리를 권장한다.",
    confidence: 0.96,
    tags: ["요구사항", "성능"],
    keywords: ["SCALABILITY", "EFFICIENCY"],
  },
  {
    id: "s13",
    documentId: "d4",
    sectionLabel: "SEC-1.2",
    title: "하드웨어 스펙",
    pageNumber: 2,
    type: "table",
    content:
      "최소 사양: CPU 8코어, RAM 32GB, SSD 500GB, GPU NVIDIA T4. 권장 사양: CPU 16코어, RAM 64GB, NVMe 1TB, GPU NVIDIA A100.",
    confidence: 0.98,
    tags: ["하드웨어", "인프라"],
    keywords: ["CLOUD", "DATACENTER"],
  },
  {
    id: "s14",
    documentId: "d4",
    sectionLabel: "SEC-2.1",
    title: "OCR 엔진 비교 분석",
    pageNumber: 5,
    type: "text",
    content:
      "Tesseract 5.0, PaddleOCR, Azure AI Vision 3개 엔진을 비교 분석한 결과, 한글 문서 인식률에서 PaddleOCR이 96.2%로 가장 높은 정확도를 기록했다.",
    confidence: 0.95,
    tags: ["OCR", "비교분석"],
    keywords: ["OCR", "ACCURACY", "AI ARCHITECTURE"],
  },
  {
    id: "s15",
    documentId: "d4",
    sectionLabel: "SEC-2.2",
    title: "레이아웃 분석 파이프라인",
    pageNumber: 7,
    type: "text",
    content:
      "문서 레이아웃 분석은 LayoutLMv3 모델을 기반으로 하며, 텍스트/테이블/이미지 영역을 자동 분류한다. 복합 레이아웃 문서에서 92.7%의 분류 정확도를 달성했다.",
    confidence: 0.93,
    tags: ["레이아웃", "AI"],
    keywords: ["NEURAL", "LAYOUT", "IMAGE"],
  },
  {
    id: "s16",
    documentId: "d4",
    sectionLabel: "SEC-3.1",
    title: "API 인터페이스 설계",
    pageNumber: 10,
    type: "text",
    content:
      "RESTful API는 OpenAPI 3.0 스펙을 준수하며, 문서 CRUD, OCR 실행/상태 조회, 템플릿 관리, 통계 조회 등 총 26개 엔드포인트로 구성된다.",
    confidence: 0.97,
    tags: ["API", "설계"],
    keywords: ["ARCHITECTURE", "OPERATIONS"],
  },
  {
    id: "s17",
    documentId: "d4",
    sectionLabel: "SEC-3.2",
    title: "에러 처리 전략",
    pageNumber: 12,
    type: "table",
    content:
      "4xx 에러: 클라이언트 입력 검증 실패. 5xx 에러: 서버 내부 오류. OCR 실패 시 최대 3회 자동 재시도 후 실패 상태로 전환하며, 에러 로그를 상세히 기록한다.",
    confidence: 0.94,
    tags: ["에러처리", "안정성"],
    keywords: ["OPERATIONS", "EFFICIENCY"],
  },

  // ── d6: 품질관리_매뉴얼.pdf ──
  {
    id: "s18",
    documentId: "d6",
    sectionLabel: "SEC-1.1",
    title: "품질 관리 원칙",
    pageNumber: 1,
    type: "text",
    content:
      "QA/QC 프로세스는 ISO 9001:2015 기준을 준수하며, 문서 입력부터 최종 검증까지 5단계 품질 게이트를 운영한다. 각 단계별 합격 기준은 95% 이상이다.",
    confidence: 0.97,
    tags: ["품질", "ISO"],
    keywords: ["ACCURACY", "OPERATIONS"],
  },
  {
    id: "s19",
    documentId: "d6",
    sectionLabel: "SEC-1.2",
    title: "검사 항목 체크리스트",
    pageNumber: 3,
    type: "table",
    content:
      "텍스트 정확도: ≥95%, 레이아웃 보존률: ≥90%, 이미지 추출률: ≥98%, 메타데이터 완성도: ≥92%, 처리 시간 준수: ≤30초/페이지.",
    confidence: 0.96,
    tags: ["체크리스트", "기준"],
    keywords: ["KPI", "TABLE", "ACCURACY"],
  },
  {
    id: "s20",
    documentId: "d6",
    sectionLabel: "SEC-2.1",
    title: "결함 분류 체계",
    pageNumber: 5,
    type: "text",
    content:
      "결함은 Critical(서비스 중단), Major(기능 오류), Minor(표시 오류), Cosmetic(외관 이슈) 4등급으로 분류한다. Critical 결함 발생 시 즉시 롤백 절차를 수행한다.",
    confidence: 0.95,
    tags: ["결함", "분류"],
    keywords: ["OPERATIONS", "EFFICIENCY"],
  },

  // ── d7: 예산_보고서_Q1.pdf ──
  {
    id: "s21",
    documentId: "d7",
    sectionLabel: "SEC-1.1",
    title: "1분기 예산 집행 요약",
    pageNumber: 1,
    type: "text",
    content:
      "2026년 1분기 총 예산 집행액은 4억 2,300만원으로, 당초 계획 대비 98.2%의 집행률을 기록했다. 인건비 60%, 인프라 25%, 기타 15%로 배분되었다.",
    confidence: 0.98,
    tags: ["예산", "요약"],
    keywords: ["REVENUE", "KPI"],
  },
  {
    id: "s22",
    documentId: "d7",
    sectionLabel: "SEC-1.2",
    title: "부서별 비용 분석",
    pageNumber: 3,
    type: "table",
    content:
      "개발팀: 1억 8,000만원 (42.6%), 인프라팀: 1억 500만원 (24.8%), 디자인팀: 5,200만원 (12.3%), QA팀: 4,100만원 (9.7%), 기타: 4,500만원 (10.6%).",
    confidence: 0.96,
    tags: ["부서별", "비용"],
    keywords: ["TABLE", "REVENUE", "CHART"],
  },
  {
    id: "s23",
    documentId: "d7",
    sectionLabel: "SEC-2.1",
    title: "클라우드 인프라 비용",
    pageNumber: 5,
    type: "text",
    content:
      "AWS 기반 클라우드 비용은 월 평균 3,500만원으로, GPU 인스턴스(p4d.24xlarge) 비용이 전체의 65%를 차지한다. Reserved Instance 전환 시 30% 절감 가능.",
    confidence: 0.94,
    tags: ["클라우드", "비용"],
    keywords: ["CLOUD", "EFFICIENCY"],
  },

  // ── d9: 보안_감사_리포트.pdf ──
  {
    id: "s24",
    documentId: "d9",
    sectionLabel: "SEC-1.1",
    title: "보안 감사 개요",
    pageNumber: 1,
    type: "text",
    content:
      "연간 보안 감사 결과, 총 147개 항목 중 139개가 적합 판정을 받았다. 적합률 94.6%로 전년 대비 2.3%p 향상되었다. 부적합 8건 중 6건은 경미 사항이다.",
    confidence: 0.97,
    tags: ["보안", "감사"],
    keywords: ["ACCURACY", "KPI"],
  },
  {
    id: "s25",
    documentId: "d9",
    sectionLabel: "SEC-1.2",
    title: "취약점 분석 결과",
    pageNumber: 3,
    type: "table",
    content:
      "High 등급: 0건, Medium 등급: 2건 (세션 타임아웃 미설정, 로그 암호화 미적용), Low 등급: 6건. Medium 등급 2건은 2주 내 조치 완료 예정.",
    confidence: 0.95,
    tags: ["취약점", "등급"],
    keywords: ["TABLE", "OPERATIONS"],
  },
  {
    id: "s26",
    documentId: "d9",
    sectionLabel: "SEC-2.1",
    title: "접근 제어 정책",
    pageNumber: 6,
    type: "text",
    content:
      "RBAC(Role-Based Access Control) 기반으로 Admin, Manager, User 3개 역할을 정의한다. 최소 권한 원칙에 따라 각 역할에 필요한 최소한의 권한만 부여한다.",
    confidence: 0.96,
    tags: ["접근제어", "정책"],
    keywords: ["OPERATIONS", "ARCHITECTURE"],
  },

  // ── d11: 교육_자료_AI_기초.pdf ──
  {
    id: "s27",
    documentId: "d11",
    sectionLabel: "SEC-1.1",
    title: "인공지능 개론",
    pageNumber: 1,
    type: "text",
    content:
      "인공지능(AI)은 인간의 학습, 추론, 인식 능력을 컴퓨터로 구현하는 기술이다. 머신러닝, 딥러닝, 자연어처리(NLP), 컴퓨터 비전 등의 하위 분야로 구성된다.",
    confidence: 0.99,
    tags: ["AI", "개론"],
    keywords: ["AI ARCHITECTURE", "NEURAL"],
  },
  {
    id: "s28",
    documentId: "d11",
    sectionLabel: "SEC-1.2",
    title: "OCR 기술 원리",
    pageNumber: 4,
    type: "text",
    content:
      "광학 문자 인식(OCR)은 이미지 내 텍스트를 디지털 텍스트로 변환하는 기술이다. 전처리 → 문자 분할 → 특징 추출 → 문자 인식 → 후처리 5단계로 구성된다.",
    confidence: 0.97,
    tags: ["OCR", "원리"],
    keywords: ["OCR", "IMAGE", "NEURAL"],
  },
  {
    id: "s29",
    documentId: "d11",
    sectionLabel: "SEC-2.1",
    title: "트랜스포머 아키텍처",
    pageNumber: 8,
    type: "text",
    content:
      "Transformer 모델은 Self-Attention 메커니즘을 핵심으로 하며, BERT, GPT, LayoutLM 등 다양한 변형이 문서 이해 태스크에 활용된다.",
    confidence: 0.96,
    tags: ["트랜스포머", "모델"],
    keywords: ["AI ARCHITECTURE", "NEURAL", "LAYOUT"],
  },
  {
    id: "s30",
    documentId: "d11",
    sectionLabel: "SEC-2.2",
    title: "실습 환경 구성",
    pageNumber: 12,
    type: "table",
    content:
      "Python 3.11+, PyTorch 2.0, Hugging Face Transformers, Jupyter Notebook. GPU 환경: Google Colab Pro 또는 로컬 NVIDIA GPU (VRAM 8GB 이상).",
    confidence: 0.95,
    tags: ["실습", "환경"],
    keywords: ["CLOUD", "ARCHITECTURE"],
  },
];

// 섹션 이미지 (여러 문서)
export const mockSectionImages: SectionImage[] = [
  // ── d1: 2024_연간보고서_v2.pdf ──
  {
    id: "si1",
    sectionId: "s1",
    filename: "1분기_매출_차트.png",
    description:
      "2023 회계연도 지역 부서별 분기별 매출 성장을 나타내는 선 그래프입니다.",
    source: "2024_연간보고서_v2.pdf (p.1)",
    pageNumber: 1,
    tags: ["REVENUE", "CHART", "TRENDS"],
    thumbnailUrl: "/placeholder-image.svg",
    contextText:
      '"분기별 매출 차트(그림 1.1)에서 알 수 있듯이, 성장 궤도는 이전 회계 주기에서 설정된 엔터프라이즈 수준의 벤치마크와 일치합니다..."',
  },
  {
    id: "si2",
    sectionId: "s6",
    filename: "운영_통계_표.png",
    description:
      "비용 절감 지표 및 KPI 목표를 보여주는 상세 운영 효율성 표입니다.",
    source: "2024_연간보고서_v2.pdf (p.4)",
    pageNumber: 4,
    tags: ["OPERATIONS", "KPI", "TABLE"],
    thumbnailUrl: "/placeholder-image.svg",
    contextText:
      '"운영 비용 절감 분석 결과, 자동화 파이프라인 도입 후 22%의 비용 절감 효과가 확인되었습니다..."',
  },
  {
    id: "si3",
    sectionId: "s1",
    filename: "기업_브랜딩_로고.png",
    description: "요약 보고서 헤더에서 추출된 주요 회사 로고입니다.",
    source: "2024_연간보고서_v2.pdf (p.1)",
    pageNumber: 1,
    tags: ["LOGO", "BRANDING"],
    thumbnailUrl: "/placeholder-image.svg",
  },
  {
    id: "si4",
    sectionId: "s3",
    filename: "클라우드_아키텍처_인포그래픽.png",
    description:
      "신경망 레이아웃 분석 파이프라인 및 데이터 흐름을 설명하는 아키텍처 다이어그램입니다.",
    source: "2024_연간보고서_v2.pdf (p.2)",
    pageNumber: 2,
    tags: ["ARCHITECTURE", "CLOUD"],
    thumbnailUrl: "/placeholder-image.svg",
    contextText:
      '"클라우드 인프라의 확장성은 피크 부하 테스트 주기 동안 초기 벤치마크를 15% 초과 달성했습니다..."',
  },
  {
    id: "si5",
    sectionId: "s5",
    filename: "서버_팜_사진.jpg",
    description:
      "엔터프라이즈 데이터 센터 시설을 보여주는 12페이지의 스톡 사진입니다.",
    source: "2024_연간보고서_v2.pdf (p.12)",
    pageNumber: 12,
    tags: ["DATACENTER", "PHOTO"],
    thumbnailUrl: "/placeholder-image.svg",
  },
  {
    id: "si6",
    sectionId: "s4",
    filename: "시장_점유율_그래프.png",
    description:
      "2024년 전망에 대한 경쟁사별 시장 점유율을 분석한 파이 차트입니다.",
    source: "2024_연간보고서_v2.pdf (p.8)",
    pageNumber: 8,
    tags: ["MARKET", "PIE CHART"],
    thumbnailUrl: "/placeholder-image.svg",
    contextText:
      '"시장 점유율 분석(그림 2.1)에 따르면, AI 기반 문서 처리 분야에서 주요 경쟁사 대비 우위를 확보하고 있습니다..."',
  },

  // ── d2: 프로젝트_계획서_최종.pdf ──
  {
    id: "si7",
    sectionId: "s9",
    filename: "시스템_아키텍처_다이어그램.png",
    description:
      "Next.js → Nginx → FastAPI → PostgreSQL/MongoDB/MinIO 전체 시스템 구성도입니다.",
    source: "프로젝트_계획서_최종.pdf (p.4)",
    pageNumber: 4,
    tags: ["ARCHITECTURE", "CLOUD"],
    thumbnailUrl: "/placeholder-image.svg",
    contextText:
      '"시스템 아키텍처는 마이크로서비스 지향 설계를 채택하며, 각 서비스는 독립 배포가 가능합니다..."',
  },
  {
    id: "si8",
    sectionId: "s8",
    filename: "간트_차트_일정표.png",
    description:
      "11주간의 프로젝트 마일스톤을 시각화한 간트 차트입니다.",
    source: "프로젝트_계획서_최종.pdf (p.2)",
    pageNumber: 2,
    tags: ["CHART", "TRENDS"],
    thumbnailUrl: "/placeholder-image.svg",
    contextText:
      '"프로젝트 일정은 4개 Phase로 구분되며, 각 Phase 종료 시 마일스톤 리뷰를 수행합니다..."',
  },
  {
    id: "si9",
    sectionId: "s10",
    filename: "ER_다이어그램.png",
    description:
      "5개 핵심 엔티티 간의 관계를 표현한 ER 다이어그램입니다.",
    source: "프로젝트_계획서_최종.pdf (p.6)",
    pageNumber: 6,
    tags: ["TABLE", "ARCHITECTURE"],
    thumbnailUrl: "/placeholder-image.svg",
  },

  // ── d4: 기술_사양서_v3.pdf ──
  {
    id: "si10",
    sectionId: "s13",
    filename: "서버_스펙_비교표.png",
    description:
      "최소/권장 하드웨어 사양을 비교한 표 이미지입니다.",
    source: "기술_사양서_v3.pdf (p.2)",
    pageNumber: 2,
    tags: ["TABLE", "DATACENTER"],
    thumbnailUrl: "/placeholder-image.svg",
    contextText:
      '"서버 환경은 컨테이너 기반 배포를 전제로 하며, Kubernetes 클러스터에서 오토스케일링을 지원합니다..."',
  },
  {
    id: "si11",
    sectionId: "s14",
    filename: "OCR_엔진_정확도_비교.png",
    description:
      "3개 OCR 엔진의 한글/영문/혼합 문서 인식률 비교 바 차트입니다.",
    source: "기술_사양서_v3.pdf (p.5)",
    pageNumber: 5,
    tags: ["CHART", "OCR", "ACCURACY"],
    thumbnailUrl: "/placeholder-image.svg",
    contextText:
      '"한글 문서에서 PaddleOCR이 96.2%로 가장 높은 정확도를 기록했으며, Tesseract는 89.1%에 그쳤습니다..."',
  },
  {
    id: "si12",
    sectionId: "s15",
    filename: "레이아웃_분석_플로우.png",
    description:
      "LayoutLMv3 기반 문서 레이아웃 분석 파이프라인 흐름도입니다.",
    source: "기술_사양서_v3.pdf (p.7)",
    pageNumber: 7,
    tags: ["NEURAL", "LAYOUT", "ARCHITECTURE"],
    thumbnailUrl: "/placeholder-image.svg",
    contextText:
      '"레이아웃 분석 파이프라인은 입력 이미지를 영역 분할 → 분류 → 순서 정렬 3단계로 처리합니다..."',
  },
  {
    id: "si13",
    sectionId: "s16",
    filename: "API_엔드포인트_구조도.png",
    description:
      "26개 REST API 엔드포인트의 리소스 계층 구조를 나타낸 트리 다이어그램입니다.",
    source: "기술_사양서_v3.pdf (p.10)",
    pageNumber: 10,
    tags: ["ARCHITECTURE", "OPERATIONS"],
    thumbnailUrl: "/placeholder-image.svg",
  },

  // ── d6: 품질관리_매뉴얼.pdf ──
  {
    id: "si14",
    sectionId: "s18",
    filename: "품질_게이트_프로세스.png",
    description:
      "5단계 품질 게이트 프로세스를 시각화한 플로우차트입니다.",
    source: "품질관리_매뉴얼.pdf (p.1)",
    pageNumber: 1,
    tags: ["OPERATIONS", "CHART"],
    thumbnailUrl: "/placeholder-image.svg",
    contextText:
      '"각 품질 게이트에서 합격 기준(95%)을 충족하지 못하면 이전 단계로 반환되어 재작업을 수행합니다..."',
  },
  {
    id: "si15",
    sectionId: "s19",
    filename: "KPI_대시보드_스크린샷.png",
    description:
      "실시간 품질 KPI 모니터링 대시보드 화면 캡처입니다.",
    source: "품질관리_매뉴얼.pdf (p.3)",
    pageNumber: 3,
    tags: ["KPI", "CHART", "TRENDS"],
    thumbnailUrl: "/placeholder-image.svg",
  },

  // ── d7: 예산_보고서_Q1.pdf ──
  {
    id: "si16",
    sectionId: "s21",
    filename: "예산_집행률_차트.png",
    description:
      "1분기 월별 예산 집행률 추이를 나타내는 라인 차트입니다.",
    source: "예산_보고서_Q1.pdf (p.1)",
    pageNumber: 1,
    tags: ["REVENUE", "CHART", "TRENDS"],
    thumbnailUrl: "/placeholder-image.svg",
    contextText:
      '"1월 92.1% → 2월 97.5% → 3월 104.8%로 분기 후반으로 갈수록 집행률이 상승했습니다..."',
  },
  {
    id: "si17",
    sectionId: "s22",
    filename: "부서별_비용_파이차트.png",
    description:
      "부서별 비용 비중을 시각화한 파이 차트입니다.",
    source: "예산_보고서_Q1.pdf (p.3)",
    pageNumber: 3,
    tags: ["PIE CHART", "REVENUE"],
    thumbnailUrl: "/placeholder-image.svg",
  },
  {
    id: "si18",
    sectionId: "s23",
    filename: "클라우드_비용_추이.png",
    description:
      "월별 AWS 클라우드 비용 추이 및 인스턴스 유형별 비율 스택 바 차트입니다.",
    source: "예산_보고서_Q1.pdf (p.5)",
    pageNumber: 5,
    tags: ["CLOUD", "CHART", "TRENDS"],
    thumbnailUrl: "/placeholder-image.svg",
    contextText:
      '"GPU 인스턴스 비용이 전체의 65%를 차지하며, Reserved Instance 전환 시 연간 약 1억 2,600만원 절감이 가능합니다..."',
  },

  // ── d9: 보안_감사_리포트.pdf ──
  {
    id: "si19",
    sectionId: "s24",
    filename: "감사_적합률_추이.png",
    description:
      "최근 3년간 보안 감사 적합률 변화를 나타내는 라인 차트입니다.",
    source: "보안_감사_리포트.pdf (p.1)",
    pageNumber: 1,
    tags: ["CHART", "TRENDS", "ACCURACY"],
    thumbnailUrl: "/placeholder-image.svg",
    contextText:
      '"2024년 92.3% → 2025년 94.6%로 꾸준히 향상되고 있으며, 목표인 96% 달성을 위해 자동화 감사 도구를 도입합니다..."',
  },
  {
    id: "si20",
    sectionId: "s25",
    filename: "취약점_등급_분포.png",
    description:
      "발견된 취약점의 등급별 분포를 나타내는 바 차트입니다.",
    source: "보안_감사_리포트.pdf (p.3)",
    pageNumber: 3,
    tags: ["CHART", "OPERATIONS"],
    thumbnailUrl: "/placeholder-image.svg",
  },

  // ── d11: 교육_자료_AI_기초.pdf ──
  {
    id: "si21",
    sectionId: "s27",
    filename: "AI_분야_개요도.png",
    description:
      "AI → ML → DL → NLP/CV 등 인공지능 하위 분야 계층 구조도입니다.",
    source: "교육_자료_AI_기초.pdf (p.1)",
    pageNumber: 1,
    tags: ["AI ARCHITECTURE", "NEURAL"],
    thumbnailUrl: "/placeholder-image.svg",
    contextText:
      '"인공지능은 크게 규칙 기반 시스템과 학습 기반 시스템으로 나뉘며, 현대 AI는 대부분 학습 기반 접근을 사용합니다..."',
  },
  {
    id: "si22",
    sectionId: "s28",
    filename: "OCR_파이프라인_흐름도.png",
    description:
      "전처리 → 문자 분할 → 특징 추출 → 인식 → 후처리 OCR 5단계 흐름도입니다.",
    source: "교육_자료_AI_기초.pdf (p.4)",
    pageNumber: 4,
    tags: ["OCR", "ARCHITECTURE"],
    thumbnailUrl: "/placeholder-image.svg",
    contextText:
      '"OCR 파이프라인에서 전처리 단계의 품질이 최종 인식 정확도에 가장 큰 영향을 미칩니다..."',
  },
  {
    id: "si23",
    sectionId: "s29",
    filename: "트랜스포머_아키텍처.png",
    description:
      "Self-Attention 메커니즘과 Encoder-Decoder 구조를 설명하는 트랜스포머 모델 다이어그램입니다.",
    source: "교육_자료_AI_기초.pdf (p.8)",
    pageNumber: 8,
    tags: ["NEURAL", "AI ARCHITECTURE"],
    thumbnailUrl: "/placeholder-image.svg",
  },
];

// 통계
export const mockStatistics: Statistics = {
  totalUploads: 247,
  totalUploadsTrend: 12.5,
  ocrCompleted: 198,
  ocrCompletedTrend: 8.3,
  pendingTasks: 15,
  pendingTasksTrend: -5.2,
};

export const mockMonthlyOcrData: MonthlyOcrData[] = [
  { month: "2025-10", uploaded: 35, completed: 28, failed: 3 },
  { month: "2025-11", uploaded: 42, completed: 35, failed: 2 },
  { month: "2025-12", uploaded: 50, completed: 42, failed: 4 },
  { month: "2026-01", uploaded: 44, completed: 38, failed: 1 },
  { month: "2026-02", uploaded: 52, completed: 45, failed: 3 },
  { month: "2026-03", uploaded: 24, completed: 10, failed: 1 },
];

export const mockUserStats: UserStats[] = [
  { user: mockUsers[0], documentsProcessed: 85, successRate: 96.5 },
  { user: mockUsers[1], documentsProcessed: 62, successRate: 94.2 },
  { user: mockUsers[2], documentsProcessed: 34, successRate: 91.8 },
  { user: mockUsers[3], documentsProcessed: 17, successRate: 100 },
];

// 활동 로그
export const mockActivityLogs: ActivityLog[] = [
  {
    id: "log1",
    type: "upload",
    message: "API_명세서_v4.pdf 파일을 업로드했습니다.",
    user: mockUsers[2],
    timestamp: "2026-03-10T08:00:00Z",
  },
  {
    id: "log2",
    type: "ocr",
    message: "2024_연간보고서_v2.pdf OCR 처리가 완료되었습니다.",
    user: mockUsers[0],
    timestamp: "2026-03-09T16:30:00Z",
  },
  {
    id: "log3",
    type: "update",
    message: "기술_사양서_v3.pdf 메타데이터를 수정했습니다.",
    user: mockUsers[0],
    timestamp: "2026-03-09T14:20:00Z",
  },
  {
    id: "log4",
    type: "export",
    message: "보안_감사_리포트.pdf 데이터를 CSV로 내보냈습니다.",
    user: mockUsers[3],
    timestamp: "2026-03-08T17:00:00Z",
  },
  {
    id: "log5",
    type: "login",
    message: "시스템에 로그인했습니다.",
    user: mockUsers[1],
    timestamp: "2026-03-08T09:00:00Z",
  },
  {
    id: "log6",
    type: "delete",
    message: "테스트_문서.pdf를 삭제했습니다.",
    user: mockUsers[0],
    timestamp: "2026-03-07T15:45:00Z",
  },
  {
    id: "log7",
    type: "ocr",
    message: "인사_규정_개정안.pdf OCR 처리에 실패했습니다.",
    user: mockUsers[3],
    timestamp: "2026-03-02T13:40:00Z",
  },
  {
    id: "log8",
    type: "upload",
    message: "계약서_A사_2026.pdf 파일을 업로드했습니다.",
    user: mockUsers[2],
    timestamp: "2026-03-01T11:20:00Z",
  },
];

// 상태 라벨 매핑
export const statusLabels: Record<string, string> = {
  uploaded: "미추출",
  ocr_processing: "작업중",
  ocr_completed: "추출 완료",
  ocr_failed: "추출 실패",
  draft: "업로드 실패",
};

// 상태별 배지 색상
export const statusVariants: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  uploaded: "secondary",
  ocr_processing: "default",
  ocr_completed: "default",
  ocr_failed: "destructive",
  draft: "outline",
};

// 파일 크기 포맷
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// 날짜 포맷
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
