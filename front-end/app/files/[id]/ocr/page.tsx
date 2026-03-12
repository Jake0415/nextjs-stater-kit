"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Zap,
  Network,
  Timer,
  Shield,
  History,
  Check,
  RefreshCw,
  Loader2,
  X,
  FileText,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ROUTES } from "@/lib/routes";
import {
  mockDocuments,
  mockTemplates,
  formatFileSize,
  formatDateTime,
} from "@/lib/mock";
import { toast } from "sonner";
import type { OcrStage, OcrLog } from "@/lib/types";

type PageState = "idle" | "processing" | "completed";

// 파이프라인 단계 (트리거 화면용)
const pipelineStages = [
  { label: "문서 스캔" },
  { label: "텍스트, 표, 이미지 추출" },
  { label: "LLM 정제" },
  { label: "DB 저장" },
];

// 프로세싱 파이프라인 단계 정보
type StageStatus = "pending" | "active" | "completed" | "error";

interface StageInfo {
  name: OcrStage;
  label: string;
  description: string;
  status: StageStatus;
  progress: number;
}

const INITIAL_STAGES: StageInfo[] = [
  {
    name: "preprocessing",
    label: "문서 전처리",
    description: "최적화 및 형식 검증",
    status: "pending",
    progress: 0,
  },
  {
    name: "text_extraction",
    label: "텍스트 및 표 추출",
    description: "고성능 OCR 엔진 실행",
    status: "pending",
    progress: 0,
  },
  {
    name: "llm_analysis",
    label: "LLM을 활용한 이미지 분석",
    description: "차트 및 시각 자료의 맥락 이해",
    status: "pending",
    progress: 0,
  },
  {
    name: "metadata_synthesis",
    label: "메타데이터 합성",
    description: "최종 데이터 구조화 및 태깅",
    status: "pending",
    progress: 0,
  },
];

