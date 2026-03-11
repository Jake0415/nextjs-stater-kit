"use client";

import { FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatFileSize, formatDate, statusLabels, statusVariants } from "@/lib/mock";
import type { Document } from "@/lib/types";

interface DocumentInfoCardProps {
  document: Document;
}

export function DocumentInfoCard({ document: doc }: DocumentInfoCardProps) {
  return (
    <Card className="rounded-xl">
      <CardContent className="p-5">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
          <FileText className="size-4 text-brand" />
          문서 정보
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* 파일명 */}
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">파일명</p>
            <p className="text-sm font-medium">{doc.filename}</p>
          </div>

          {/* 버전 */}
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">버전</p>
            <Badge variant="outline">v{doc.version}</Badge>
          </div>

          {/* 크기 */}
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">파일 크기</p>
            <p className="text-sm font-medium">{formatFileSize(doc.fileSize)}</p>
          </div>

          {/* 페이지 수 */}
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">페이지 수</p>
            <p className="text-sm font-medium">{doc.pageCount}페이지</p>
          </div>

          {/* 업로더 */}
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">업로더</p>
            <div className="flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded-full bg-muted text-[10px] font-bold">
                {doc.uploadedBy.name.slice(0, 2)}
              </div>
              <p className="text-sm font-medium">{doc.uploadedBy.name}</p>
            </div>
          </div>

          {/* 상태 */}
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">상태</p>
            <Badge variant={statusVariants[doc.status] ?? "outline"}>
              {statusLabels[doc.status] ?? doc.status}
            </Badge>
          </div>

          {/* 업로드 날짜 */}
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">업로드 날짜</p>
            <p className="text-sm font-medium">{formatDate(doc.uploadedAt)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
