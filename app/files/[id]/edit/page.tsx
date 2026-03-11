"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Trash2,
  FileText,
  Save,
  Plus,
  Minus,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ROUTES } from "@/lib/routes";
import { mockDocuments, formatFileSize, formatDate } from "@/lib/mock";
import { toast } from "sonner";
import { DeleteConfirmDialog } from "@/components/features/files/delete-confirm-dialog";
import type { Document } from "@/lib/types";

export default function FileEditPage() {
  const params = useParams();
  const router = useRouter();
  const docId = params.id as string;

  // 문서 조회
  const doc = mockDocuments.find((d) => d.id === docId);

  // 수정 가능 필드
  const [description, setDescription] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);

  // 문서 미리보기 줌
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (doc) {
      setDescription(doc.description);
    }
  }, [doc]);

  if (!doc) {
    return (
      <div className="mx-auto max-w-[1000px] px-20 py-8">
        <p className="text-slate-500">문서를 찾을 수 없습니다.</p>
      </div>
    );
  }

  // OCR 완료된 문서는 수정 불가
  const isReadOnly = doc.status === "ocr_completed";

  // 설명이 원본과 다를 때만 저장 활성화
  const hasChanges = description !== doc.description;

  const handleSave = () => {
    if (!hasChanges) return;
    // TODO: 실제 API 호출로 교체
    toast.success("변경 사항이 저장되었습니다.");
    router.push(ROUTES.FILES);
  };

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 2));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5));
  // TODO: 실제 서버 파일 URL로 교체 (예: /api/v1/files/{id}/download)
  const fileViewUrl = `/api/v1/files/${doc.id}/view`;

  // 날짜 포맷 (한국어 스타일)
  const formattedDate = new Date(doc.uploadedAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-[1000px] px-20 py-8">
      {/* 페이지 헤더 */}
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          파일 정보 수정
        </h1>
        <p className="text-sm text-slate-500">
          업로드한 사용자 본인만 문서 정보를 수정할 수 있으며, OCR 텍스트 추출을
          수행한 문서는 정보 수정이 불가능합니다.
        </p>
      </div>

      {/* 메인 카드 */}
      <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-[0px_4px_20px_0px_rgba(0,0,0,0.05)]">
        <div className="flex">
          {/* 좌측: 문서 미리보기 */}
          <div className="flex w-[416px] shrink-0 flex-col gap-4 border-r border-slate-100 bg-slate-50/80 p-8">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              문서 미리보기
            </p>
            <div className="flex items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow-sm">
              <div
                className="flex min-h-[400px] items-center justify-center p-4 transition-transform"
                style={{ transform: `scale(${zoom})` }}
              >
                <div className="flex h-[360px] w-[270px] flex-col items-center justify-center rounded bg-white shadow-md">
                  <FileText className="mb-2 size-12 text-slate-300" />
                  <p className="text-xs text-slate-400">{doc.filename}</p>
                  <p className="mt-1 text-[10px] text-slate-300">
                    {doc.pageCount}페이지
                  </p>
                </div>
              </div>
            </div>
            {/* 줌 컨트롤 */}
            <div className="flex items-center justify-center gap-4 pt-4">
              <button
                type="button"
                onClick={handleZoomIn}
                className="flex size-10 items-center justify-center rounded-full border border-brand text-brand transition-colors hover:bg-brand/5"
              >
                <Plus className="size-5" />
              </button>
              <button
                type="button"
                onClick={handleZoomOut}
                className="flex size-10 items-center justify-center rounded-full border border-brand text-brand transition-colors hover:bg-brand/5"
              >
                <Minus className="size-5" />
              </button>
              <a
                href={fileViewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-10 items-center justify-center border border-brand text-brand transition-colors hover:bg-brand/5"
                title="파일 보기"
              >
                <ExternalLink className="size-5" />
              </a>
            </div>
          </div>

          {/* 우측: 파일 정보 */}
          <div className="flex flex-1 flex-col gap-8 p-8">
            {/* 파일명 */}
            <div className="flex flex-col gap-2">
              <Label className="font-bold text-slate-900">파일명</Label>
              <Input
                value={doc.filename}
                disabled
                className="h-12 bg-white text-base"
              />
            </div>

            {/* 버전 */}
            <div className="flex flex-col gap-2">
              <Label className="font-bold text-slate-900">버전</Label>
              <Input
                value={`v${doc.version}`}
                disabled
                className="h-12 bg-white text-base"
              />
            </div>

            {/* 시스템 메타데이터 */}
            <div className="flex flex-col gap-4 pt-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                시스템 메타데이터
              </p>
              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col gap-1 rounded-lg border border-slate-100 bg-slate-50/80 p-4">
                  <span className="text-[10px] font-bold uppercase text-slate-500">
                    크기
                  </span>
                  <span className="text-sm font-medium text-slate-900">
                    {formatFileSize(doc.fileSize)}
                  </span>
                </div>
                <div className="flex flex-col gap-1 rounded-lg border border-slate-100 bg-slate-50/80 p-4">
                  <span className="text-[10px] font-bold uppercase text-slate-500">
                    업로더
                  </span>
                  <span className="text-sm font-medium text-slate-900">
                    {doc.uploadedBy.name}
                  </span>
                </div>
                <div className="flex flex-col gap-1 rounded-lg border border-slate-100 bg-slate-50/80 p-4">
                  <span className="text-[10px] font-bold uppercase text-slate-500">
                    날짜
                  </span>
                  <span className="text-sm font-medium text-slate-900">
                    {formattedDate}
                  </span>
                </div>
              </div>
            </div>

            {/* 구분선 */}
            <div className="h-px bg-slate-100" />

            {/* 파일 설명 */}
            <div className="flex flex-col gap-2">
              <Label className="font-bold text-slate-900">파일 설명</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="파일에 대한 간단한 설명을 입력해 주세요."
                className="min-h-[140px] resize-none bg-white text-base"
              />
            </div>
          </div>
        </div>

        {/* 하단 액션 바 */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-white px-6 py-5">
          {/* 좌측 버튼 */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="size-4" />
              파일 삭제
            </Button>
            <Button variant="outline" className="gap-2" asChild>
              <Link href={ROUTES.FILE_OCR(doc.id)}>
                <FileText className="size-4" />
                OCR 텍스트 추출
              </Link>
            </Button>
          </div>

          {/* 우측 버튼 */}
          <div className="flex items-center gap-3">
            <Button variant="outline" asChild>
              <Link href={ROUTES.FILES}>취소</Link>
            </Button>
            <Button
              onClick={handleSave}
              disabled={!hasChanges}
              className="gap-2 bg-brand hover:bg-brand/90"
            >
              <Save className="size-4" />
              변경 사항 저장
            </Button>
          </div>
        </div>
      </div>

      {/* 삭제 확인 Dialog */}
      <DeleteConfirmDialog
        document={deleteOpen ? doc : null}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </div>
  );
}
