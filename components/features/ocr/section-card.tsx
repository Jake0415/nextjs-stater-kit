"use client";

import { FileText, Table2, ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Section } from "@/lib/types";

const typeConfig: Record<
  Section["type"],
  { icon: typeof FileText; label: string }
> = {
  text: { icon: FileText, label: "텍스트" },
  table: { icon: Table2, label: "테이블" },
  image: { icon: ImageIcon, label: "이미지" },
};

interface SectionCardProps {
  section: Section;
  isSelected: boolean;
  onClick: () => void;
}

export function SectionCard({ section, isSelected, onClick }: SectionCardProps) {
  const config = typeConfig[section.type];
  const Icon = config.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded-lg border p-3 text-left transition-colors hover:bg-muted/50",
        isSelected && "border-brand bg-brand/5"
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="shrink-0 text-[10px]">
              {config.label}
            </Badge>
            <span className="text-xs text-muted-foreground">
              p.{section.pageNumber}
            </span>
          </div>
          <p className="mt-1 truncate text-sm font-medium">{section.content}</p>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              신뢰도 {Math.round(section.confidence * 100)}%
            </span>
            <div className="flex gap-1">
              {section.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-[10px]">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
