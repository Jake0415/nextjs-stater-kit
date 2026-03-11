"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import { mainNavLinks, externalLinks } from "@/lib/navigation";
import { currentUser } from "@/lib/mock";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="size-5" />
          <span className="sr-only">메뉴 열기</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72">
        <div className="flex flex-col gap-6 pt-6">
          {/* 로고 */}
          <Link
            href="/"
            className="flex items-center gap-3"
            onClick={() => setOpen(false)}
          >
            <div className="flex size-9 items-center justify-center rounded-lg bg-brand shadow-sm">
              <LayoutGrid className="size-5 text-white" />
            </div>
            <span className="text-lg font-black tracking-tight">
              MH OCR AI
            </span>
          </Link>

          {/* 유저 프로필 */}
          <div className="flex items-center gap-3">
            <Avatar className="size-10 border border-border">
              <AvatarFallback className="bg-muted text-xs font-bold">
                {currentUser.name.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold">{currentUser.name}</p>
              <p className="text-xs text-brand">
                {currentUser.role === "admin" ? "관리자" : "사용자"}
              </p>
            </div>
          </div>

          <Separator />

          {/* 메인 네비게이션 */}
          <nav className="flex flex-col gap-1">
            {mainNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-2.5 text-sm font-bold transition-colors",
                  pathname === link.href || pathname.startsWith(link.href + "/")
                    ? "bg-brand/10 text-brand"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Separator />

          {/* 외부 링크 */}
          <nav className="flex flex-col gap-1">
            {externalLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-bold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
