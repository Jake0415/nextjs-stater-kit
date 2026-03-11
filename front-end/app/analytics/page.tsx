"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Upload,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Calendar,
} from "lucide-react";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { ROUTES } from "@/lib/routes";
import {
  mockStatistics,
  mockMonthlyOcrData,
  mockActivityLogs,
  mockUserStats,
  formatDateTime,
} from "@/lib/mock";

// 활동 로그 아이콘/색상 매핑
const activityConfig: Record<
  string,
  { icon: string; bg: string; text: string }
> = {
  upload: { icon: "upload", bg: "bg-green-100", text: "text-green-600" },
  ocr: { icon: "sync", bg: "bg-blue-100", text: "text-blue-600" },
  delete: { icon: "error", bg: "bg-red-100", text: "text-red-600" },
  update: { icon: "check_circle", bg: "bg-green-100", text: "text-green-600" },
  login: { icon: "login", bg: "bg-blue-100", text: "text-blue-600" },
  export: { icon: "check_circle", bg: "bg-green-100", text: "text-green-600" },
};

// KPI 카드 데이터
const kpiCards = [
  {
    label: "전체 업로드 파일",
    value: mockStatistics.totalUploads.toLocaleString(),
    trend: mockStatistics.totalUploadsTrend,
    icon: Upload,
  },
  {
    label: "OCR 완료",
    value: mockStatistics.ocrCompleted.toLocaleString(),
    trend: mockStatistics.ocrCompletedTrend,
    icon: CheckCircle,
  },
  {
    label: "대기 중인 작업",
    value: mockStatistics.pendingTasks.toLocaleString(),
    trend: mockStatistics.pendingTasksTrend,
    icon: Clock,
  },
];

// 바 차트 최대값 계산
const maxCompleted = Math.max(...mockMonthlyOcrData.map((d) => d.completed));

// 월 이름 변환
function getMonthLabel(monthStr: string): string {
  const month = parseInt(monthStr.split("-")[1], 10);
  return `${month}월`;
}

// 현재 월 여부
function isCurrentMonth(monthStr: string): boolean {
  const now = new Date();
  const [y, m] = monthStr.split("-").map(Number);
  return now.getFullYear() === y && now.getMonth() + 1 === m;
}

