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

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  signOut: async () => {},
});

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

// 모듈 로드 시점(React 렌더/라우터보다 이른)의 URL 해시를 캡처한다.
// 라우터가 해시를 지우기 전에 OAuth 토큰을 확보하기 위함.
const initialHash =
  typeof window !== "undefined" ? window.location.hash : "";

function dbg(msg: string) {
  try {
    sessionStorage.setItem("oauthdbg", msg);
  } catch {
    /* ignore */
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        if (initialHash.includes("access_token")) {
          const params = new URLSearchParams(initialHash.slice(1));
          const access_token = params.get("access_token");
          const refresh_token = params.get("refresh_token");
          dbg(`detected at=${access_token ? access_token.length : 0} rt=${refresh_token ? "y" : "n"}`);
          if (access_token && refresh_token) {
            const { data, error } = await supabase.auth.setSession({
              access_token,
              refresh_token,
            });
            dbg(
              `setSession err=${error ? error.message : "none"} user=${data?.user?.email ?? "null"}`
            );
          }
          // 주소창에서 토큰 제거
          if (window.location.hash) {
            window.history.replaceState(
              null,
              "",
              window.location.pathname + window.location.search
            );
          }
        } else {
          dbg(`no-hash len=${initialHash.length}`);
        }
      } catch (e) {
        dbg("EXC " + (e as Error).message);
      }

      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
      setLoading(false);
    }

    init();

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
