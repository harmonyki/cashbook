import { createClient } from "@supabase/supabase-js";

// PowerShell로 Vercel 환경변수를 설정하는 과정에서 값 앞에 BOM(U+FEFF) 같은
// non-ASCII 문자가 섞여 들어가면 apikey 헤더가 깨진다(HTTP 헤더는 Latin-1만 허용 →
// fetch 자체가 실패). createClient 에 넘기기 전에 인쇄 가능한 ASCII만 남긴다.
function asciiOnly(value: string | undefined): string | undefined {
  return value?.replace(/[^\x20-\x7e]/g, "").trim();
}

const supabaseUrl = asciiOnly(process.env.NEXT_PUBLIC_SUPABASE_URL);
const supabaseAnonKey = asciiOnly(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase 환경변수가 없습니다. .env.local 에 NEXT_PUBLIC_SUPABASE_URL 과 NEXT_PUBLIC_SUPABASE_ANON_KEY 를 설정하세요."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    // OAuth 리다이렉트로 돌아온 토큰은 AuthProvider에서 직접 처리한다.
    detectSessionInUrl: false,
  },
});
