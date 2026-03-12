"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { mainNavLinks, externalLinks } from "@/lib/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MobileNav } from "./mobile-nav";

// SSO 역할 → 표시 라벨
function getRoleLabel(role: string): string {
  switch (role) {
    case "SUPER_ADMIN":
      return "Super-Admin";
    case "ADMIN":
      return "Admin";
    case "USER":
      return "User";
    default:
      return role;
  }
}

export function Header() {
  const pathname = usePathname();
  const { user, isLoading, logout } = useAuth();

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

          {!isLoading && user && (
            <div className="flex items-center gap-3 border-l border-border/40 pl-6">
              <div className="text-right">
                <p className="text-sm font-semibold leading-none">
                  {user.name}
                </p>
                <p className="mt-1 text-xs font-medium text-brand">
                  {getRoleLabel(user.role)}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="cursor-pointer rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <Avatar className="size-10 border border-border">
                      {user.profileImage && (
                        <AvatarImage
                          src={user.profileImage}
                          alt={user.name}
                        />
                      )}
                      <AvatarFallback className="bg-muted text-xs font-bold">
                        {user.name.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <p className="text-sm font-semibold">{user.name}</p>
                    <p className="text-xs font-normal text-muted-foreground">
                      {user.email}
                    </p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 size-4" />
                    로그아웃
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        {/* 모바일 메뉴 */}
        <MobileNav />
      </div>
    </header>
  );
}
