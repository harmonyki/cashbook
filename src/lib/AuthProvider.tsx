"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      // OAuth(구글) 리다이렉트로 돌아오면 URL 해시에 토큰이 담겨 있다.
      // 이 환경에서는 라이브러리 자동 감지가 동작하지 않아 직접 세션을 설정한다.
      if (typeof window !== "undefined" && window.location.hash.includes("access_token")) {
        const params = new URLSearchParams(window.location.hash.slice(1));
        const access_token = params.get("access_token");
        const refresh_token = params.get("refresh_token");
        if (access_token && refresh_token) {
          await supabase.auth.setSession({ access_token, refresh_token });
        }
        // 주소창에서 토큰 제거 (뒤로가기/새로고침 시 지저분해지지 않게)
        window.history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search
        );
      }

      // 새로고침 시 기존 세션 복원
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
      setLoading(false);
    }

    init();

    // 로그인/로그아웃 등 상태 변화 구독
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
