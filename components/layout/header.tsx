"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import { mainNavLinks, externalLinks } from "@/lib/navigation";
import { currentUser } from "@/lib/mock";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MobileNav } from "./mobile-nav";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
        {/* 좌측: 로고 + 메인 네비게이션 */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-brand shadow-sm">
              <LayoutGrid className="size-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight">
              MH OCR AI
            </span>
          </Link>

          {/* 데스크톱 메인 네비게이션 */}
          <nav className="hidden items-center gap-1 md:flex">
            {mainNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-bold transition-colors",
                  pathname === link.href || pathname.startsWith(link.href + "/")
                    ? "bg-brand/10 text-brand"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* 우측: 외부 링크 + 유저 프로필 */}
        <div className="hidden items-center gap-6 md:flex">
          <nav className="flex items-center gap-1">
            {externalLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-full px-4 py-2 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 border-l border-border/40 pl-6">
            <div className="text-right">
              <p className="text-sm font-semibold leading-none">
                {currentUser.name}
              </p>
              <p className="mt-1 text-xs font-medium text-brand">
                {currentUser.role === "admin" ? "관리자" : "사용자"}
              </p>
            </div>
            <Avatar className="size-10 border border-border">
              <AvatarFallback className="bg-muted text-xs font-bold">
                {currentUser.name.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        <MobileNav />
      </div>
    </header>
  );
}
