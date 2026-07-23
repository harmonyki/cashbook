import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase 환경변수가 없습니다. .env.local 에 NEXT_PUBLIC_SUPABASE_URL 과 NEXT_PUBLIC_SUPABASE_ANON_KEY 를 설정하세요."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    // OAuth 리다이렉트로 돌아온 토큰(#access_token=...)은 AuthProvider에서 직접 처리한다.
    // 이 환경에서 라이브러리 자동 감지(detectSessionInUrl)가 동작하지 않아 수동 처리로 대체.
    detectSessionInUrl: false,
  },
});
