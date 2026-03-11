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

// 섹션 (d1 문서의 OCR 결과)
export const mockSections: Section[] = [
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
];

// 섹션 이미지
export const mockSectionImages: SectionImage[] = [
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
  { month: "2025-10", completed: 28, failed: 3 },
  { month: "2025-11", completed: 35, failed: 2 },
  { month: "2025-12", completed: 42, failed: 4 },
  { month: "2026-01", completed: 38, failed: 1 },
  { month: "2026-02", completed: 45, failed: 3 },
  { month: "2026-03", completed: 10, failed: 1 },
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
  uploaded: "업로드됨",
  ocr_processing: "처리 중",
  ocr_completed: "완료",
  ocr_failed: "실패",
  draft: "임시저장",
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
