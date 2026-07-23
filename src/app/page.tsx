"use client";

import { useMemo, useState } from "react";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import SummaryCards from "@/components/SummaryCards";
import MonthSelector from "@/components/MonthSelector";
import { useLocalTransactions } from "@/lib/useLocalTransactions";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function Home() {
  const { transactions, addTransaction, deleteTransaction } = useLocalTransactions();
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
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-4 py-8">
      <h1 className="text-center text-2xl font-bold">가계부</h1>

      <MonthSelector year={year} month={month} onPrev={goPrevMonth} onNext={goNextMonth} />

      <SummaryCards income={income} expense={expense} />

      <TransactionForm onAdd={addTransaction} />

      <div className="rounded-xl border border-black/10 bg-white px-5 dark:border-white/10 dark:bg-zinc-900">
        <TransactionList transactions={monthTransactions} onDelete={deleteTransaction} />
      </div>
    </div>
  );
}
