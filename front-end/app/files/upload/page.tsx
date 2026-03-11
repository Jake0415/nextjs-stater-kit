"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileUp,
  FileText,
  Search,
  X,
  Upload,
  Info,
  Paperclip,
  Database,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/routes";
import { formatFileSize } from "@/lib/mock";
import { toast } from "sonner";

const MAX_FILE_SIZE = 50 * 1024 * 1024;

export default function FileUploadPage() {
  const router = useRouter();

  // 파일 업로드 상태
  const [file, setFile] = useState<File | null>(null);
  const [version, setVersion] = useState("V1.0");
  const [description, setDescription] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 파일 유효성 검사
  const validateFile = useCallback((f: File): boolean => {
    if (f.type !== "application/pdf") {
      toast.error("PDF 파일만 업로드할 수 있습니다.");
      return false;
    }
    if (f.size > MAX_FILE_SIZE) {
      toast.error("파일 크기는 50MB 이하여야 합니다.");
      return false;
    }
    return true;
  }, []);

  const handleFileSelect = useCallback(
    (f: File) => {
      if (validateFile(f)) setFile(f);
    },
    [validateFile]
  );

  // 드래그앤드롭
  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!uploading) setDragActive(true);
    },
    [uploading]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (uploading) return;
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) handleFileSelect(droppedFile);
    },
    [uploading, handleFileSelect]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0];
      if (selected) handleFileSelect(selected);
    },
    [handleFileSelect]
  );

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // 업로드 완료 시 페이지 이동
  const [uploadComplete, setUploadComplete] = useState(false);

  useEffect(() => {
    if (uploadComplete) {
      router.push(ROUTES.FILES);
    }
  }, [uploadComplete, router]);

  // 업로드 시뮬레이션
  const handleUpload = () => {
    if (!file) return;
    setUploading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          toast.success(`${file.name} 업로드가 완료되었습니다.`);
          setUploadComplete(true);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      {/* 페이지 헤더 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          파일 업로드 및 정보 입력
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {file
            ? "선택된 파일을 확인하고 상세 정보를 입력해 주세요."
            : "업로드할 파일을 선택하고 상세 정보를 입력해 주세요."}
        </p>
      </div>

      {/* 드래그앤드롭 영역 */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative mb-8 flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 transition-colors",
          dragActive
            ? "border-brand bg-brand/5"
            : file
              ? "border-brand/30 bg-blue-50/30"
              : "border-brand/30 bg-blue-50/30",
          uploading && "pointer-events-none opacity-60"
        )}
      >
        {file ? (
          <div className="flex flex-col items-center gap-3">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-blue-50">
              <FileText className="size-7 text-brand" />
            </div>
            <p className="font-semibold text-slate-900">{file.name}</p>
            <p className="text-sm text-muted-foreground">
              {formatFileSize(file.size)}{" "}
              <span className="text-brand">· 선택 완료</span>
            </p>
            {!uploading && (
              <button
                onClick={handleRemoveFile}
                className="absolute right-3 top-3 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="파일 제거"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-2xl border border-slate-100 bg-white shadow-sm">
              <FileUp className="size-9 text-brand" />
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-slate-900">
                새 문서 드래그 앤 드롭
              </p>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
                여기에 파일을 끌어다 놓거나 버튼을 클릭하여 선택하세요.
              </p>
            </div>
            <Button
              className="bg-brand shadow-md hover:bg-brand/90"
              onClick={() => fileInputRef.current?.click()}
            >
              <Search className="mr-2 size-4" />
              파일 찾기
            </Button>
            <div className="w-full border-t border-slate-200/50 pt-4">
              <p className="text-center text-[10px] font-bold uppercase tracking-wider text-slate-400">
                50 MB 이하 PDF 문서만 지원합니다.
              </p>
            </div>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleInputChange}
          className="hidden"
        />
      </div>

      {/* 업로드 프로그레스 */}
      {uploading && (
        <div className="mb-6 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">업로드 중...</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {/* 파일 상세 정보 카드 */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* 카드 헤더 */}
        <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/50 px-6 py-4">
          <FileText className="size-5 text-brand" />
          <span className="text-sm font-semibold text-slate-800">
            파일 상세 정보
          </span>
        </div>

        <div className="space-y-8 p-8">
          {/* 파일명 + 사이즈 */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="font-semibold text-slate-700">파일명</Label>
              <div className="relative">
                <Paperclip className="absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-slate-400" />
                <Input
                  value={file?.name ?? ""}
                  disabled
                  placeholder="-"
                  className="bg-slate-50 pl-10 opacity-60"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="font-semibold text-slate-700">파일 사이즈</Label>
              <div className="relative">
                <Database className="absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-slate-400" />
                <Input
                  value={file ? (file.size / (1024 * 1024)).toFixed(1) : ""}
                  disabled
                  placeholder=""
                  className="bg-slate-100 pl-10"
                />
                {file && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    MB
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 파일 버전 */}
          <div className="space-y-2">
            <Label className="font-semibold text-slate-700">파일 버전</Label>
            <Input
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="V1.0"
              disabled={uploading}
              className="bg-slate-50"
            />
          </div>

          {/* 파일 설명 */}
          <div className="space-y-2">
            <Label className="font-semibold text-slate-700">파일 설명</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="파일에 대한 간단한 설명을 입력해 주세요."
              rows={4}
              disabled={uploading}
              className="min-h-[120px] resize-none bg-slate-50"
            />
          </div>

          {/* 하단 구분선 + 버튼 */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-6">
            <p className="flex items-center gap-1.5 text-xs text-slate-400">
              <Info className="size-3.5" />
              {file
                ? "내용을 확인하신 후 '업로드 시작' 버튼을 클릭하세요."
                : "모든 필수 항목을 확인 후 업로드를 시작하세요."}
            </p>
            <div className="flex items-center gap-3">
              <Button asChild variant="ghost" disabled={uploading}>
                <Link href={ROUTES.FILES}>취소</Link>
              </Button>
              <Button
                onClick={handleUpload}
                disabled={!file || uploading}
                className={cn(
                  "gap-2",
                  file
                    ? "bg-brand hover:bg-brand/90"
                    : "bg-slate-200 text-slate-400"
                )}
              >
                <Upload className="size-4" />
                업로드 시작
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
