"use client";

import { FileText, Table2, ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Section } from "@/lib/types";

const typeIcons: Record<Section["type"], typeof FileText> = {
  text: FileText,
  table: Table2,
  image: ImageIcon,
};

const typeLabels: Record<Section["type"], string> = {
  text: "텍스트",
  table: "테이블",
  image: "이미지",
};

interface MetadataPanelProps {
  section: Section | null;
}

export function MetadataPanel({ section }: MetadataPanelProps) {
  if (!section) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-sm text-muted-foreground">
        섹션을 선택하면 상세 정보가 표시됩니다.
      </div>
    );
  }

  const Icon = typeIcons[section.type];

  return (
    <ScrollArea className="h-full">
      <div className="space-y-5 p-5">
        {/* 헤더 */}
        <div className="flex items-center gap-3">
          <Icon className="size-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-semibold">{section.content}</p>
            <p className="text-xs text-muted-foreground">
              섹션 ID: {section.id}
            </p>
          </div>
        </div>

        {/* 메타 정보 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">타입</p>
            <p className="mt-1 text-sm font-medium">
              {typeLabels[section.type]}
            </p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">페이지</p>
            <p className="mt-1 text-sm font-medium">{section.pageNumber}</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">신뢰도</p>
            <p className="mt-1 text-sm font-medium">
              {Math.round(section.confidence * 100)}%
            </p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">문서 ID</p>
            <p className="mt-1 text-sm font-medium">{section.documentId}</p>
          </div>
        </div>

        {/* 태그 */}
        <div>
          <p className="mb-2 text-xs font-semibold text-muted-foreground">
            태그
          </p>
          <div className="flex flex-wrap gap-1.5">
            {section.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* 내용 */}
        <div>
          <p className="mb-2 text-xs font-semibold text-muted-foreground">
            추출 내용
          </p>
          <div className="rounded-lg border bg-muted/30 p-4 text-sm leading-relaxed">
            {section.content}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
