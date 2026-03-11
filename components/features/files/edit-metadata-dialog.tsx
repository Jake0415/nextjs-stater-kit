"use client";

import { useState, useEffect } from "react";
import { Save, FileText } from "lucide-react";
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
import { formatFileSize, formatDate } from "@/lib/mock";
import { toast } from "sonner";
import type { Document } from "@/lib/types";

interface EditMetadataDialogProps {
  document: Document | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (id: string, description: string) => void;
}

export function EditMetadataDialog({
  document: doc,
  open,
  onOpenChange,
  onSave,
}: EditMetadataDialogProps) {
  const [description, setDescription] = useState("");

  // document 변경 시 초기값 설정
  useEffect(() => {
    if (doc) {
      setDescription(doc.description);
    }
  }, [doc]);

  const handleSave = () => {
    if (!doc) return;
    onSave?.(doc.id, description);
    toast.success("변경 사항이 저장되었습니다.");
    onOpenChange(false);
  };

  if (!doc) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-black">
            파일 정보 수정
          </DialogTitle>
          <DialogDescription>
            업로드한 사용자 본인만 문서 정보를 수정할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* 파일명 (읽기전용) */}
          <div className="space-y-2">
            <Label htmlFor="edit-filename">파일명</Label>
            <Input id="edit-filename" value={doc.filename} disabled />
          </div>

          {/* 버전 (읽기전용) */}
          <div className="space-y-2">
            <Label htmlFor="edit-version">버전</Label>
            <Input id="edit-version" value={`v${doc.version}`} disabled />
          </div>

          {/* 시스템 메타데이터 */}
          <div>
            <p className="mb-2 text-sm font-medium text-brand">
              시스템 메타데이터
            </p>
            <div className="grid grid-cols-3 gap-3 rounded-lg border p-3">
              <div>
                <p className="text-xs text-muted-foreground">크기</p>
                <p className="text-sm font-medium">
                  {formatFileSize(doc.fileSize)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">업로더</p>
                <p className="text-sm font-medium">{doc.uploadedBy.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">날짜</p>
                <p className="text-sm font-medium">
                  {formatDate(doc.uploadedAt)}
                </p>
              </div>
            </div>
          </div>

          {/* 파일 설명 (수정 가능) */}
          <div className="space-y-2">
            <Label htmlFor="edit-description" className="font-bold">
              파일 설명
            </Label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="파일에 대한 설명을 입력해 주세요."
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button
            onClick={handleSave}
            className="bg-brand hover:bg-brand/90"
          >
            <Save className="mr-2 size-4" />
            변경 사항 저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
