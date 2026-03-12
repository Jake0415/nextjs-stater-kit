"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import {
  AlertTriangle,
  Search,
  Calendar,
  X,
  Check,
  Square,
  Trash2,
} from "lucide-react";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FilePagination } from "@/components/features/files/file-pagination";
import { cn } from "@/lib/utils";
import { mockDocuments, statusLabels, formatDateTime } from "@/lib/mock";
import type { DocumentStatus, Document } from "@/lib/types";

// 필터 탭 정의
type FilterTab = "all" | "mine" | "uploaded" | "ocr_completed" | "ocr_processing";

const filterGroup1: { value: FilterTab; label: string }[] = [
  { value: "all", label: "전체 파일" },
  { value: "mine", label: "내 파일" },
];

const filterGroup2: { value: FilterTab; label: string }[] = [
  { value: "uploaded", label: "미추출" },
  { value: "ocr_completed", label: "완료됨" },
  { value: "ocr_processing", label: "처리중" },
];

// 상태별 배지 스타일
function StatusBadge({ status }: { status: DocumentStatus }) {
  const variants: Record<string, string> = {
    uploaded: "bg-slate-100 text-slate-600",
    ocr_processing: "bg-blue-50 text-blue-600",
    ocr_completed: "bg-green-50 text-green-600",
    ocr_failed: "bg-red-50 text-red-600",
    draft: "bg-yellow-50 text-yellow-600",
  };

  return (
    <Badge
      variant="outline"
      className={cn("border-0 font-medium", variants[status] || "bg-slate-100 text-slate-600")}
    >
      {statusLabels[status] || status}
    </Badge>
  );
}

// 필터 필 버튼
function FilterPill({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition-colors",
        isActive
          ? "border-brand bg-blue-50 text-brand"
          : "border-gray-300 bg-white text-slate-500 hover:bg-gray-50"
      )}
    >
      {isActive ? (
        <Check className="size-4" strokeWidth={2.5} />
      ) : (
        <Square className="size-4 rounded-sm border border-gray-300 text-transparent" />
      )}
      {label}
    </button>
  );
}

const PAGE_SIZE = 10;

