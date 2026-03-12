"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { exchangeCodeForTokens, setTokens } from "@/lib/auth";
import { ROUTES } from "@/lib/routes";

function CallbackHandler() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) {
      setError("인가 코드가 없습니다.");
      return;
    }

    // 인가 코드를 토큰으로 교환
    exchangeCodeForTokens(code).then((tokens) => {
      if (!tokens) {
        setError("토큰 교환에 실패했습니다.");
        return;
      }
      setTokens(tokens.accessToken, tokens.refreshToken);
      // hard navigation으로 AuthProvider 리마운트 → fetchCurrentUser() 실행
      window.location.href = ROUTES.HOME;
    });
  }, [searchParams]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-bold text-red-600">{error}</p>
          <button
            onClick={() => (window.location.href = ROUTES.HOME)}
            className="mt-4 text-sm text-brand underline"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 size-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
        <p className="text-sm text-slate-500">로그인 처리 중...</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="size-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
        </div>
      }
    >
      <CallbackHandler />
    </Suspense>
  );
}
