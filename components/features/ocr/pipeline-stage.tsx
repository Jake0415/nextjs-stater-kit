"use client";

import { Circle, Loader2, CheckCircle, XCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type StageStatus = "pending" | "active" | "completed" | "error";

interface PipelineStageProps {
  label: string;
  description: string;
  status: StageStatus;
  progress: number;
}

const statusConfig: Record<
  StageStatus,
  { icon: typeof Circle; color: string; bg: string }
> = {
  pending: { icon: Circle, color: "text-muted-foreground", bg: "" },
  active: { icon: Loader2, color: "text-brand", bg: "bg-brand/5" },
  completed: {
    icon: CheckCircle,
    color: "text-green-600",
    bg: "bg-green-50 dark:bg-green-950/30",
  },
  error: {
    icon: XCircle,
    color: "text-destructive",
    bg: "bg-red-50 dark:bg-red-950/30",
  },
};

export function PipelineStage({
  label,
  description,
  status,
  progress,
}: PipelineStageProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-lg border p-3 transition-colors",
        config.bg
      )}
    >
      <Icon
        className={cn(
          "size-5 shrink-0",
          config.color,
          status === "active" && "animate-spin"
        )}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">{label}</p>
          {status === "active" && (
            <span className="text-xs text-muted-foreground">{progress}%</span>
          )}
          {status === "completed" && (
            <span className="text-xs text-green-600">완료</span>
          )}
          {status === "error" && (
            <span className="text-xs text-destructive">실패</span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {status === "active" && (
          <Progress value={progress} className="mt-1.5 h-1.5" />
        )}
      </div>
    </div>
  );
}