// 상대 시간 포맷
function getRelativeTime(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  return `${days}일 전`;
}

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  // 날짜 표시
  const dateLabel = dateRange?.from
    ? dateRange.to
      ? `${format(dateRange.from, "yyyy.MM.dd")} ~ ${format(dateRange.to, "yyyy.MM.dd")}`
      : format(dateRange.from, "yyyy.MM.dd")
    : "기간 설정";

  // 성공률 계산
  const totalCompleted = mockMonthlyOcrData.reduce(
    (sum, d) => sum + d.completed,
    0
  );
  const totalFailed = mockMonthlyOcrData.reduce(
    (sum, d) => sum + d.failed,
    0
  );
  const successRate = (
    (totalCompleted / (totalCompleted + totalFailed)) *
    100
  ).toFixed(1);

  return (
    <div className="mx-auto max-w-[1280px] px-10 py-8">
      {/* 페이지 헤더 */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-[30px] font-black tracking-tight text-slate-900">
            통계 대시보드 개요
          </h1>
          <p className="text-base text-slate-500">
            문서 업로드 처리 현황과 OCR 추출 결과에 대한 통계 개요입니다.
          </p>
        </div>
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
      </div>

      {/* KPI 카드 3개 */}
      <div className="mb-8 grid grid-cols-3 gap-6">
        {kpiCards.map((kpi) => (
          <Card
            key={kpi.label}
            className="rounded-xl border-slate-200 shadow-sm"
          >
            <CardContent className="flex flex-col gap-6 p-6">
              <div className="flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-lg bg-blue-50">
                  <kpi.icon className="size-6 text-brand" />
                </div>
                <span
                  className={`rounded px-2 py-0.5 text-xs font-bold ${
                    kpi.trend >= 0
                      ? "bg-green-50 text-green-600"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {kpi.trend >= 0 ? "+" : ""}
                  {kpi.trend}%
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {kpi.label}
                </span>
                <span className="text-[30px] font-black text-slate-900">
                  {kpi.value}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 차트 + 최근 활동 */}
      <div className="mb-8 grid grid-cols-[2fr_1fr] gap-8">
        {/* OCR 추출 진행률 바 차트 */}
        <Card className="rounded-xl border-slate-200 shadow-sm">
          <CardContent className="p-8">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  OCR 추출 진행률
                </h2>
                <p className="text-sm text-slate-500">
                  최근 6개월간의 성과 내역
                </p>
              </div>
              <div className="text-right">
                <p className="text-[30px] font-black text-brand">
                  {successRate}%
                </p>
                <p className="text-sm font-medium text-green-600">
                  평균 대비 +0.5%
                </p>
              </div>
            </div>
            {/* 바 차트 */}
            <div className="flex items-end justify-center gap-4 border-b border-slate-100 pb-3 pt-10">
              {mockMonthlyOcrData.map((data) => {
                const height = Math.max(
                  (data.completed / maxCompleted) * 220,
                  20
                );
                const current = isCurrentMonth(data.month);
                return (
                  <div
                    key={data.month}
                    className="flex flex-col items-center gap-3"
                    style={{ width: "calc(100% / 6)" }}
                  >
                    <div
                      className={`w-12 rounded-lg ${
                        current ? "bg-brand" : "bg-brand/20"
                      }`}
                      style={{ height: `${height}px` }}
                    />
                    <span
                      className={`text-xs font-bold ${
                        current ? "text-slate-900" : "text-slate-500"
                      }`}
                    >
                      {getMonthLabel(data.month)}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* 최근 활동 */}
        <Card className="rounded-xl border-slate-200 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold">최근 활동</CardTitle>
              <Link
                href={ROUTES.SETTINGS_LOGS}
                className="text-sm font-bold text-brand hover:underline"
              >
                전체 보기
              </Link>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-6 px-6 pb-6">
            {mockActivityLogs.slice(0, 5).map((log) => {
              const config = activityConfig[log.type] ?? activityConfig.upload;
              return (
                <div key={log.id} className="flex items-start gap-4">
                  <div
                    className={`flex size-8 shrink-0 items-center justify-center rounded-full ${config.bg}`}
                  >
                    {log.type === "delete" ? (
                      <TrendingDown className={`size-4 ${config.text}`} />
                    ) : log.type === "ocr" ? (
                      <TrendingUp className={`size-4 ${config.text}`} />
                    ) : (
                      <CheckCircle className={`size-4 ${config.text}`} />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900 leading-[14px]">
                      {log.message.split(" ")[0]}
                    </span>
                    <span className="mt-1 text-[11px] text-slate-500">
                      {log.message.substring(log.message.indexOf(" ") + 1)} •{" "}
                      {getRelativeTime(log.timestamp)}
                    </span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* 사용자별 처리 통계 */}
      <Card className="rounded-xl border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold">사용자별 처리 통계</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-6">
            {mockUserStats.map((stat) => (
              <div
                key={stat.user.id}
                className="flex flex-col gap-4 rounded-lg border border-slate-100 bg-slate-50/30 p-5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-600">
                    {stat.user.name.charAt(0)}
                  </div>
                  <span className="text-sm font-bold text-slate-900">
                    {stat.user.name}
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      업로드 파일
                    </span>
                    <span className="text-[11px] font-bold text-slate-900">
                      {stat.documentsProcessed}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      OCR 추출
                    </span>
                    <span className="text-[11px] font-bold text-brand">
                      {Math.round(
                        stat.documentsProcessed * (stat.successRate / 100)
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
