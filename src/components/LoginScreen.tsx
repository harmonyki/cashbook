"use client";

import { useState, FormEvent } from "react";
import { supabase } from "@/lib/supabaseClient";
import PiggyMascot from "@/components/PiggyMascot";

type Mode = "signin" | "signup";

const inputClass =
  "w-full rounded-xl border border-pink-200 bg-white/90 px-3 py-2.5 text-sm text-ink outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-200";

/** 자주 나오는 Supabase 인증 에러를 한국어로 안내 */
function toKorean(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials"))
    return "이메일 또는 비밀번호가 올바르지 않아요.";
  if (m.includes("user already registered"))
    return "이미 가입된 이메일이에요. 로그인해 주세요.";
  if (m.includes("password should be at least"))
    return "비밀번호는 6자 이상이어야 해요.";
  if (m.includes("unable to validate email") || m.includes("invalid email"))
    return "이메일 형식을 확인해 주세요.";
  if (m.includes("email not confirmed"))
    return "아직 이메일 인증이 안 됐어요. 메일함의 확인 링크를 눌러 주세요.";
  return message;
}

export default function LoginScreen() {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setInfo(null);

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(toKorean(error.message));
      } else if (!data.session) {
        // 이메일 인증이 켜져 있는 경우: 세션이 바로 생기지 않음
        setInfo("확인 메일을 보냈어요! 메일함에서 링크를 눌러 가입을 완료해 주세요 💌");
      }
      // 세션이 생기면 AuthProvider가 자동으로 로그인 처리
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(toKorean(error.message));
    }

    setBusy(false);
  }

  function switchMode(next: Mode) {
    setMode(next);
    setError(null);
    setInfo(null);
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 px-6 py-10">
      <header className="flex flex-col items-center gap-2">
        <PiggyMascot size={88} className="animate-bob drop-shadow-sm" />
        <h1 className="text-2xl font-bold text-pink-600">핑크 가계부</h1>
        <p className="text-xs text-ink-soft">
          {mode === "signin" ? "다시 만나서 반가워요 🎀" : "함께 알뜰하게 시작해요 🎀"}
        </p>
      </header>

      <div className="flex gap-2 rounded-2xl bg-pink-100/70 p-1">
        <button
          type="button"
          onClick={() => switchMode("signin")}
          className={`flex-1 rounded-xl py-2 text-sm font-semibold transition ${
            mode === "signin"
              ? "bg-pink-500 text-white shadow"
              : "text-ink-soft hover:text-pink-500"
          }`}
        >
          로그인
        </button>
        <button
          type="button"
          onClick={() => switchMode("signup")}
          className={`flex-1 rounded-xl py-2 text-sm font-semibold transition ${
            mode === "signup"
              ? "bg-pink-500 text-white shadow"
              : "text-ink-soft hover:text-pink-500"
          }`}
        >
          회원가입
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 rounded-3xl bg-white/80 p-5 shadow-sm ring-1 ring-pink-100"
      >
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-ink-soft">이메일</label>
          <input
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-ink-soft">비밀번호</label>
          <input
            type="password"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            placeholder="6자 이상"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            minLength={6}
            required
          />
        </div>

        {error && (
          <p className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-500 ring-1 ring-red-100">
            {error}
          </p>
        )}
        {info && (
          <p className="rounded-xl bg-pink-50 px-3 py-2 text-xs text-pink-600 ring-1 ring-pink-100">
            {info}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="mt-1 rounded-2xl bg-gradient-to-r from-pink-400 to-pink-500 py-3 text-sm font-bold text-white shadow-md transition hover:brightness-105 active:scale-[0.99] disabled:opacity-60"
        >
          {busy ? "잠시만요…" : mode === "signin" ? "로그인 하기 ✨" : "가입 하기 ✨"}
        </button>
      </form>

      <p className="text-center text-[11px] text-ink-soft/70">
        ☁️ 내 가계부는 나만 볼 수 있어요
      </p>
    </div>
  );
}
