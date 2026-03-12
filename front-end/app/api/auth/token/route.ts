import { NextRequest, NextResponse } from "next/server";

const SSO_URL = process.env.NEXT_PUBLIC_SSO_URL || "http://localhost:3001";

/** MHSSO 토큰 교환 프록시 (CORS 우회) */
export async function POST(request: NextRequest) {
  const body = await request.json();

  const res = await fetch(`${SSO_URL}/api/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
