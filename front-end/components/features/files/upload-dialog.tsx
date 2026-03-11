"use client";

import { useState, useRef, useCallback } from "react";
import { FileUp, FileText, Search, X, Upload, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { formatFileSize } from "@/lib/mock";
import { toast } from "sonner";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadComplete?: () => void;
}

export function UploadDialog({
  open,
  onOpenChange,
  onUploadComplete,
}: UploadDialogProps) {
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

  // 파일 설정
  const handleFileSelect = useCallback(
    (f: File) => {
      if (validateFile(f)) {
        setFile(f);
      }
    },
    [validateFile]
  );

  // 드래그앤드롭 핸들러
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

  // 파일 input 변경
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0];
      if (selected) handleFileSelect(selected);
    },
    [handleFileSelect]
  );

  // 파일 제거
  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

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
          // 상태 초기화 및 Dialog 닫기
          setFile(null);
          setVersion("V1.0");
          setDescription("");
          setProgress(0);
          onOpenChange(false);
          onUploadComplete?.();
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  // Dialog 닫힐 때 상태 초기화
  const handleOpenChange = (open: boolean) => {
    if (!open && !uploading) {
      setFile(null);
      setVersion("V1.0");
      setDescription("");
      setDragActive(false);
      setProgress(0);
    }
    if (!uploading) onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-black">
            파일 업로드 및 정보 입력
          </DialogTitle>
          <DialogDescription>
            {file
              ? "선택된 파일을 확인하고 상세 정보를 입력해 주세요."
              : "업로드할 파일을 선택하고 상세 정보를 입력해 주세요."}
          </DialogDescription>
        </DialogHeader>

        {/* 드래그앤드롭 영역 */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 transition-colors",
            dragActive
              ? "border-brand bg-brand/5"
              : file
                ? "border-border bg-muted/30"
                : "border-border/60 bg-muted/20",
            uploading && "pointer-events-none opacity-60"
          )}
        >
          {file ? (
            // 파일 선택 완료 상태
            <div className="flex flex-col items-center gap-3">
              <div className="flex size-14 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950">
                <FileText className="size-7 text-blue-500" />
              </div>
              <p className="font-semibold">{file.name}</p>
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
            // 파일 미선택 상태
            <div className="flex flex-col items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-xl bg-muted">
                <FileUp className="size-7 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="font-semibold">새 문서 드래그 앤 드롭</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  여기에 파일을 끌어다 놓거나 버튼을 클릭하여 선택하세요.
                </p>
              </div>
              <Button
                variant="default"
                className="bg-brand hover:bg-brand/90"
                onClick={() => fileInputRef.current?.click()}
              >
                <Search className="mr-2 size-4" />
                파일 찾기
              </Button>
              <p className="text-xs text-muted-foreground">
                50 MB 이하 PDF 문서만 지원합니다.
              </p>
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
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">업로드 중...</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* 파일 상세 정보 */}
        <div className="rounded-xl border p-5">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
            <FileText className="size-4 text-brand" />
            파일 상세 정보
          </div>
          <div className="space-y-4">
            {/* 파일명 + 파일 사이즈 */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="upload-filename">파일명</Label>
                <Input
                  id="upload-filename"
                  value={file?.name ?? ""}
                  disabled
                  placeholder="파일을 선택하세요"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="upload-filesize">파일 사이즈</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="upload-filesize"
                    value={file ? (file.size / (1024 * 1024)).toFixed(1) : ""}
                    disabled
                    placeholder="—"
                  />
                  <span className="shrink-0 text-sm text-muted-foreground">
                    MB
                  </span>
                </div>
              </div>
            </div>

            {/* 파일 버전 */}
            <div className="space-y-2">
              <Label htmlFor="upload-version">파일 버전</Label>
              <Input
                id="upload-version"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="V1.0"
                disabled={uploading}
              />
            </div>

            {/* 파일 설명 */}
            <div className="space-y-2">
              <Label htmlFor="upload-description">파일 설명</Label>
              <Textarea
                id="upload-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="파일에 대한 간단한 설명을 입력해 주세요."
                rows={4}
                disabled={uploading}
              />
            </div>
          </div>
        </div>

        {/* 하단 */}
        <DialogFooter className="flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <Info className="size-3" />
            모든 필수 항목을 확인 후 업로드를 시작하세요.
          </p>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => handleOpenChange(false)}
              disabled={uploading}
            >
              취소
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="bg-brand hover:bg-brand/90"
            >
              <Upload className="mr-2 size-4" />
              업로드 시작
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
