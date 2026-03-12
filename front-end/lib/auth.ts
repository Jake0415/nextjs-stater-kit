/**
 * SSO 인증 유틸리티
 * MHSSO (OAuth2 Authorization Code Flow) 연동
 */

const SSO_URL = process.env.NEXT_PUBLIC_SSO_URL || "http://localhost:3001";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// 쿠키 키
const ACCESS_TOKEN_KEY = "mh_access_token";
const REFRESH_TOKEN_KEY = "mh_refresh_token";

// SSO 사용자 정보 타입
export interface SSOUser {
  id: string;
  email: string;
  name: string;
  role: "SUPER_ADMIN" | "ADMIN" | "USER";
  profileImage: string | null;
}

// --- 쿠키 유틸리티 ---

/** 쿠키에서 값 읽기 */
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

/** 쿠키에 값 저장 */
function setCookie(name: string, value: string, maxAgeSec: number) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSec}; SameSite=Lax`;
}

/** 쿠키 삭제 */
function deleteCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0`;
}

// --- 토큰 관리 ---

/** Access Token 읽기 */
export function getAccessToken(): string | null {
  return getCookie(ACCESS_TOKEN_KEY);
}

/** Refresh Token 읽기 */
export function getRefreshToken(): string | null {
  return getCookie(REFRESH_TOKEN_KEY);
}

/** 토큰 저장 (Access: 15분, Refresh: 7일) */
export function setTokens(accessToken: string, refreshToken: string) {
  setCookie(ACCESS_TOKEN_KEY, accessToken, 15 * 60);
  setCookie(REFRESH_TOKEN_KEY, refreshToken, 7 * 24 * 60 * 60);
}

/** 토큰 제거 */
export function clearTokens() {
  deleteCookie(ACCESS_TOKEN_KEY);
  deleteCookie(REFRESH_TOKEN_KEY);
}

// --- SSO 리다이렉트 ---

/** MHSSO 로그인 페이지로 리다이렉트 */
export function getSSoAuthorizeUrl(): string {
  const callbackUrl = `${APP_URL}/auth/callback`;
  return `${SSO_URL}/api/auth/authorize?redirect_url=${encodeURIComponent(callbackUrl)}`;
}

/** SSO 로그인 페이지로 이동 */
export function redirectToSSO() {
  window.location.href = getSSoAuthorizeUrl();
}

// --- API 호출 ---

/** 인가 코드를 토큰으로 교환 (로컬 프록시 경유) */
export async function exchangeCodeForTokens(
  code: string
): Promise<{ accessToken: string; refreshToken: string } | null> {
  try {
    const res = await fetch("/api/auth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    if (!res.ok) return null;

    const json = await res.json();
    if (!json.success) return null;

    return {
      accessToken: json.data.accessToken,
      refreshToken: json.data.refreshToken,
    };
  } catch {
    return null;
  }
}

/** Refresh Token으로 Access Token 갱신 */
export async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const res = await fetch("/api/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return false;

    const json = await res.json();
    if (!json.success) return false;

    setTokens(json.data.accessToken, json.data.refreshToken);
    return true;
  } catch {
    return false;
  }
}

/** 현재 사용자 정보 조회 */
export async function fetchCurrentUser(): Promise<SSOUser | null> {
  const token = getAccessToken();
  if (!token) return null;

  try {
    const res = await fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      // 토큰 만료 시 갱신 시도
      if (res.status === 401) {
        const refreshed = await refreshAccessToken();
        if (refreshed) return fetchCurrentUser();
      }
      return null;
    }

    const json = await res.json();
    if (!json.success) return null;

    return {
      id: json.data.id,
      email: json.data.email,
      name: json.data.name,
      role: json.data.role,
      profileImage: json.data.profileImage
        ? json.data.profileImage.startsWith("http")
          ? json.data.profileImage
          : `${SSO_URL}${json.data.profileImage}`
        : null,
    };
  } catch {
    return null;
  }
}

/** 로그아웃 */
export async function logout() {
  const token = getAccessToken();
  if (token) {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      // 로그아웃 API 실패해도 로컬 토큰은 제거
    }
  }
  clearTokens();
}

// --- 미들웨어용 상수 (서버 사이드) ---
export const AUTH_COOKIE_NAME = ACCESS_TOKEN_KEY;
export const SSO_AUTHORIZE_URL = `${SSO_URL}/api/auth/authorize`;
export const AUTH_CALLBACK_PATH = "/auth/callback";
