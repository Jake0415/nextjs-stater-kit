"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { ko } from "date-fns/locale";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/lib/routes";
import { mockMonthlyOcrData } from "@/lib/mock";

// 에러 유형 분포 mock
const errorDistribution = [
  { type: "지원하지 않는 형식", count: 8, color: "bg-red-400" },
  { type: "이미지 품질 저하", count: 5, color: "bg-orange-400" },
  { type: "타임아웃", count: 3, color: "bg-yellow-400" },
  { type: "메모리 초과", count: 2, color: "bg-purple-400" },
];

// 문서 유형별 처리 건수 mock
const documentTypes = [
  { type: "PDF", count: 156, color: "bg-brand" },
  { type: "스캔 이미지", count: 42, color: "bg-blue-300" },
  { type: "계약서", count: 28, color: "bg-blue-200" },
  { type: "기술 문서", count: 21, color: "bg-blue-100" },
];

export default function AnalyticsDetailPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [groupBy, setGroupBy] = useState("monthly");
  const [loading, setLoading] = useState(false);

  // 타임라인 데이터
  const timelineData = useMemo(() => {
    return mockMonthlyOcrData.map((d) => ({
      label: `${parseInt(d.month.split("-")[1], 10)}월`,
      completed: d.completed,
      failed: d.failed,
      total: d.completed + d.failed,
    }));
  }, []);

  const maxTotal = Math.max(...timelineData.map((d) => d.total));
  const maxError = Math.max(...errorDistribution.map((d) => d.count));
  const maxDocType = Math.max(...documentTypes.map((d) => d.count));

  // 날짜 표시 텍스트
  const dateLabel = dateRange?.from
    ? dateRange.to
      ? `${format(dateRange.from, "yyyy.MM.dd")} ~ ${format(dateRange.to, "yyyy.MM.dd")}`
      : format(dateRange.from, "yyyy.MM.dd")
    : "기간 설정";

  return (
    <div className="mx-auto max-w-[1280px] px-10 py-10">
      {/* 페이지 헤더 */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-[36px] font-black tracking-tight text-slate-900">
            통계 상세 분석
          </h1>
          <p className="text-base text-slate-500">
            문서 업로드 처리 현황과 OCR 추출 결과에 대한 통계 개요입니다.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* 기간 설정 */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
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

          {/* 그룹 기준 */}
          <Select value={groupBy} onValueChange={setGroupBy}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">일별</SelectItem>
              <SelectItem value="weekly">주별</SelectItem>
              <SelectItem value="monthly">월별</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 개요로 돌아가기 */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" className="gap-1 text-slate-500" asChild>
          <Link href={ROUTES.ANALYTICS}>
            <ArrowLeft className="size-4" />
            개요로 돌아가기
          </Link>
        </Button>
      </div>

      {loading ? (
        /* 스켈레톤 로딩 */
        <div className="space-y-6">
          <Skeleton className="h-[400px] w-full rounded-xl" />
          <div className="grid grid-cols-2 gap-6">
            <Skeleton className="h-[300px] rounded-xl" />
            <Skeleton className="h-[300px] rounded-xl" />
          </div>
        </div>
      ) : (
        <>
          {/* 타임라인 차트 */}
          <Card className="mb-8 rounded-xl border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold">
                업로드 / OCR 처리 추이
              </CardTitle>
              <p className="text-sm text-slate-500">
                최근 6개월간 업로드 및 OCR 완료/실패 현황
              </p>
            </CardHeader>
            <CardContent>
              {/* 범례 */}
              <div className="mb-6 flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-sm bg-brand" />
                  <span className="text-xs text-slate-600">OCR 완료</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-sm bg-red-400" />
                  <span className="text-xs text-slate-600">OCR 실패</span>
                </div>
              </div>

              {/* 차트 영역 */}
              <div className="flex items-end justify-around gap-4 border-b border-slate-100 pb-4 pt-6">
                {timelineData.map((data) => {
                  const completedH = (data.completed / maxTotal) * 240;
                  const failedH = (data.failed / maxTotal) * 240;
                  return (
                    <div
                      key={data.label}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className="flex items-end gap-1">
                        <div
                          className="w-8 rounded-t-md bg-brand"
                          style={{ height: `${completedH}px` }}
                        />
                        <div
                          className="w-8 rounded-t-md bg-red-400"
                          style={{ height: `${Math.max(failedH, 4)}px` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-500">
                        {data.label}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {data.completed}/{data.failed}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* 하단 2열 */}
          <div className="grid grid-cols-2 gap-6">
            {/* 문서 유형별 처리 건수 */}
            <Card className="rounded-xl border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold">
                  문서 유형별 처리 건수
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {documentTypes.map((doc) => (
                  <div key={doc.type} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-700">
                        {doc.type}
                      </span>
                      <span className="text-sm font-bold text-slate-900">
                        {doc.count}건
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100">
                      <div
                        className={`h-2 rounded-full ${doc.color}`}
                        style={{
                          width: `${(doc.count / maxDocType) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 에러 유형별 분포 */}
            <Card className="rounded-xl border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold">
                  에러 유형별 분포
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {errorDistribution.map((err) => (
                  <div key={err.type} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-700">
                        {err.type}
                      </span>
                      <span className="text-sm font-bold text-slate-900">
                        {err.count}건
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100">
                      <div
                        className={`h-2 rounded-full ${err.color}`}
                        style={{
                          width: `${(err.count / maxError) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
