"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileUp,
  FileText,
  Search,
  X,
  Upload,
  Info,
  CheckCircle,
  Paperclip,
  Database,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/routes";
import { mockDocuments, formatFileSize } from "@/lib/mock";
import { toast } from "sonner";
import type { Document } from "@/lib/types";

const MAX_FILE_SIZE = 50 * 1024 * 1024;

// 버전 번호 계산
function getNextVersion(current: string, type: "minor" | "major"): string {
  const parts = current.split(".").map(Number);
  if (type === "major") {
    return `${(parts[0] || 0) + 1}.0.0`;
  }
  return `${parts[0] || 0}.${(parts[1] || 0) + 1}.0`;
}

export default function VersionUpdatePage() {
  const router = useRouter();

  // 문서 검색/선택 상태
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // 파일 업로드 상태
  const [file, setFile] = useState<File | null>(null);
  const [versionType, setVersionType] = useState<"minor" | "major">("minor");
  const [description, setDescription] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 검색 결과 필터링
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return mockDocuments.filter((doc) =>
      doc.filename.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // 파일 드롭 시 파일명으로 자동 매칭
  const autoMatchDocument = useCallback((filename: string) => {
    // 정확한 파일명 매칭 시도
    const exactMatch = mockDocuments.find(
      (doc) => doc.filename.toLowerCase() === filename.toLowerCase()
    );
    if (exactMatch) {
      setSelectedDoc(exactMatch);
      setSearchQuery(exactMatch.filename);
      return;
    }
    // 부분 매칭 시도 (확장자 제외 이름 비교)
    const baseName = filename.replace(/\.pdf$/i, "").toLowerCase();
    const partialMatch = mockDocuments.find((doc) =>
      doc.filename.replace(/\.pdf$/i, "").toLowerCase().includes(baseName) ||
      baseName.includes(doc.filename.replace(/\.pdf$/i, "").toLowerCase())
    );
    if (partialMatch) {
      setSelectedDoc(partialMatch);
      setSearchQuery(partialMatch.filename);
    }
  }, []);

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
      if (validateFile(f)) {
        setFile(f);
        autoMatchDocument(f.name);
      }
    },
    [validateFile, autoMatchDocument]
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

  // 문서 검색 선택
  const handleSelectDocument = (doc: Document) => {
    setSelectedDoc(doc);
    setSearchQuery(doc.filename);
    setShowSearchResults(false);
  };

  // 업로드 시뮬레이션
  const handleUpload = () => {
    if (!file) return;
    setUploading(true);
    setProgress(0);

    const nextVer = selectedDoc
      ? getNextVersion(selectedDoc.version, versionType)
      : getNextVersion("1.0.0", versionType);
    const displayName = selectedDoc?.filename ?? file.name;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          toast.success(
            `${displayName} 버전이 v${nextVer}로 업데이트되었습니다.`
          );
          router.push(ROUTES.FILES);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const isReady = !!file;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      {/* 페이지 헤더 */}
      <div className="mb-8">
        <h1 className="text-[36px] font-black tracking-tight text-slate-900">
          버전업 파일 업로드 및 정보 입력
        </h1>
        <p className="mt-1 text-base text-slate-500">
          {file
            ? "파일 업로드 준비가 완료되었습니다. 상세 정보를 확인 후 업로드 해주세요."
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
                파일을 드래그앤드롭으로 첨부하면 파일명으로 기존 문서를 자동
                검색해 업데이트 대상을 즉시 매칭·대체합니다.
                <br />
                일치하는 파일이 없으면 사용자가 직접 검색해 대상 파일을 선택해
                업데이트할 수 있습니다.
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
          {/* 원본 파일명 — 검색 입력 */}
          <div className="space-y-2">
            <Label className="font-semibold text-slate-700">원본 파일명</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(true);
                  if (!e.target.value.trim()) setSelectedDoc(null);
                }}
                onFocus={() => {
                  if (searchQuery.trim()) setShowSearchResults(true);
                }}
                onBlur={() => {
                  // 약간의 딜레이 후 닫기 (클릭 이벤트 처리를 위해)
                  setTimeout(() => setShowSearchResults(false), 200);
                }}
                placeholder="기존 파일을 검색하여 버전을 관리할 수 있습니다."
                className="bg-slate-50 pl-10"
                disabled={uploading}
              />
              {/* 검색 결과 드롭다운 */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-10 mt-1 max-h-48 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg">
                  {searchResults.map((doc) => (
                    <button
                      key={doc.id}
                      type="button"
                      className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-slate-50"
                      onMouseDown={() => handleSelectDocument(doc)}
                    >
                      <FileText className="size-4 shrink-0 text-red-500" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-slate-700">
                          {doc.filename}
                        </p>
                        <p className="text-xs text-slate-400">
                          v{doc.version} · {formatFileSize(doc.fileSize)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

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
                  value={
                    file ? (file.size / (1024 * 1024)).toFixed(1) : ""
                  }
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

          {/* 파일 버전 관리 */}
          <div className="space-y-2">
            <Label className="font-semibold text-slate-700">
              파일 버전 관리
            </Label>
            <div className="flex items-center gap-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="shrink-0 px-3">
                <p className="text-[11px] font-bold uppercase text-slate-400">
                  기존 버전
                </p>
                <p className="text-sm font-bold text-slate-700">
                  {selectedDoc ? selectedDoc.version : "-"}
                </p>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <RadioGroup
                value={versionType}
                onValueChange={(v) =>
                  setVersionType(v as "minor" | "major")
                }
                className="flex items-center gap-6"
                disabled={uploading}
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="minor" id="minor" />
                  <Label
                    htmlFor="minor"
                    className="cursor-pointer text-sm font-medium text-slate-700"
                  >
                    마이너 버전업 (+0.1)
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="major" id="major" />
                  <Label
                    htmlFor="major"
                    className="cursor-pointer text-sm font-medium text-slate-700"
                  >
                    메이저 버전업 (+1.0)
                  </Label>
                </div>
              </RadioGroup>
            </div>
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
              {isReady ? (
                <>
                  <CheckCircle className="size-3.5 text-brand" />
                  <span className="text-brand">
                    모든 정보가 입력되었습니다.
                  </span>
                </>
              ) : (
                <>
                  <Info className="size-3.5" />
                  모든 필수 항목을 확인 후 업로드를 시작하세요.
                </>
              )}
            </p>
            <div className="flex items-center gap-3">
              <Button asChild variant="ghost" disabled={uploading}>
                <Link href={ROUTES.FILES}>취소</Link>
              </Button>
              <Button
                onClick={handleUpload}
                disabled={!isReady || uploading}
                className={cn(
                  "gap-2",
                  isReady
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
