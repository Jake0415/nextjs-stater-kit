"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Upload, RefreshCw } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import { FileFilterBar } from "@/components/features/files/file-filter-bar";
import { FileTable } from "@/components/features/files/file-table";
import { FilePagination } from "@/components/features/files/file-pagination";
import { DeleteConfirmDialog } from "@/components/features/files/delete-confirm-dialog";
import { mockDocuments } from "@/lib/mock";
import type { Document, DocumentStatus } from "@/lib/types";

const PAGE_SIZE = 10;

export default function FilesPage() {
  // 필터 상태
  const [activeTab, setActiveTab] = useState<DocumentStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  // Dialog 상태
  const [deleteDoc, setDeleteDoc] = useState<Document | null>(null);

  // 문서 필터링
  const filteredDocuments = useMemo(() => {
    let docs = [...mockDocuments];

    // 탭 필터
    if (activeTab !== "all") {
      docs = docs.filter((doc) => doc.status === activeTab);
    }

    // 검색 필터 (파일명 + 업로더명)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      docs = docs.filter(
        (doc) =>
          doc.filename.toLowerCase().includes(q) ||
          doc.uploadedBy.name.toLowerCase().includes(q)
      );
    }

    // 기간 필터 (uploadedAt 기준)
    if (dateRange?.from) {
      const from = dateRange.from;
      const to = dateRange.to ?? dateRange.from;
      docs = docs.filter((doc) => {
        const d = new Date(doc.uploadedAt);
        return d >= from && d <= new Date(to.getTime() + 86400000 - 1);
      });
    }

    return docs;
  }, [activeTab, searchQuery, dateRange]);

  // 페이지네이션
  const totalPages = Math.ceil(filteredDocuments.length / PAGE_SIZE);
  const paginatedDocuments = filteredDocuments.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // 탭 변경 시 페이지 초기화
  const handleTabChange = (tab: DocumentStatus | "all") => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // 검색 변경 시 페이지 초기화
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // 날짜 범위 변경 시 페이지 초기화
  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    setCurrentPage(1);
  };

  // 액션 핸들러
  const handleDelete = (doc: Document) => {
    setDeleteDoc(doc);
  };


  return (
    <div className="mx-auto max-w-[1280px] px-10 py-10">
      {/* 페이지 헤더 */}
      <div className="mb-8 flex items-end justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            파일 관리
          </h1>
          <p className="text-sm text-slate-500">
            문서 관리에서 OCR 텍스트 추출부터 메타정보 편집까지 한 번에
            처리합니다.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            asChild
            size="default"
            className="gap-2 bg-brand shadow-sm hover:bg-brand/90"
          >
            <Link href={ROUTES.FILE_VERSION_UPDATE}>
              <RefreshCw className="size-[18px]" />
              버전 업데이트
            </Link>
          </Button>
          <Button
            asChild
            size="default"
            className="gap-2 bg-brand shadow-sm hover:bg-brand/90"
          >
            <Link href={ROUTES.FILE_UPLOAD}>
              <Upload className="size-[18px]" />
              새 업로드
            </Link>
          </Button>
        </div>
      </div>

      {/* 통합 카드: 필터 + 테이블 + 페이지네이션 */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* 필터 바 */}
        <div className="border-b border-slate-50 px-5 py-5">
          <FileFilterBar
            activeTab={activeTab}
            onTabChange={handleTabChange}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
          />
        </div>

        {/* 문서 테이블 */}
        <FileTable
          documents={paginatedDocuments}
          onDelete={handleDelete}
        />

        {/* 페이지네이션 */}
        <div className="border-t border-slate-100 px-6 py-4">
          <FilePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredDocuments.length}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* 삭제 확인 Dialog */}
      <DeleteConfirmDialog
        document={deleteDoc}
        open={!!deleteDoc}
        onOpenChange={(open) => !open && setDeleteDoc(null)}
      />
    </div>
  );
}
