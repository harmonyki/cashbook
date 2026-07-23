"use client";

import { useMemo, useState } from "react";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import SummaryCards from "@/components/SummaryCards";
import MonthSelector from "@/components/MonthSelector";
import StatsSection from "@/components/StatsSection";
import PiggyMascot from "@/components/PiggyMascot";
import { useSupabaseTransactions } from "@/lib/useSupabaseTransactions";
import { useAuth } from "@/lib/AuthProvider";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function Cashbook() {
  const { user, signOut } = useAuth();
  const { transactions, loading, error, addTransaction, deleteTransaction } =
    useSupabaseTransactions();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const monthPrefix = `${year}-${pad(month)}`;
  const monthTransactions = useMemo(
    () => transactions.filter((t) => t.date.startsWith(monthPrefix)),
    [transactions, monthPrefix]
  );

  const income = useMemo(
    () =>
      monthTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0),
    [monthTransactions]
  );
  const expense = useMemo(
    () =>
      monthTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0),
    [monthTransactions]
  );

  function goPrevMonth() {
    if (month === 1) {
      setYear((y) => y - 1);
      setMonth(12);
    } else {
      setMonth((m) => m - 1);
    }
  }

  function goNextMonth() {
    if (month === 12) {
      setYear((y) => y + 1);
      setMonth(1);
    } else {
      setMonth((m) => m + 1);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-5 px-4 py-8">
      <header className="relative flex flex-col items-center gap-1">
        <button
          type="button"
          onClick={signOut}
          className="absolute right-0 top-0 rounded-full bg-white/80 px-3 py-1.5 text-[11px] font-semibold text-pink-500 shadow-sm ring-1 ring-pink-100 transition hover:bg-pink-50"
        >
          로그아웃
        </button>
        <PiggyMascot size={92} className="animate-bob drop-shadow-sm" />
        <h1 className="text-2xl font-bold text-pink-600">핑크 가계부</h1>
        <p className="text-xs text-ink-soft">오늘도 알뜰하게 기록해요 🎀</p>
        {user?.email && (
          <p className="text-[11px] text-ink-soft/70">{user.email}</p>
        )}
      </header>

      <MonthSelector year={year} month={month} onPrev={goPrevMonth} onNext={goNextMonth} />

      <SummaryCards income={income} expense={expense} />

      <StatsSection
        year={year}
        month={month}
        transactions={monthTransactions}
        income={income}
        expense={expense}
      />

      <TransactionForm onAdd={addTransaction} />

      {error && (
        <p className="rounded-2xl bg-red-50 px-4 py-2 text-center text-xs text-red-500 ring-1 ring-red-100">
          저장소 연결에 문제가 있어요: {error}
        </p>
      )}

      <div className="animate-pop rounded-3xl bg-white/80 px-5 shadow-sm ring-1 ring-pink-100">
        {loading ? (
          <p className="py-8 text-center text-sm text-ink-soft/70">불러오는 중이에요… 🐷</p>
        ) : (
          <TransactionList transactions={monthTransactions} onDelete={deleteTransaction} />
        )}
      </div>

      <footer className="pb-2 pt-1 text-center text-[11px] text-ink-soft/70">
        ☁️ 내 정보는 클라우드에 안전하게 저장돼요
      </footer>
    </div>
  );
}
