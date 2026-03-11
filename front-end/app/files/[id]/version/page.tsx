"use client";

import { useState, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  FileUp,
  FileText,
  Search,
  X,
  Upload,
  Info,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/routes";
import { mockDocuments, formatFileSize, formatDate } from "@/lib/mock";
import { toast } from "sonner";

const MAX_FILE_SIZE = 50 * 1024 * 1024;

// 버전 이력 Mock 데이터
function getMockVersionHistory(docVersion: string) {
  return [
    {
      version: docVersion,
      date: "2026-03-05",
      note: "현재 버전",
      isCurrent: true,
    },
    { version: "1.0.0", date: "2026-01-15", note: "초기 업로드", isCurrent: false },
  ];
}

// 버전 번호 계산
function getNextVersion(current: string, type: "minor" | "major"): string {
  const parts = current.split(".").map(Number);
  if (type === "major") {
    return `${(parts[0] || 0) + 1}.0.0`;
  }
  return `${parts[0] || 0}.${(parts[1] || 0) + 1}.0`;
}

export default function VersionUpdatePage() {
  const params = useParams();
  const docId = params.id as string;
  const doc = mockDocuments.find((d) => d.id === docId);

  // 상태
  const [file, setFile] = useState<File | null>(null);
  const [versionType, setVersionType] = useState<"minor" | "major">("minor");
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

  // 업로드 시뮬레이션
  const handleUpload = () => {
    if (!file || !doc) return;
    setUploading(true);
    setProgress(0);

    const nextVer = getNextVersion(doc.version, versionType);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          toast.success(
            `${doc.filename} 버전이 v${nextVer}로 업데이트되었습니다.`
          );
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  // 문서 미존재
  if (!doc) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-black">문서를 찾을 수 없습니다</h1>
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

  const nextVersion = getNextVersion(doc.version, versionType);
  const versionHistory = getMockVersionHistory(doc.version);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      {/* 페이지 헤더 */}
      <div className="mb-8">
        <h1 className="text-2xl font-black tracking-tight">
          버전업 파일 업로드 및 정보 입력
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
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
          "relative mb-6 flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 transition-colors",
          dragActive
            ? "border-brand bg-brand/5"
            : file
              ? "border-border bg-muted/30"
              : "border-border/60 bg-muted/20",
          uploading && "pointer-events-none opacity-60"
        )}
      >
        {file ? (
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
          <div className="flex flex-col items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-xl bg-muted">
              <FileUp className="size-7 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="font-semibold">새 문서 드래그 앤 드롭</p>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                파일을 드래그앤드롭으로 첨부하면 파일명으로 기존 문서를 자동 검색해
                업데이트 대상을 즉시 매칭·대체합니다.
              </p>
            </div>
            <Button
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
        <div className="mb-6 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">업로드 중...</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {/* 파일 상세 정보 */}
      <div className="mb-6 rounded-xl border p-5">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
          <FileText className="size-4 text-brand" />
          파일 상세 정보
        </div>

        <div className="space-y-4">
          {/* 원본 파일명 */}
          <div className="space-y-2">
            <Label htmlFor="original-filename">원본 파일명</Label>
            <Input
              id="original-filename"
              value={doc.filename}
              disabled
              className="bg-muted/50"
            />
          </div>

          {/* 파일명 + 사이즈 */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="new-filename">파일명</Label>
              <Input
                id="new-filename"
                value={file?.name ?? ""}
                disabled
                placeholder="파일을 선택하세요"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-filesize">파일 사이즈</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="new-filesize"
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

          {/* 파일 버전 관리 */}
          <div className="space-y-2">
            <Label>파일 버전 관리</Label>
            <div className="flex items-center gap-4 rounded-lg border p-3">
              <div className="shrink-0 rounded-md bg-muted px-3 py-1.5 text-center">
                <p className="text-[10px] text-muted-foreground">기존 버전</p>
                <p className="text-sm font-bold">{doc.version}</p>
              </div>
              <RadioGroup
                value={versionType}
                onValueChange={(v) => setVersionType(v as "minor" | "major")}
                className="flex items-center gap-4"
                disabled={uploading}
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="minor" id="minor" />
                  <Label htmlFor="minor" className="cursor-pointer text-sm">
                    마이너 버전업 (+0.1)
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="major" id="major" />
                  <Label htmlFor="major" className="cursor-pointer text-sm">
                    메이저 버전업 (+1.0)
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* 파일 설명 */}
          <div className="space-y-2">
            <Label htmlFor="version-description">파일 설명</Label>
            <Textarea
              id="version-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="파일에 대한 간단한 설명을 입력해 주세요."
              rows={4}
              disabled={uploading}
            />
          </div>
        </div>
      </div>

      {/* 버전 이력 */}
      <div className="mb-6 rounded-xl border p-5">
        <h3 className="mb-3 text-sm font-semibold">버전 이력</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>버전</TableHead>
              <TableHead>날짜</TableHead>
              <TableHead>설명</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {versionHistory.map((v) => (
              <TableRow key={v.version}>
                <TableCell>
                  <Badge variant={v.isCurrent ? "default" : "outline"}>
                    v{v.version}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {v.date}
                </TableCell>
                <TableCell className="text-sm">{v.note}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 하단 버튼 */}
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          {file ? (
            <>
              <CheckCircle className="size-3 text-brand" />
              <span className="text-brand">모든 정보가 입력되었습니다.</span>
            </>
          ) : (
            <>
              <Info className="size-3" />
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
            disabled={!file || uploading}
            className="bg-brand hover:bg-brand/90"
          >
            <Upload className="mr-2 size-4" />
            업로드 시작
          </Button>
        </div>
      </div>
    </div>
  );
}
