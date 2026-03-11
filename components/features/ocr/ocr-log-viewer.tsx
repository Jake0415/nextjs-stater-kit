"use client";

import { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { OcrLog } from "@/lib/types";

const stageLabels: Record<string, string> = {
  preprocessing: "전처리",
  text_extraction: "텍스트 추출",
  llm_analysis: "LLM 분석",
  metadata_synthesis: "메타데이터",
};

const levelColors: Record<string, string> = {
  info: "text-foreground",
  warning: "text-yellow-600",
  error: "text-destructive",
};

interface OcrLogViewerProps {
  logs: OcrLog[];
}

export function OcrLogViewer({ logs }: OcrLogViewerProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs.length]);

  return (
    <div className="rounded-xl border">
      <div className="border-b px-4 py-2.5">
        <p className="text-sm font-semibold">실행 로그</p>
      </div>
      <ScrollArea className="h-56">
        <div className="space-y-1 p-3">
          {logs.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              로그가 아직 없습니다.
            </p>
          )}
          {logs.map((log, i) => (
            <div
              key={i}
              className="flex items-start gap-2 rounded px-2 py-1 text-xs hover:bg-muted/50"
            >
              <span className="shrink-0 font-mono text-muted-foreground">
                {log.timestamp}
              </span>
              <Badge variant="outline" className="shrink-0 text-[10px]">
                {stageLabels[log.stage] ?? log.stage}
              </Badge>
              <span className={cn(levelColors[log.level] ?? "text-foreground")}>
                {log.message}
              </span>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>
    </div>
  );
}
