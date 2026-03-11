"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import type { Document } from "@/lib/types";

interface DeleteConfirmDialogProps {
  document: Document | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm?: (id: string) => void;
}

export function DeleteConfirmDialog({
  document: doc,
  open,
  onOpenChange,
  onConfirm,
}: DeleteConfirmDialogProps) {
  const handleConfirm = () => {
    if (!doc) return;
    onConfirm?.(doc.id);
    toast.success(`${doc.filename} 파일이 삭제되었습니다.`);
    onOpenChange(false);
  };

  if (!doc) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>파일 삭제</AlertDialogTitle>
          <AlertDialogDescription>
            이 파일을 삭제하시겠습니까?
            <br />
            삭제된 파일은 복구할 수 없습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            확인
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
