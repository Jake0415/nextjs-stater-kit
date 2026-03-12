// 문서 상태
export type DocumentStatus =
  | "uploaded"
  | "ocr_processing"
  | "ocr_completed"
  | "ocr_failed"
  | "draft";

// 사용자
export interface User {
  id: string;
  name: string;
  role: "admin" | "user";
  avatar?: string;
}

// 문서
export interface Document {
  id: string;
  filename: string;
  description: string;
  status: DocumentStatus;
  version: string;
  fileSize: number;
  pageCount: number;
  uploadedBy: User;
  uploadedAt: string;
  updatedAt: string;
  ocrProgress?: number;
  templateId?: string;
}

// 섹션 (OCR 추출 결과 단위)
export interface Section {
  id: string;
  documentId: string;
  sectionLabel: string; // 예: "SEC-1.1"
  title: string; // 섹션 제목
  pageNumber: number;
  type: "text" | "table" | "image";
  content: string;
  confidence: number;
  tags: string[];
  keywords: string[];
}

// 섹션 이미지
export interface SectionImage {
  id: string;
  sectionId: string;
  filename: string;
  description: string;
  source: string;
  pageNumber: number;
  tags: string[];
  thumbnailUrl: string;
  contextText?: string; // 연결된 컨텍스트 텍스트
}

// 추출 템플릿
export interface Template {
  id: string;
  name: string;
  codeNumber: string;
  description: string;
  createdAt: string;
}

// OCR 파이프라인 단계
export type OcrStage =
  | "preprocessing"
  | "text_extraction"
  | "llm_analysis"
  | "metadata_synthesis";

// OCR 진행 상태
export interface OcrProgress {
  documentId: string;
  currentStage: OcrStage;
  stageProgress: number;
  logs: OcrLog[];
  startedAt: string;
}

export interface OcrLog {
  timestamp: string;
  stage: OcrStage;
  message: string;
  level: "info" | "warning" | "error";
}

// 통계
export interface Statistics {
  totalUploads: number;
  totalUploadsTrend: number;
  ocrCompleted: number;
  ocrCompletedTrend: number;
  pendingTasks: number;
  pendingTasksTrend: number;
}

export interface MonthlyOcrData {
  month: string;
  uploaded: number;
  completed: number;
  failed: number;
}

export interface UserStats {
  user: User;
  documentsProcessed: number;
  successRate: number;
}

// 활동 로그
export interface ActivityLog {
  id: string;
  type: "upload" | "ocr" | "delete" | "update" | "login" | "export";
  message: string;
  user: User;
  timestamp: string;
}
