"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Calendar, Download, Search, ChevronLeft, ChevronRight } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { ko } from "date-fns/locale";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { ROUTES } from "@/lib/routes";
import { mockActivityLogs, formatDateTime } from "@/lib/mock";

// 활동 유형 필터 옵션
const activityTypes = [
  { id: "all", label: "전체" },
  { id: "upload", label: "파일 업로드" },
  { id: "delete", label: "파일 삭제" },
  { id: "ocr", label: "OCR 추출" },
  { id: "update", label: "DB 초기화" },
  { id: "export", label: "템플릿 추가" },
  { id: "login", label: "템플릿 삭제" },
] as const;

// 배지 스타일 매핑
const badgeStyles: Record<string, { bg: string; border: string; text: string; label: string }> = {
  upload: { bg: "bg-green-100", border: "border-green-200", text: "text-green-700", label: "파일 업로드" },
  delete: { bg: "bg-rose-100", border: "border-rose-200", text: "text-rose-700", label: "파일 삭제" },
  ocr: { bg: "bg-blue-100", border: "border-blue-200", text: "text-blue-700", label: "OCR 추출" },
  update: { bg: "bg-amber-100", border: "border-amber-200", text: "text-amber-700", label: "DB 초기화" },
  export: { bg: "bg-indigo-100", border: "border-indigo-200", text: "text-indigo-700", label: "템플릿 추가" },
  login: { bg: "bg-slate-100", border: "border-slate-200", text: "text-slate-700", label: "템플릿 삭제" },
};

// 확장된 사용이력 mock (Figma 디자인에 맞추어)
const extendedLogs = [
  { id: "el1", userId: "admin_01", type: "ocr", timestamp: "2023-10-27T14:30:05Z" },
  { id: "el2", userId: "user_03", type: "upload", timestamp: "2023-10-27T14:15:22Z" },
  { id: "el3", userId: "admin_01", type: "export", timestamp: "2023-10-27T13:50:11Z" },
  { id: "el4", userId: "manager_v2", type: "delete", timestamp: "2023-10-27T13:45:00Z" },
  { id: "el5", userId: "user_03", type: "ocr", timestamp: "2023-10-27T13:20:15Z" },
  { id: "el6", userId: "admin_02", type: "update", timestamp: "2023-10-27T13:10:45Z" },
  { id: "el7", userId: "manager_v2", type: "login", timestamp: "2023-10-27T12:55:30Z" },
  { id: "el8", userId: "user_05", type: "upload", timestamp: "2023-10-27T12:40:12Z" },
  { id: "el9", userId: "admin_01", type: "ocr", timestamp: "2023-10-27T12:30:00Z" },
  { id: "el10", userId: "manager_v2", type: "export", timestamp: "2023-10-27T12:15:55Z" },
];

const PAGE_SIZE = 10;

