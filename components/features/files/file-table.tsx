"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileTableRow } from "./file-table-row";
import type { Document } from "@/lib/types";

interface FileTableProps {
  documents: Document[];
  onDelete: (doc: Document) => void;
}

export function FileTable({
  documents,
  onDelete,
}: FileTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-b-slate-100 bg-slate-50/50 hover:bg-slate-50/50">
          <TableHead className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            파일명
          </TableHead>
          <TableHead className="hidden px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400 md:table-cell">
            버전
          </TableHead>
          <TableHead className="hidden px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400 lg:table-cell">
            크기
          </TableHead>
          <TableHead className="hidden px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400 md:table-cell">
            업로더
          </TableHead>
          <TableHead className="hidden px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400 lg:table-cell">
            업로드 날짜
          </TableHead>
          <TableHead className="hidden px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400 xl:table-cell">
            최종 작업 날짜
          </TableHead>
          <TableHead className="px-6 py-4 text-center text-[11px] font-bold uppercase tracking-wider text-slate-400">
            작업
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents.length === 0 ? (
          <TableRow>
            <td
              colSpan={7}
              className="py-12 text-center text-muted-foreground"
            >
              표시할 문서가 없습니다.
            </td>
          </TableRow>
        ) : (
          documents.map((doc) => (
            <FileTableRow
              key={doc.id}
              document={doc}
              onDelete={onDelete}
            />
          ))
        )}
      </TableBody>
    </Table>
  );
}
