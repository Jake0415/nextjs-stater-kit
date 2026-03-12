import { NextRequest, NextResponse } from "next/server";

const SSO_URL = process.env.NEXT_PUBLIC_SSO_URL || "http://localhost:3001";

/** MHSSO 로그아웃 프록시 (CORS 우회) */
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("Authorization") || "";

  const res = await fetch(`${SSO_URL}/api/auth/logout`, {
    method: "POST",
    headers: { Authorization: authHeader },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