export default function SettingsLogsPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  // 필터링
  const filteredLogs = useMemo(() => {
    let logs = [...extendedLogs];

    if (activeFilter !== "all") {
      logs = logs.filter((log) => log.type === activeFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      logs = logs.filter((log) => log.userId.toLowerCase().includes(q));
    }

    return logs;
  }, [activeFilter, searchQuery]);

  const totalPages = Math.ceil(filteredLogs.length / PAGE_SIZE);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // 날짜 표시
  const dateLabel = dateRange?.from
    ? dateRange.to
      ? `${format(dateRange.from, "yyyy.MM.dd")} ~ ${format(dateRange.to, "yyyy.MM.dd")}`
      : format(dateRange.from, "yyyy.MM.dd")
    : "기간 설정";

  // CSV 내보내기
  const handleExportCSV = () => {
    const header = "사용자 ID,활동 이력,일시\n";
    const rows = filteredLogs
      .map((log) => {
        const badge = badgeStyles[log.type];
        return `${log.userId},${badge?.label ?? log.type},${new Date(log.timestamp).toISOString()}`;
      })
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "system_logs.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // 타임스탬프 포맷 (YYYY-MM-DD HH:mm:ss)
  function formatTimestamp(ts: string): string {
    const d = new Date(ts);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }

  return (
    <div className="mx-auto max-w-[1280px] px-10 py-12">
      {/* 페이지 헤더 */}
      <div className="mb-10 flex items-end justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-[36px] font-black tracking-tight text-slate-900">
            시스템 사용이력 상세 조회
          </h1>
          <p className="text-base text-gray-500">
            시스템 내 모든 사용자 활동 로그를 실시간으로 모니터링하고 추적합니다.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* 기간 설정 */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2 shadow-sm">
                <Calendar className="size-[18px]" />
                {dateLabel}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarUI
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                locale={ko}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          {/* CSV 내보내기 */}
          <Button
            className="gap-2 bg-brand shadow-md hover:bg-brand/90"
            onClick={handleExportCSV}
          >
            <Download className="size-[18px]" />
            CSV 내보내기
          </Button>
        </div>
      </div>

      {/* 필터 바 */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-6">
          <span className="shrink-0 text-xs font-bold uppercase tracking-widest text-gray-400">
            활동 유형 필터
          </span>
          <div className="flex flex-1 flex-wrap items-center gap-2">
            {activityTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => {
                  setActiveFilter(type.id);
                  setCurrentPage(1);
                }}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  activeFilter === type.id
                    ? "border-brand bg-brand text-white"
                    : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
          {/* 사용자 검색 */}
          <div className="relative w-[192px] shrink-0">
            <Search className="absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="사용자 아이디 검색"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="h-9 bg-gray-50 pl-10 text-sm"
            />
          </div>
        </div>
      </div>

      {/* 로그 테이블 */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-widest text-gray-500">
                사용자 ID
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-widest text-gray-500">
                활동 이력
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-widest text-gray-500">
                일시 (YYYY-MM-DD HH:mm:ss)
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedLogs.map((log, idx) => {
              const badge = badgeStyles[log.type] ?? badgeStyles.upload;
              return (
                <tr
                  key={log.id}
                  className={idx > 0 ? "border-t border-gray-100" : ""}
                >
                  <td className="px-6 py-5 text-center text-sm font-medium text-gray-900">
                    {log.userId}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-block rounded-full border px-3.5 py-1.5 text-xs font-bold ${badge.bg} ${badge.border} ${badge.text}`}
                    >
                      {badge.label}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center font-mono text-sm text-gray-500">
                    {formatTimestamp(log.timestamp)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* 페이지네이션 */}
        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/50 px-6 py-5">
          <span className="text-sm text-gray-500">
            {filteredLogs.length.toLocaleString()}개 중{" "}
            <span className="font-bold text-gray-900">
              {(currentPage - 1) * PAGE_SIZE + 1}-
              {Math.min(currentPage * PAGE_SIZE, filteredLogs.length)}
            </span>{" "}
            표시 중
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex size-9 items-center justify-center rounded border border-gray-200 bg-white text-gray-400 disabled:opacity-50"
            >
              <ChevronLeft className="size-[18px]" />
            </button>
            {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`flex size-9 items-center justify-center rounded text-sm font-medium ${
                    currentPage === page
                      ? "bg-brand text-white shadow-sm"
                      : "border border-gray-200 bg-white text-gray-600"
                  }`}
                >
                  {page}
                </button>
              )
            )}
            {totalPages > 3 && (
              <>
                <span className="px-1 text-gray-400">...</span>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className={`flex size-9 items-center justify-center rounded text-sm font-medium ${
                    currentPage === totalPages
                      ? "bg-brand text-white shadow-sm"
                      : "border border-gray-200 bg-white text-gray-600"
                  }`}
                >
                  {totalPages}
                </button>
              </>
            )}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="flex size-9 items-center justify-center rounded border border-gray-200 bg-white text-gray-400 disabled:opacity-50"
            >
              <ChevronRight className="size-[18px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
