"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type { SSOUser } from "@/lib/auth";
import {
  fetchCurrentUser,
  logout as authLogout,
  getAccessToken,
  getSSoAuthorizeUrl,
} from "@/lib/auth";

interface AuthContextValue {
  user: SSOUser | null;
  isLoading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
  logout: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SSOUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    fetchCurrentUser()
      .then((u) => setUser(u))
      .finally(() => setIsLoading(false));
  }, []);

  const handleLogout = useCallback(async () => {
    await authLogout();
    setUser(null);
    // MHSSO 로그인 페이지로 이동

    window.location.href = getSSoAuthorizeUrl();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, logout: handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
