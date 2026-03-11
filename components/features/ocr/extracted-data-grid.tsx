"use client";

import { ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { SectionImage } from "@/lib/types";

interface ExtractedDataGridProps {
  images: SectionImage[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function ExtractedDataGrid({
  images,
  selectedId,
  onSelect,
}: ExtractedDataGridProps) {
  if (images.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-sm text-muted-foreground">
        추출된 이미지가 없습니다.
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="grid grid-cols-2 gap-3 p-3 sm:grid-cols-3">
        {images.map((img) => (
          <button
            key={img.id}
            type="button"
            onClick={() => onSelect(img.id)}
            className={cn(
              "rounded-lg border p-2 text-left transition-colors hover:bg-muted/50",
              selectedId === img.id && "border-brand bg-brand/5"
            )}
          >
            {/* 썸네일 영역 */}
            <div className="flex aspect-square items-center justify-center rounded-md bg-muted">
              <ImageIcon className="size-8 text-muted-foreground/50" />
            </div>
            <p className="mt-2 truncate text-xs font-medium">{img.filename}</p>
            <p className="truncate text-[10px] text-muted-foreground">
              {img.description}
            </p>
            <div className="mt-1 flex gap-1">
              {img.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-[10px]">
                  {tag}
                </Badge>
              ))}
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}
