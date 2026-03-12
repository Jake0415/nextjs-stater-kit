import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 공개 라우트 (인증 불필요)
const PUBLIC_PATHS = ["/auth/callback"];

// 쿠키 키
const ACCESS_TOKEN_COOKIE = "mh_access_token";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 공개 라우트 → 통과
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // 정적 파일, API, _next → 통과
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 토큰 쿠키 확인
  const token = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!token) {
    // SSO 로그인 페이지로 리다이렉트
    const ssoUrl = process.env.NEXT_PUBLIC_SSO_URL || "http://localhost:3001";
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const callbackUrl = `${appUrl}/auth/callback`;
    const authorizeUrl = `${ssoUrl}/api/auth/authorize?redirect_url=${encodeURIComponent(callbackUrl)}`;

    return NextResponse.redirect(authorizeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
