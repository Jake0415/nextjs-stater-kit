"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Template } from "@/lib/types";

interface TemplateSelectorProps {
  templates: Template[];
  selected: string | null;
  onSelect: (id: string) => void;
  disabled?: boolean;
}

export function TemplateSelector({
  templates,
  selected,
  onSelect,
  disabled,
}: TemplateSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="text-sm font-semibold">추출 템플릿 선택</div>
      <RadioGroup
        value={selected ?? ""}
        onValueChange={onSelect}
        disabled={disabled}
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
      >
        {templates.map((tpl) => (
          <Label
            key={tpl.id}
            htmlFor={tpl.id}
            className={cn(
              "flex cursor-pointer flex-col gap-2 rounded-xl border p-4 transition-colors hover:bg-muted/50",
              selected === tpl.id && "border-brand bg-brand/5"
            )}
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value={tpl.id} id={tpl.id} />
              <span className="text-sm font-semibold">{tpl.name}</span>
            </div>
            <div className="ml-6 space-y-1">
              <Badge variant="outline" className="text-[10px]">
                {tpl.codeNumber}
              </Badge>
              <p className="text-xs text-muted-foreground">
                {tpl.description}
              </p>
            </div>
          </Label>
        ))}
      </RadioGroup>
    </div>
  );
}