export default function DataDeletionPage() {
  // 필터 상태
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [currentPage, setCurrentPage] = useState(1);

  // 다이얼로그 상태
  const [initDialogOpen, setInitDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [targetDoc, setTargetDoc] = useState<Document | null>(null);
  const [adminPassword, setAdminPassword] = useState("");
  const [deletePassword, setDeletePassword] = useState("");

  // 필터링된 문서
  const filteredDocuments = useMemo(() => {
    let docs = [...mockDocuments];

    // 필터 탭
    if (activeFilter === "mine") {
      docs = docs.filter((d) => d.uploadedBy.id === "u1");
    } else if (activeFilter === "uploaded") {
      docs = docs.filter((d) => d.status === "uploaded" || d.status === "draft");
    } else if (activeFilter === "ocr_completed") {
      docs = docs.filter((d) => d.status === "ocr_completed");
    } else if (activeFilter === "ocr_processing") {
      docs = docs.filter((d) => d.status === "ocr_processing");
    }

    // 검색
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      docs = docs.filter(
        (d) =>
          d.filename.toLowerCase().includes(q) ||
          d.uploadedBy.name.toLowerCase().includes(q)
      );
    }

    // 기간
    if (dateRange?.from) {
      docs = docs.filter((d) => {
        const date = new Date(d.uploadedAt);
        if (dateRange.from && date < dateRange.from) return false;
        if (dateRange.to && date > new Date(dateRange.to.getTime() + 86400000))
          return false;
        return true;
      });
    }

    return docs;
  }, [activeFilter, searchQuery, dateRange]);

  // 페이지네이션
  const totalPages = Math.ceil(filteredDocuments.length / PAGE_SIZE);
  const paginatedDocs = filteredDocuments.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // 기간 설정 라벨
  const dateRangeLabel = dateRange?.from
    ? dateRange.to
      ? `${format(dateRange.from, "MM.dd", { locale: ko })} ~ ${format(dateRange.to, "MM.dd", { locale: ko })}`
      : format(dateRange.from, "MM.dd", { locale: ko })
    : "기간 설정";

  // 개별 삭제 핸들러
  const handleDeleteClick = (doc: Document) => {
    setTargetDoc(doc);
    setDeletePassword("");
    setDeleteDialogOpen(true);
  };

  // 데이터 초기화 핸들러
  const handleInitialize = () => {
    setAdminPassword("");
    setInitDialogOpen(true);
  };

  // 초기화 실행
  const handleConfirmInitialize = () => {
    // TODO: API 호출 — 전체 데이터 초기화
    setInitDialogOpen(false);
    setAdminPassword("");
  };

  // 삭제 실행
  const handleConfirmDelete = () => {
    // TODO: API 호출 — 개별 파일 삭제
    setDeleteDialogOpen(false);
    setDeletePassword("");
    setTargetDoc(null);
  };

  return (
    <div className="mx-auto max-w-[1280px] px-10 py-10">
      {/* 페이지 헤더 */}
      <div className="mb-8 flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-[36px] font-black tracking-tight text-slate-900">
            데이터 삭제 및 초기화 관리
          </h1>
          <p className="text-base text-slate-500">
            업로드된 파일과 추출 데이터를 관리하고 삭제합니다.
          </p>
        </div>
        <Button
          variant="destructive"
          className="gap-2 px-6"
          onClick={handleInitialize}
        >
          <Trash2 className="size-5" />
          데이터 초기화
        </Button>
      </div>

      {/* 경고 배너 */}
      <div className="mb-6 flex gap-4 rounded-lg border border-red-200 bg-red-50 p-4">
        <AlertTriangle className="size-6 shrink-0 text-red-500" />
        <div>
          <p className="text-sm font-bold text-red-800">심각한 경고</p>
          <p className="text-sm text-red-600">
            데이터 삭제 시 해당 파일과 관련된 모든 추출 데이터가 영구적으로
            삭제되며 복구할 수 없습니다. 신중하게 진행해 주세요.
          </p>
        </div>
      </div>

      {/* 필터 바 */}
      <div className="mb-6 flex items-center gap-6">
        {/* 검색 */}
        <div className="relative w-[256px] shrink-0">
          <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="파일명 또는 작업자 검색"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="h-11 rounded-lg pl-10 text-sm"
          />
        </div>

        <Separator orientation="vertical" className="h-8 bg-gray-200" />

        {/* 필터 그룹 1 */}
        <div className="flex items-center gap-2">
          {filterGroup1.map((tab) => (
            <FilterPill
              key={tab.value}
              label={tab.label}
              isActive={activeFilter === tab.value}
              onClick={() => {
                setActiveFilter(tab.value);
                setCurrentPage(1);
              }}
            />
          ))}
        </div>

        {/* 필터 그룹 2 */}
        <div className="flex items-center gap-2">
          {filterGroup2.map((tab) => (
            <FilterPill
              key={tab.value}
              label={tab.label}
              isActive={activeFilter === tab.value}
              onClick={() => {
                setActiveFilter(tab.value);
                setCurrentPage(1);
              }}
            />
          ))}
        </div>

        <Separator orientation="vertical" className="h-8 bg-gray-200" />

        {/* 기간 설정 */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "h-11 gap-2 rounded-lg border-gray-200 px-6 text-sm font-bold shadow-sm",
                dateRange?.from
                  ? "border-brand bg-blue-50 text-brand"
                  : "text-gray-700"
              )}
            >
              <Calendar className="size-[18px]" />
              {dateRangeLabel}
              {dateRange?.from && (
                <X
                  className="ml-1 size-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDateRange(undefined);
                  }}
                />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <CalendarComponent
              mode="range"
              selected={dateRange}
              onSelect={(range) => {
                setDateRange(range);
                setCurrentPage(1);
              }}
              locale={ko}
              numberOfMonths={2}
              initialFocus
            />
            {dateRange?.from && (
              <div className="border-t p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => setDateRange(undefined)}
                >
                  초기화
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>

      {/* 파일 테이블 */}
      <div className="overflow-hidden rounded-xl border border-slate-200">
        <Table>
          <TableHeader>
            <TableRow className="border-b-slate-100 bg-slate-50/50 hover:bg-slate-50/50">
              <TableHead className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                파일명
              </TableHead>
              <TableHead className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                업로더
              </TableHead>
              <TableHead className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                업로드 일시
              </TableHead>
              <TableHead className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                OCR 작업자
              </TableHead>
              <TableHead className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                작업 일시
              </TableHead>
              <TableHead className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                상태
              </TableHead>
              <TableHead className="px-6 py-4 text-center text-[11px] font-bold uppercase tracking-wider text-slate-400">
                작업
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedDocs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-12 text-center text-muted-foreground"
                >
                  표시할 문서가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              paginatedDocs.map((doc) => (
                <TableRow
                  key={doc.id}
                  className="border-b-slate-100 hover:bg-slate-50/30"
                >
                  <TableCell className="px-6 py-4">
                    <span className="text-sm font-medium text-slate-900">
                      {doc.filename}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-slate-600">
                    {doc.uploadedBy.name}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-slate-500">
                    {formatDateTime(doc.uploadedAt)}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-slate-600">
                    {doc.status === "ocr_completed" || doc.status === "ocr_failed"
                      ? doc.uploadedBy.name
                      : "-"}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-slate-500">
                    {doc.updatedAt !== doc.uploadedAt
                      ? formatDateTime(doc.updatedAt)
                      : "-"}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <StatusBadge status={doc.status} />
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:bg-red-50 hover:text-red-600"
                      onClick={() => handleDeleteClick(doc)}
                    >
                      <Trash2 className="size-4" />
                      <span className="ml-1">삭제</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 페이지네이션 */}
      <div className="mt-6">
        <FilePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredDocuments.length}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* === 데이터 초기화 확인 다이얼로그 (Figma 1:4950) === */}
      <Dialog open={initDialogOpen} onOpenChange={setInitDialogOpen}>
        <DialogContent className="max-w-[480px]">
          <DialogHeader className="items-center text-center">
            <div className="mb-2 flex size-14 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="size-7 text-red-500" />
            </div>
            <DialogTitle className="text-xl font-bold">
              데이터 초기화 확인
            </DialogTitle>
            <DialogDescription className="text-center text-sm font-medium text-red-500">
              데이터 초기화 시 모든 데이터가 영구적으로 삭제되며 복구할 수
              없습니다.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 py-4">
            <Label className="text-sm font-bold text-slate-700">
              관리자 권한 확인
            </Label>
            <Input
              type="password"
              placeholder="관리자 비밀번호를 입력하세요"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
            />
          </div>
          <DialogFooter className="-mx-6 -mb-6 border-t border-slate-200 bg-slate-50 px-6 py-4">
            <Button
              variant="ghost"
              onClick={() => setInitDialogOpen(false)}
            >
              취소
            </Button>
            <Button
              variant="destructive"
              disabled={!adminPassword.trim()}
              onClick={handleConfirmInitialize}
            >
              초기화 실행
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* === 파일 삭제 확인 다이얼로그 (Figma 1:6936) === */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-[480px]">
          <DialogHeader className="items-center text-center">
            <div className="mb-2 flex size-14 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="size-7 text-red-500" />
            </div>
            <DialogTitle className="text-xl font-bold">
              파일 삭제 확인
            </DialogTitle>
            <DialogDescription className="text-center text-sm font-medium text-red-500">
              파일 삭제 시 해당 데이터가 영구적으로 삭제되며 복구할 수
              없습니다.
            </DialogDescription>
          </DialogHeader>
          {targetDoc && (
            <div className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600">
              <span className="font-medium text-slate-900">
                {targetDoc.filename}
              </span>
            </div>
          )}
          <div className="flex flex-col gap-2 py-2">
            <Label className="text-sm font-bold text-slate-700">
              삭제 권한 확인
            </Label>
            <Input
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
            />
          </div>
          <DialogFooter className="-mx-6 -mb-6 border-t border-slate-200 bg-slate-50 px-6 py-4">
            <Button
              variant="ghost"
              onClick={() => setDeleteDialogOpen(false)}
            >
              취소
            </Button>
            <Button
              variant="destructive"
              disabled={!deletePassword.trim()}
              onClick={handleConfirmDelete}
            >
              삭제 실행
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
