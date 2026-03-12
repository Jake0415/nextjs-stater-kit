"use client";

import Link from "next/link";
import { FileText } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ROUTES } from "@/lib/routes";
import { formatFileSize, formatDate } from "@/lib/mock";
import type { Document } from "@/lib/types";

interface FileTableRowProps {
  document: Document;
  onDelete: (doc: Document) => void;
}

// 상태별 액션: OCR 추출 / 추출 완료 / 작업중
function StatusAction({ doc }: { doc: Document }) {
  // OCR 추출 대상: uploaded, ocr_failed
  if (doc.status === "uploaded" || doc.status === "ocr_failed") {
    return (
      <div className="flex items-center justify-end">
        <Button
          asChild
          size="sm"
          className="h-7 rounded bg-brand px-3 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm hover:bg-brand/90"
        >
          <Link href={ROUTES.FILE_OCR(doc.id)}>OCR 추출</Link>
        </Button>
      </div>
    );
  }

  // 추출 완료
  if (doc.status === "ocr_completed") {
    return (
      <div className="flex items-center justify-end">
        <Button
          asChild
          size="sm"
          className="h-7 rounded bg-emerald-600 px-3 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm hover:bg-emerald-700"
        >
          <Link href={ROUTES.FILE_RESULT(doc.id)}>추출 완료</Link>
        </Button>
      </div>
    );
  }

  // 작업중 (OCR 진행중)
  if (doc.status === "ocr_processing") {
    return (
      <div className="flex items-center justify-end">
        <Badge
          variant="outline"
          className="gap-1.5 border-amber-200 bg-amber-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-600"
        >
          <svg className="size-3 animate-spin" viewBox="0 0 12 12" fill="none">
            <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="2" strokeDasharray="20" strokeDashoffset="5" />
          </svg>
          작업중
        </Badge>
      </div>
    );
  }

  // 기타 상태 (draft 등): 표시 없음
  return <div className="flex items-center justify-end" />;
}

export function FileTableRow({
  document: doc,
  onDelete,
}: FileTableRowProps) {
  return (
    <TableRow className="border-b-slate-50 hover:bg-slate-50/30">
      {/* 파일명 */}
      <TableCell className="px-6 py-4">
        <Link
          href={ROUTES.FILE_EDIT(doc.id)}
          className="flex items-center gap-3"
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded bg-red-50">
            <FileText className="size-[18px] text-red-500" />
          </div>
          <span className="truncate text-sm font-bold text-slate-700 hover:text-brand">
            {doc.filename}
          </span>
        </Link>
      </TableCell>

      {/* 버전 */}
      <TableCell className="hidden px-6 py-4 md:table-cell">
        <Badge
          variant="outline"
          className="border-slate-200 bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-500"
        >
          v{doc.version}
        </Badge>
      </TableCell>

      {/* 파일 크기 */}
      <TableCell className="hidden px-6 py-4 text-sm font-medium text-slate-500 lg:table-cell">
        {formatFileSize(doc.fileSize)}
      </TableCell>

      {/* 업로더 */}
      <TableCell className="hidden px-6 py-4 md:table-cell">
        <div className="flex items-center gap-2">
          <Avatar className="size-6">
            <AvatarFallback className="text-[9px] font-medium">
              {doc.uploadedBy.name.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-bold text-slate-600">
            {doc.uploadedBy.name}
          </span>
        </div>
      </TableCell>

      {/* 업로드 날짜 */}
      <TableCell className="hidden px-6 py-4 text-sm font-medium text-slate-500 lg:table-cell">
        {formatDate(doc.uploadedAt)}
      </TableCell>

      {/* 최종 작업 날짜 */}
      <TableCell className="hidden px-6 py-4 text-sm font-medium text-slate-500 xl:table-cell">
        {formatDate(doc.updatedAt)}
      </TableCell>

      {/* 작업 */}
      <TableCell className="px-6 py-4">
        <StatusAction doc={doc} />
      </TableCell>
    </TableRow>
  );
}
