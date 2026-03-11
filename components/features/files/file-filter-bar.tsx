"use client";

import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Search, Calendar, X, Check, Square } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { DocumentStatus } from "@/lib/types";

// Figma 디자인 기반 필터 그룹
const filterGroup1: { value: string; label: string }[] = [
  { value: "all", label: "전체 파일" },
  { value: "uploaded", label: "내 파일" },
];

const filterGroup2: { value: string; label: string }[] = [
  { value: "ocr_processing", label: "OCR 추출" },
  { value: "ocr_completed", label: "완료됨" },
  { value: "ocr_failed", label: "작업중" },
];

interface FileFilterBarProps {
  activeTab: DocumentStatus | "all";
  onTabChange: (tab: DocumentStatus | "all") => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
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

export function FileFilterBar({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  dateRange,
  onDateRangeChange,
}: FileFilterBarProps) {
  const dateRangeLabel = dateRange?.from
    ? dateRange.to
      ? `${format(dateRange.from, "MM.dd", { locale: ko })} ~ ${format(dateRange.to, "MM.dd", { locale: ko })}`
      : format(dateRange.from, "MM.dd", { locale: ko })
    : "기간 설정";

  return (
    <div className="flex items-center gap-6">
      {/* 검색 */}
      <div className="relative w-[256px] shrink-0">
        <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="파일명 또는 작업자 검색"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
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
            isActive={activeTab === tab.value}
            onClick={() => onTabChange(tab.value as DocumentStatus | "all")}
          />
        ))}
      </div>

      {/* 필터 그룹 2 */}
      <div className="flex items-center gap-2">
        {filterGroup2.map((tab) => (
          <FilterPill
            key={tab.value}
            label={tab.label}
            isActive={activeTab === tab.value}
            onClick={() => onTabChange(tab.value as DocumentStatus | "all")}
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
                  onDateRangeChange(undefined);
                }}
              />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <CalendarComponent
            mode="range"
            selected={dateRange}
            onSelect={onDateRangeChange}
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
                onClick={() => onDateRangeChange(undefined)}
              >
                초기화
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
