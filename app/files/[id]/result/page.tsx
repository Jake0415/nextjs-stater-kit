"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Search,
  ImageIcon,
  FileText,
  Download,
  MoreVertical,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/lib/routes";
import { mockDocuments, mockSections, mockSectionImages } from "@/lib/mock";
import type { Section, SectionImage } from "@/lib/types";

// 키워드 색상 매핑
const keywordColors: Record<string, { bg: string; text: string }> = {
  REVENUE: { bg: "bg-blue-100", text: "text-blue-700" },
  "AI ARCHITECTURE": { bg: "bg-purple-100", text: "text-purple-700" },
  SCALABILITY: { bg: "bg-green-100", text: "text-green-700" },
  OCR: { bg: "bg-blue-100", text: "text-blue-700" },
  ACCURACY: { bg: "bg-purple-100", text: "text-purple-700" },
  CLOUD: { bg: "bg-green-100", text: "text-green-700" },
  NEURAL: { bg: "bg-blue-100", text: "text-blue-700" },
  LAYOUT: { bg: "bg-purple-100", text: "text-purple-700" },
  IMAGE: { bg: "bg-blue-100", text: "text-blue-700" },
  CORRELATION: { bg: "bg-green-100", text: "text-green-700" },
  OPERATIONS: { bg: "bg-purple-100", text: "text-purple-700" },
  EFFICIENCY: { bg: "bg-green-100", text: "text-green-700" },
  CHART: { bg: "bg-purple-100", text: "text-purple-700" },
  TRENDS: { bg: "bg-green-100", text: "text-green-700" },
  LOGO: { bg: "bg-blue-100", text: "text-blue-700" },
  BRANDING: { bg: "bg-purple-100", text: "text-purple-700" },
  ARCHITECTURE: { bg: "bg-blue-100", text: "text-blue-700" },
  KPI: { bg: "bg-green-100", text: "text-green-700" },
  TABLE: { bg: "bg-purple-100", text: "text-purple-700" },
  DATACENTER: { bg: "bg-blue-100", text: "text-blue-700" },
  PHOTO: { bg: "bg-green-100", text: "text-green-700" },
  MARKET: { bg: "bg-blue-100", text: "text-blue-700" },
  "PIE CHART": { bg: "bg-purple-100", text: "text-purple-700" },
};

function getKeywordColor(keyword: string) {
  return keywordColors[keyword] ?? { bg: "bg-slate-100", text: "text-slate-600" };
}

