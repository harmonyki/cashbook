"use client";

import Cashbook from "@/components/Cashbook";
import LoginScreen from "@/components/LoginScreen";
import PiggyMascot from "@/components/PiggyMascot";
import { useAuth } from "@/lib/AuthProvider";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 text-ink-soft/70">
        <PiggyMascot size={72} className="animate-bob" />
        <p className="text-sm">불러오는 중이에요… 🐷</p>
      </div>
    );
  }

  return user ? <Cashbook /> : <LoginScreen />;
}
