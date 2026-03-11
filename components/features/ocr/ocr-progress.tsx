"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { XCircle, RotateCcw, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { PipelineStage } from "./pipeline-stage";
import { OcrLogViewer } from "./ocr-log-viewer";
import { ROUTES } from "@/lib/routes";
import { toast } from "sonner";
import type { Document, OcrLog, OcrStage } from "@/lib/types";

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
    description: "PDF 파싱 및 이미지 변환",
    status: "pending",
    progress: 0,
  },
  {
    name: "text_extraction",
    label: "텍스트 및 표 추출",
    description: "세그먼테이션, TOC, 레이아웃 분석",
    status: "pending",
    progress: 0,
  },
  {
    name: "llm_analysis",
    label: "LLM 이미지 분석",
    description: "청킹, 이미지 캡셔닝, AI 태그 생성",
    status: "pending",
    progress: 0,
  },
  {
    name: "metadata_synthesis",
    label: "메타데이터 합성",
    description: "키워드 추출, 임베딩 생성",
    status: "pending",
    progress: 0,
  },
];

interface OcrProgressViewProps {
  document: Document;
  onComplete: () => void;
  onCancel: () => void;
}

export function OcrProgressView({
  document: doc,
  onComplete,
  onCancel,
}: OcrProgressViewProps) {
  const [stages, setStages] = useState<StageInfo[]>(INITIAL_STAGES);
  const [overallProgress, setOverallProgress] = useState(0);
  const [logs, setLogs] = useState<OcrLog[]>([]);
  const [status, setStatus] = useState<"processing" | "completed" | "error">(
    "processing"
  );
  const [cancelOpen, setCancelOpen] = useState(false);

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
    if (status !== "processing") return;

    let stageIndex = 0;
    let stageProgress = 0;

    // 첫 단계 시작
    setStages((prev) =>
      prev.map((s, i) => (i === 0 ? { ...s, status: "active" } : s))
    );
    addLog("preprocessing", "문서 전처리를 시작합니다.");

    const interval = setInterval(() => {
      stageProgress += 20;

      if (stageProgress > 100) {
        // 현재 단계 완료
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
          // 모든 단계 완료
          clearInterval(interval);
          setOverallProgress(100);
          setStatus("completed");
          toast.success(`${doc.filename} OCR 추출이 완료되었습니다.`);
          return;
        }

        // 다음 단계 시작
        const nextStageName = INITIAL_STAGES[stageIndex].name;
        setStages((prev) =>
          prev.map((s, i) =>
            i === stageIndex ? { ...s, status: "active" } : s
          )
        );
        addLog(nextStageName, `${INITIAL_STAGES[stageIndex].label}을 시작합니다.`);
      } else {
        // 현재 단계 진행
        setStages((prev) =>
          prev.map((s, i) =>
            i === stageIndex ? { ...s, progress: stageProgress } : s
          )
        );
      }

      // 전체 진행률 계산
      const overall = Math.round(
        ((stageIndex * 100 + stageProgress) / (INITIAL_STAGES.length * 100)) *
          100
      );
      setOverallProgress(overall);
    }, 800);

    return () => clearInterval(interval);
  }, [status, addLog, doc.filename]);

  // 예상 남은 시간 계산
  const remainingSeconds = Math.max(
    0,
    Math.round(((100 - overallProgress) / 100) * 16)
  );
  const remainingText =
    remainingSeconds > 0 ? `약 ${remainingSeconds}초 남음` : "거의 완료";

  // 취소 처리
  const handleCancel = () => {
    setCancelOpen(false);
    setStatus("error");
    addLog(
      stages.find((s) => s.status === "active")?.name ?? "preprocessing",
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
    setStatus("processing");
  };

  return (
    <div className="space-y-6">
      {/* 파이프라인 단계 */}
      <div className="grid gap-3 sm:grid-cols-2">
        {stages.map((stage) => (
          <PipelineStage
            key={stage.name}
            label={stage.label}
            description={stage.description}
            status={stage.status}
            progress={stage.progress}
          />
        ))}
      </div>

      {/* 전체 진행률 */}
      <div className="rounded-xl border p-5">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-semibold">전체 진행률</span>
          <span className="text-muted-foreground">
            {status === "processing" && remainingText}
            {status === "completed" && "완료"}
            {status === "error" && "중단됨"}
          </span>
        </div>
        <Progress value={overallProgress} className="h-2.5" />
        <p className="mt-1.5 text-right text-sm font-bold text-brand">
          {overallProgress}%
        </p>
      </div>

      {/* 로그 뷰어 */}
      <OcrLogViewer logs={logs} />

      {/* 하단 버튼 */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          {doc.filename}
        </div>
        <div className="flex items-center gap-3">
          {status === "processing" && (
            <Button
              variant="outline"
              onClick={() => setCancelOpen(true)}
            >
              <XCircle className="mr-2 size-4" />
              프로세스 취소
            </Button>
          )}
          {status === "error" && (
            <>
              <Button variant="ghost" onClick={onCancel}>
                돌아가기
              </Button>
              <Button onClick={handleRetry} className="bg-brand hover:bg-brand/90">
                <RotateCcw className="mr-2 size-4" />
                재시도
              </Button>
            </>
          )}
          {status === "completed" && (
            <>
              <Button asChild variant="ghost">
                <Link href={ROUTES.FILES}>파일 관리</Link>
              </Button>
              <Button asChild className="bg-brand hover:bg-brand/90">
                <Link href={ROUTES.FILE_RESULT(doc.id)}>
                  결과 보기
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* 취소 확인 AlertDialog */}
      <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>OCR 처리를 취소하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              진행 중인 OCR 처리가 중단됩니다. 이후 다시 시작할 수 있습니다.
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