export default function OcrResultPage() {
  const params = useParams();
  const docId = params.id as string;
  const doc = mockDocuments.find((d) => d.id === docId);

  // 문서의 섹션과 이미지
  const sections = mockSections.filter((s) => s.documentId === docId);
  const images = mockSectionImages;

  // 상태
  const [viewMode, setViewMode] = useState<"text" | "image">("text");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    sections[0]?.id ?? null
  );
  const [selectedImageId, setSelectedImageId] = useState<string | null>(
    images[0]?.id ?? null
  );

  // 검색 필터
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;
    const q = searchQuery.toLowerCase();
    return sections.filter(
      (s) =>
        s.content.toLowerCase().includes(q) ||
        s.sectionLabel.toLowerCase().includes(q) ||
        s.title.toLowerCase().includes(q)
    );
  }, [sections, searchQuery]);

  const filteredImages = useMemo(() => {
    if (!searchQuery.trim()) return images;
    const q = searchQuery.toLowerCase();
    return images.filter(
      (img) =>
        img.filename.toLowerCase().includes(q) ||
        img.description.toLowerCase().includes(q)
    );
  }, [images, searchQuery]);

  const selectedSection =
    sections.find((s) => s.id === selectedSectionId) ?? null;
  const selectedImage: SectionImage | null =
    images.find((img) => img.id === selectedImageId) ?? null;

  // 연결된 이미지 (선택된 섹션)
  const connectedImage = selectedSection
    ? images.find((img) => img.sectionId === selectedSection.id)
    : null;

  // 문서 미존재
  if (!doc) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">문서를 찾을 수 없습니다</h1>
        <p className="mt-2 text-muted-foreground">
          요청한 문서가 존재하지 않거나 삭제되었습니다.
        </p>
        <Button asChild className="mt-6" variant="outline">
          <Link href={ROUTES.FILES}>
            <ArrowLeft className="mr-2 size-4" />
            파일 관리로 돌아가기
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col">
      {/* 메인 레이아웃: 좌측 콘텐츠 + 우측 사이드바 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 좌측: 헤더 + 테이블/그리드 + 페이지네이션 */}
        <div className="flex flex-1 flex-col border-r border-slate-200 bg-white">
          {/* 상단 헤더 바 */}
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <h1 className="text-lg font-bold text-slate-900 md:text-2xl">
              추출된 데이터
            </h1>
            <div className="flex items-center gap-2">
              {/* 검색 */}
              <div className="relative">
                <Input
                  placeholder="추출 데이터 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 w-[200px] border-slate-300 bg-slate-50/50 pr-9 text-xs font-bold text-slate-500 md:w-[256px] md:text-sm"
                />
                <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              </div>

              {/* 뷰 토글: 이미지 / 텍스트 */}
              <button
                type="button"
                onClick={() => setViewMode("image")}
                className={`flex size-10 items-center justify-center rounded-lg border ${
                  viewMode === "image"
                    ? "border-brand/20 bg-brand/10 text-brand"
                    : "border-slate-200 bg-white text-slate-400"
                }`}
              >
                <ImageIcon className="size-[18px]" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("text")}
                className={`flex size-10 items-center justify-center rounded-lg border ${
                  viewMode === "text"
                    ? "border-brand/20 bg-brand/10 text-brand"
                    : "border-slate-200 bg-white text-slate-400"
                }`}
              >
                <FileText className="size-[18px]" />
              </button>

              {/* 내보내기 */}
              <Button className="gap-2 bg-brand text-xs font-bold hover:bg-brand/90 md:text-sm">
                <Download className="size-3.5" />
                {viewMode === "image" ? "이미지 내보내기" : "CSV 내보내기"}
              </Button>
            </div>
          </div>

          {/* 콘텐츠 영역 */}
          <div className="flex-1 overflow-auto">
            {viewMode === "text" ? (
              /* ━━━ 텍스트 뷰 (Figma 1:8337) ━━━ */
              <div className="flex flex-col">
                {/* 테이블 헤더 */}
                <div className="sticky top-0 z-10 flex items-center border-b border-slate-200 bg-slate-50/95 backdrop-blur-sm">
                  <div className="w-[120px] shrink-0 px-6 py-4">
                    <span className="text-[11px] font-bold uppercase tracking-[0.55px] text-slate-400">
                      섹션 ID
                    </span>
                  </div>
                  <div className="flex-1 px-6 py-4">
                    <span className="text-[11px] font-bold uppercase tracking-[0.55px] text-slate-400">
                      추출된 텍스트
                    </span>
                  </div>
                  <div className="w-[100px] shrink-0 px-6 py-4 text-right">
                    <span className="text-[11px] font-bold uppercase tracking-[0.55px] text-slate-400">
                      페이지
                    </span>
                  </div>
                </div>

                {/* 테이블 바디 */}
                {filteredSections.map((section) => {
                  const isSelected = selectedSectionId === section.id;
                  return (
                    <button
                      type="button"
                      key={section.id}
                      onClick={() => setSelectedSectionId(section.id)}
                      className={`flex w-full items-start border-b border-slate-100 text-left transition-colors ${
                        isSelected
                          ? "border-l-4 border-l-brand bg-brand/[0.03]"
                          : "border-l-4 border-l-transparent hover:bg-slate-50/50"
                      }`}
                    >
                      <div className="w-[120px] shrink-0 px-6 py-6">
                        <span
                          className={`font-mono text-sm font-bold ${
                            isSelected ? "text-brand" : "text-slate-600"
                          }`}
                        >
                          {section.sectionLabel}
                        </span>
                      </div>
                      <div className="flex-1 px-6 py-6">
                        <p className="text-sm leading-relaxed text-slate-700">
                          {section.content}
                        </p>
                      </div>
                      <div className="w-[100px] shrink-0 px-6 py-6 text-right">
                        <span className="text-sm font-medium text-slate-500">
                          {String(section.pageNumber).padStart(2, "0")}
                        </span>
                      </div>
                    </button>
                  );
                })}

                {filteredSections.length === 0 && (
                  <div className="py-16 text-center text-sm text-slate-400">
                    검색 결과가 없습니다.
                  </div>
                )}
              </div>
            ) : (
              /* ━━━ 이미지 뷰 (Figma 1:6020) ━━━ */
              <div className="grid grid-cols-2 gap-6 p-6 lg:grid-cols-3">
                {filteredImages.map((image) => {
                  const isSelected = selectedImageId === image.id;
                  return (
                    <button
                      type="button"
                      key={image.id}
                      onClick={() => setSelectedImageId(image.id)}
                      className={`flex flex-col overflow-hidden rounded-xl border text-left shadow-sm transition-all ${
                        isSelected
                          ? "border-brand ring-2 ring-brand bg-brand/[0.02]"
                          : "border-transparent hover:shadow-md"
                      }`}
                    >
                      {/* 이미지 썸네일 */}
                      <div className="flex aspect-[16/10] items-center justify-center bg-slate-100">
                        <ImageIcon className="size-10 text-slate-300" />
                      </div>
                      {/* 정보 */}
                      <div className="flex flex-col gap-1 p-4">
                        <span className="truncate text-sm font-bold text-slate-900">
                          {image.filename}
                        </span>
                        <p className="line-clamp-2 text-xs leading-[1.6] text-slate-500">
                          {image.description}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="rounded bg-brand/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.5px] text-brand">
                            출처: {String(image.pageNumber).padStart(2, "0")}{" "}
                            페이지
                          </span>
                          <CheckCircle className="size-3.5 text-slate-300" />
                        </div>
                      </div>
                    </button>
                  );
                })}

                {filteredImages.length === 0 && (
                  <div className="col-span-full py-16 text-center text-sm text-slate-400">
                    검색 결과가 없습니다.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 하단 페이지네이션 */}
          <div className="flex items-center justify-between border-t border-slate-100 bg-white px-6 py-3">
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-500"
            >
              <ArrowLeft className="size-5" />
              이전
            </button>
            <div className="flex items-center gap-6">
              <span className="text-xs font-bold uppercase tracking-[1.2px] text-slate-400">
                페이지 1 /{" "}
                {viewMode === "text"
                  ? Math.max(1, Math.ceil(filteredSections.length / 6))
                  : Math.max(1, Math.ceil(filteredImages.length / 6))}
              </span>
              <div className="flex items-center gap-1">
                <span className="flex size-8 items-center justify-center rounded-lg bg-brand text-xs font-bold text-white">
                  1
                </span>
              </div>
            </div>
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-brand"
            >
              다음
              <ArrowRight className="size-5" />
            </button>
          </div>
        </div>

        {/* 우측: 메타데이터 사이드바 */}
        <div className="hidden w-[380px] shrink-0 flex-col overflow-auto bg-slate-50 p-6 lg:flex">
          {/* 사이드바 헤더 */}
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight text-brand">
              메타데이터
            </h2>
            <button type="button">
              <MoreVertical className="size-5 text-slate-400" />
            </button>
          </div>

          {viewMode === "text" && selectedSection ? (
            /* ━━━ 텍스트 메타데이터 (Figma 1:8337 사이드바) ━━━ */
            <>
              {/* 파일명 뱃지 */}
              <div className="mb-8 flex items-center gap-2 rounded-lg border border-slate-100 bg-white px-3.5 py-2 shadow-sm">
                <FileText className="size-3.5 text-brand" />
                <span className="text-[11px] font-bold text-slate-500">
                  {doc.filename}
                </span>
              </div>

              {/* 메타 정보 */}
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold uppercase tracking-[0.55px] text-slate-400">
                    페이지 번호
                  </span>
                  <span className="text-sm font-bold text-slate-900">
                    {String(selectedSection.pageNumber).padStart(2, "0")}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold uppercase tracking-[0.55px] text-slate-400">
                    섹션 제목
                  </span>
                  <span className="text-sm font-bold text-slate-900">
                    {selectedSection.title}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-[0.55px] text-slate-400">
                    키워드
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedSection.keywords.map((kw) => {
                      const color = getKeywordColor(kw);
                      return (
                        <span
                          key={kw}
                          className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${color.bg} ${color.text}`}
                        >
                          {kw}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 연결 이미지 */}
              {connectedImage && (
                <div className="mt-8 flex flex-col gap-1">
                  <span className="text-[11px] font-bold uppercase tracking-[0.55px] text-slate-400">
                    연결 이미지
                  </span>
                  <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-slate-100">
                      <ImageIcon className="size-5 text-slate-400" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-bold uppercase text-slate-900">
                        {connectedImage.filename}
                      </span>
                      <span className="text-[10px] font-bold uppercase text-slate-400">
                        출처: {String(connectedImage.pageNumber).padStart(2, "0")} 페이지
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : viewMode === "image" && selectedImage ? (
            /* ━━━ 이미지 메타데이터 (Figma 1:6020 사이드바) ━━━ */
            <>
              {/* 파일명 뱃지 */}
              <div className="mb-8 flex items-center gap-2 rounded-lg border border-slate-100 bg-white px-3.5 py-2.5 shadow-sm">
                <ImageIcon className="size-3.5 text-brand" />
                <span className="text-[11px] font-bold text-slate-500">
                  {selectedImage.filename}
                </span>
              </div>

              {/* 메타 정보 */}
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold uppercase tracking-[0.55px] text-slate-400">
                    페이지 번호
                  </span>
                  <span className="text-sm font-bold text-slate-900">
                    {String(selectedImage.pageNumber).padStart(2, "0")}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-[0.55px] text-slate-400">
                    AI 태그
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedImage.tags.map((tag) => {
                      const color = getKeywordColor(tag);
                      return (
                        <span
                          key={tag}
                          className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${color.bg} ${color.text}`}
                        >
                          {tag}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* 연결된 컨텍스트 텍스트 */}
                {selectedImage.contextText && (
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-bold uppercase tracking-[0.55px] text-slate-400">
                      연결된 컨텍스트 텍스트
                    </span>
                    <div className="rounded-xl border border-slate-100 bg-white p-3.5">
                      <p className="text-xs leading-[1.6] text-slate-600">
                        {selectedImage.contextText}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-sm text-slate-400">
              {viewMode === "text"
                ? "섹션을 선택하면 메타데이터가 표시됩니다."
                : "이미지를 선택하면 메타데이터가 표시됩니다."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