export default function OcrTriggerPage() {
  const params = useParams();
  const router = useRouter();
  const docId = params.id as string;
  const doc = mockDocuments.find((d) => d.id === docId);

  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [pageState, setPageState] = useState<PageState>("idle");

  // 프로세싱 상태
  const [stages, setStages] = useState<StageInfo[]>(INITIAL_STAGES);
  const [overallProgress, setOverallProgress] = useState(0);
  const [logs, setLogs] = useState<OcrLog[]>([]);
  const [processingStatus, setProcessingStatus] = useState<
    "processing" | "completed" | "error"
  >("processing");
  const [cancelOpen, setCancelOpen] = useState(false);

  // 현재 활성 단계
  const activeStage = stages.find((s) => s.status === "active");

  // OCR 시작
  const handleStart = () => {
    if (!doc || !selectedTemplate) return;

    if (doc.status === "ocr_processing") {
      toast.info("이미 OCR 처리가 진행 중입니다.");
      return;
    }

    toast.success("OCR 텍스트 추출이 시작되었습니다.");
    setPageState("processing");
    setStages(INITIAL_STAGES);
    setOverallProgress(0);
    setLogs([]);
    setProcessingStatus("processing");
  };

  const addLog = useCallback(
    (stage: OcrStage, message: string, level: OcrLog["level"] = "info") => {
      const now = new Date();
      const ts = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
      setLogs((prev) => {
        const next = [...prev, { timestamp: ts, stage, message, level }];
        return next.length > 50 ? next.slice(-50) : next;
      });
    },
    []
  );

  // Mock 시뮬레이션
  useEffect(() => {
    if (pageState !== "processing" || processingStatus !== "processing") return;

    let stageIndex = 0;
    let stageProgress = 0;

    setStages((prev) =>
      prev.map((s, i) => (i === 0 ? { ...s, status: "active" } : s))
    );
    addLog("preprocessing", "문서 전처리를 시작합니다.");

    const interval = setInterval(() => {
      stageProgress += 20;

      if (stageProgress > 100) {
        const completedStageName = INITIAL_STAGES[stageIndex].name;
        setStages((prev) =>
          prev.map((s, i) =>
            i === stageIndex ? { ...s, status: "completed", progress: 100 } : s
          )
        );
        addLog(completedStageName, `${INITIAL_STAGES[stageIndex].label} 완료`);

        stageIndex++;
        stageProgress = 0;

        if (stageIndex >= INITIAL_STAGES.length) {
          clearInterval(interval);
          setOverallProgress(100);
          setProcessingStatus("completed");
          toast.success(`${doc?.filename} OCR 추출이 완료되었습니다.`);
          return;
        }

        const nextStageName = INITIAL_STAGES[stageIndex].name;
        setStages((prev) =>
          prev.map((s, i) =>
            i === stageIndex ? { ...s, status: "active" } : s
          )
        );
        addLog(
          nextStageName,
          `${INITIAL_STAGES[stageIndex].label}을 시작합니다.`
        );
      } else {
        setStages((prev) =>
          prev.map((s, i) =>
            i === stageIndex ? { ...s, progress: stageProgress } : s
          )
        );
      }

      const overall = Math.round(
        ((stageIndex * 100 + stageProgress) / (INITIAL_STAGES.length * 100)) *
          100
      );
      setOverallProgress(overall);
    }, 800);

    return () => clearInterval(interval);
  }, [pageState, processingStatus, addLog, doc?.filename]);

  // 예상 남은 시간
  const remainingSeconds = Math.max(
    0,
    Math.round(((100 - overallProgress) / 100) * 120)
  );
  const remainingMinutes = Math.floor(remainingSeconds / 60);
  const remainingSecs = remainingSeconds % 60;
  const remainingText =
    remainingSeconds > 0
      ? `~ ${remainingMinutes}분 ${remainingSecs.toString().padStart(2, "0")}초`
      : "거의 완료";

  // 취소 처리
  const handleCancel = () => {
    setCancelOpen(false);
    setProcessingStatus("error");
    addLog(
      activeStage?.name ?? "preprocessing",
      "사용자에 의해 취소되었습니다.",
      "warning"
    );
    setStages((prev) =>
      prev.map((s) =>
        s.status === "active" ? { ...s, status: "error" } : s
      )
    );
    toast.info("OCR 처리가 취소되었습니다.");
  };

  // 재시도
  const handleRetry = () => {
    setStages(INITIAL_STAGES);
    setOverallProgress(0);
    setLogs([]);
    setProcessingStatus("processing");
  };

  // 처리 중 페이지 표시 정보
  const processedPages = doc
    ? Math.round((overallProgress / 100) * doc.pageCount)
    : 0;

  // 문서 미존재
  if (!doc) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">문서를 찾을 수 없습니다</h1>
        <p className="mt-2 text-muted-foreground">
          요청한 문서가 존재하지 않거나 삭제되었습니다.
        </p>
        <Button asChild className="mt-6" variant="outline">
          <Link href={ROUTES.FILES}>
            <ArrowLeft className="mr-2 size-4" />
            파일 관리로 돌아가기
          </Link>
        </Button>
      </div>
    );
  }

  // ━━━ 프로세싱 상태 (Figma 1:5659) ━━━
  if (pageState === "processing") {
    return (
      <div className="mx-auto max-w-[1024px] px-8 py-10 sm:px-[128px]">
        {/* 페이지 헤더 */}
        <div className="mb-8 flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            OCR 텍스트 추출 진행 중
          </h1>
          <p className="text-sm text-slate-500">
            문서에 대한 고급 AI 분석을 실행하고 있습니다
          </p>
        </div>

        {/* 2컬럼 레이아웃 */}
        <div className="flex gap-8">
          {/* 좌측: 활성 작업 + 로그 */}
          <div className="flex flex-1 flex-col gap-6">
            {/* 활성 작업 카드 */}
            <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
              {/* 상단: 활성 작업 타이틀 + 진행률 */}
              <div className="mb-4 flex items-end justify-between">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold uppercase tracking-[1.2px] text-brand">
                    활성 작업
                  </span>
                  <span className="text-lg font-bold text-slate-900">
                    {activeStage?.label ??
                      (processingStatus === "completed"
                        ? "모든 단계 완료"
                        : "대기 중")}
                  </span>
                </div>
                <span className="text-2xl font-bold text-slate-900">
                  {overallProgress}%
                </span>
              </div>

              {/* 프로그레스 바 */}
              <Progress value={overallProgress} className="mb-4 h-3" />

              {/* 처리 중 페이지 표시 */}
              <div className="mb-8 flex items-center gap-2 text-sm text-slate-500">
                <RefreshCw className="size-3.5" />
                <span>
                  {doc.pageCount}페이지 중 {processedPages}페이지 처리 중...
                </span>
              </div>

              {/* 구분선 */}
              <div className="mb-1 h-px bg-slate-100" />

              {/* 파이프라인 단계 목록 */}
              <div className="flex flex-col gap-1">
                {stages.map((stage, idx) => (
                  <div
                    key={stage.name}
                    className={`flex items-center gap-3 rounded-lg py-3 ${
                      stage.status === "pending" ? "opacity-50" : ""
                    }`}
                  >
                    {/* 상태 아이콘 */}
                    {stage.status === "completed" ? (
                      <div className="flex size-6 items-center justify-center rounded-full bg-emerald-500">
                        <Check className="size-3 text-white" />
                      </div>
                    ) : stage.status === "active" ? (
                      <div className="flex size-6 items-center justify-center rounded-full bg-brand">
                        <RefreshCw className="size-3 animate-spin text-white" />
                      </div>
                    ) : stage.status === "error" ? (
                      <div className="flex size-6 items-center justify-center rounded-full bg-red-500">
                        <X className="size-3 text-white" />
                      </div>
                    ) : (
                      <div className="flex size-6 items-center justify-center rounded-full bg-slate-100">
                        <span className="text-[10px] font-bold text-slate-400">
                          {idx + 1}
                        </span>
                      </div>
                    )}

                    {/* 라벨 */}
                    <div className="flex flex-1 flex-col">
                      <span
                        className={`text-sm font-bold ${
                          stage.status === "active"
                            ? "text-brand"
                            : stage.status === "error"
                              ? "text-red-500"
                              : "text-slate-900"
                        }`}
                      >
                        {stage.label}
                      </span>
                      <span className="text-xs text-slate-400">
                        {stage.description}
                      </span>
                    </div>

                    {/* 상태 텍스트 */}
                    <span
                      className={`text-[10px] font-bold uppercase ${
                        stage.status === "completed"
                          ? "text-emerald-500"
                          : stage.status === "active"
                            ? "text-brand"
                            : stage.status === "error"
                              ? "text-red-500"
                              : "text-slate-300"
                      }`}
                    >
                      {stage.status === "completed"
                        ? "성공"
                        : stage.status === "active"
                          ? "진행 중"
                          : stage.status === "error"
                            ? "오류"
                            : "대기 중"}
                    </span>
                  </div>
                ))}
              </div>

              {/* 하단 버튼 */}
              <div className="mt-2 flex items-center justify-center gap-4 pt-2">
                {processingStatus === "processing" && (
                  <>
                    <Button
                      variant="outline"
                      className="gap-2 rounded-lg"
                      onClick={() => setCancelOpen(true)}
                    >
                      <X className="size-[18px]" />
                      프로세스 취소
                    </Button>
                    <Button
                      disabled
                      className="gap-2 rounded-lg bg-slate-100 text-slate-400"
                    >
                      <Loader2 className="size-[18px] animate-spin" />
                      처리 중...
                    </Button>
                  </>
                )}
                {processingStatus === "error" && (
                  <>
                    <Button
                      variant="ghost"
                      onClick={() => setPageState("idle")}
                    >
                      돌아가기
                    </Button>
                    <Button
                      onClick={handleRetry}
                      className="gap-2 bg-brand hover:bg-brand/90"
                    >
                      <RefreshCw className="size-4" />
                      재시도
                    </Button>
                  </>
                )}
                {processingStatus === "completed" && (
                  <>
                    <Button asChild variant="ghost">
                      <Link href={ROUTES.FILES}>파일 관리</Link>
                    </Button>
                    <Button
                      asChild
                      className="gap-2 bg-brand hover:bg-brand/90"
                    >
                      <Link href={ROUTES.FILE_RESULT(docId)}>결과 보기</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* 실행 로그 (다크 터미널) */}
            <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#0b1222]">
              {/* 로그 헤더 */}
              <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
                <span className="text-xs font-bold uppercase tracking-[1.2px] text-slate-500">
                  실행 로그
                </span>
                <span className="text-xs font-medium text-emerald-500/80">
                  실시간 연결 활성화
                </span>
              </div>
              {/* 로그 내용 */}
              <div className="h-[140px] overflow-y-auto px-6 py-3">
                {logs.map((log, i) => (
                  <div
                    key={i}
                    className="font-mono text-xs leading-[19.5px]"
                  >
                    <span className="text-slate-600">[{log.timestamp}]</span>
                    <span
                      className={
                        log.level === "error"
                          ? "text-red-400"
                          : log.level === "warning"
                            ? "text-amber-400"
                            : "text-slate-400"
                      }
                    >
                      {" "}
                      {log.message}
                    </span>
                  </div>
                ))}
                {logs.length === 0 && (
                  <span className="text-xs text-slate-600">
                    로그 대기 중...
                  </span>
                )}
                {/* 커서 */}
                {processingStatus === "processing" && (
                  <div className="mt-1 h-4 w-1 animate-pulse bg-brand/80" />
                )}
              </div>
            </div>
          </div>

          {/* 우측: 파일 정보 + 안내 카드 */}
          <div className="flex w-[320px] shrink-0 flex-col gap-6">
            {/* 파일 정보 카드 */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-[1.2px] text-slate-400">
                파일 정보
              </span>

              {/* 파일 아이콘 + 이름 */}
              <div className="mt-6 flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-lg bg-red-50">
                  <FileText className="size-6 text-red-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-900">
                    {doc.filename}
                  </span>
                  <span className="text-xs text-slate-500">
                    {formatFileSize(doc.fileSize)} • {doc.pageCount} 페이지
                  </span>
                </div>
              </div>

              {/* 메타 정보 */}
              <div className="mt-6 flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400">
                    버전
                  </span>
                  <span className="text-sm font-medium text-slate-700">
                    v{doc.version}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400">
                    업로더
                  </span>
                  <div className="flex items-center gap-2">
                    <Avatar className="size-5">
                      <AvatarFallback className="text-[8px]">
                        {doc.uploadedBy.name.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-slate-700">
                      {doc.uploadedBy.name}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400">
                    생성 일자
                  </span>
                  <span className="text-sm font-medium text-slate-700">
                    {formatDateTime(doc.uploadedAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* 파란 안내 카드 */}
            <div className="rounded-xl bg-blue-600 p-6 text-white shadow-[0px_10px_15px_-3px_#bfdbfe,0px_4px_6px_-4px_#bfdbfe]">
              <div className="mb-4 flex items-start gap-3">
                <Info className="mt-0.5 size-5 shrink-0" />
                <p className="text-xs font-medium leading-[1.6]">
                  문서의 복잡도와 이미지 밀도에 따라 처리 시간이 달라질 수
                  있습니다.
                </p>
              </div>
              <div className="rounded-lg bg-white/10 p-3">
                <span className="text-[10px] font-bold uppercase tracking-[1px] opacity-80">
                  예상 남은 시간
                </span>
                <p className="mt-1 text-lg font-bold">{remainingText}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 취소 확인 AlertDialog */}
        <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                OCR 처리를 취소하시겠습니까?
              </AlertDialogTitle>
              <AlertDialogDescription>
                진행 중인 OCR 처리가 중단됩니다. 이후 다시 시작할 수
                있습니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>계속 진행</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleCancel}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                취소하기
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  // ━━━ 완료 상태 ━━━
  if (pageState === "completed") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">OCR 추출이 완료되었습니다</h1>
        <p className="mt-2 text-muted-foreground">
          결과를 확인하려면 아래 버튼을 클릭하세요.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button asChild variant="outline">
            <Link href={ROUTES.FILES}>
              <ArrowLeft className="mr-2 size-4" />
              파일 관리
            </Link>
          </Button>
          <Button asChild className="bg-brand hover:bg-brand/90">
            <Link href={ROUTES.FILE_RESULT(docId)}>결과 보기</Link>
          </Button>
        </div>
      </div>
    );
  }

  const selectedTemplateName = mockTemplates.find(
    (t) => t.id === selectedTemplate
  )?.name;

  // ━━━ 기본: Figma 1:5394 OCR 트리거 UI ━━━
  return (
    <div className="mx-auto max-w-[896px] px-4 py-10 sm:px-6">
      {/* 페이지 헤더 */}
      <div className="mb-8 flex flex-col gap-1">
        <h1 className="text-[36px] font-black tracking-tight text-slate-900">
          OCR 텍스트 추출
        </h1>
        <p className="text-base text-slate-500">
          문서의 자동 텍스트 추출 파이프라인을 설정하고 시작합니다.
        </p>
      </div>

      {/* 메인 카드 */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* 상단: 문서 정보 + 템플릿 선택 */}
        <div className="border-b border-slate-100 px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              {/* 아이콘 */}
              <div className="flex size-14 items-center justify-center rounded-xl border border-blue-100 bg-blue-50">
                <Network className="size-7 text-brand" />
              </div>
              {/* 파일 정보 */}
              <div className="flex flex-col gap-1">
                <h2 className="text-xl font-bold text-slate-900">
                  {doc.filename}
                </h2>
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <Badge
                    variant="outline"
                    className="border-slate-200 bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-500"
                  >
                    v{doc.version}
                  </Badge>
                  <span className="text-slate-300">&bull;</span>
                  <span>{formatFileSize(doc.fileSize)}</span>
                  <span className="text-slate-300">&bull;</span>
                  <div className="flex items-center gap-2">
                    <Avatar className="size-5">
                      <AvatarFallback className="text-[8px]">
                        {doc.uploadedBy.name.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-slate-600">
                      {doc.uploadedBy.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* 추출 템플릿 */}
            <div className="flex flex-col items-end gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                추출 템플릿
              </span>
              <Select
                value={selectedTemplate}
                onValueChange={setSelectedTemplate}
              >
                <SelectTrigger className="h-[42px] w-[208px] rounded-xl border-slate-200 bg-white text-sm font-bold text-slate-700 shadow-sm">
                  <SelectValue placeholder="템플릿 선택" />
                </SelectTrigger>
                <SelectContent>
                  {mockTemplates.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* 중앙: 추출 준비 완료 */}
        <div className="flex flex-col items-center px-8 pb-12 pt-12">
          {/* 원형 아이콘 */}
          <div className="relative mb-8 flex size-32 items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-brand/20 bg-brand/5" />
            <div className="relative flex size-24 items-center justify-center rounded-full border border-slate-50 bg-white shadow-lg">
              <Network className="size-12 text-brand" />
            </div>
          </div>

          {/* 텍스트 */}
          <h2 className="mb-2 text-2xl font-bold text-slate-900">
            추출 준비 완료
          </h2>
          <p className="mb-10 max-w-md text-center text-base leading-relaxed text-slate-500">
            고급 OCR 파이프라인을 실행하여 LLM 기반 엔진으로 텍스트, 복잡한 표
            및 시각적 요소를 자동으로 분석합니다.
          </p>

          {/* OCR 시작 버튼 */}
          <Button
            onClick={handleStart}
            disabled={!selectedTemplate}
            size="lg"
            className="gap-3 rounded-xl bg-brand px-10 py-4 text-lg font-bold shadow-lg hover:bg-brand/90"
          >
            <Zap className="size-6" />
            OCR 텍스트 추출 시작
          </Button>

          {/* 파이프라인 단계 */}
          <div className="relative mt-20 w-full max-w-[768px]">
            {/* 배경 라인 */}
            <div className="absolute left-4 right-4 top-1.5 h-1 rounded-full bg-slate-100" />
            <div className="flex items-start justify-between px-4">
              {pipelineStages.map((stage) => (
                <div
                  key={stage.label}
                  className="flex flex-col items-center"
                >
                  <div className="relative z-10 size-3 rounded-full border-2 border-white bg-slate-200 shadow-[0_0_0_1px_#e2e8f0]" />
                  <span className="mt-3 text-xs font-bold tracking-tight text-slate-400">
                    {stage.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 하단 뱃지 */}
        <div className="border-t border-slate-100 bg-slate-50/50 px-8 py-4">
          <div className="flex items-center justify-center gap-8">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <Timer className="size-4" />
              고성능 처리
            </div>
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <Shield className="size-4" />
              암호화 보안
            </div>
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <History className="size-4" />
              버전 관리
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
