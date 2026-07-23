"use client";

import { useState, FormEvent } from "react";
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  Transaction,
  TransactionType,
} from "@/types/transaction";
import { todayString } from "@/lib/format";

interface Props {
  onAdd: (transaction: Transaction) => void;
}

export default function TransactionForm({ onAdd }: Props) {
  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [memo, setMemo] = useState("");
  const [date, setDate] = useState(todayString());

  const categories = type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  function handleTypeChange(nextType: TransactionType) {
    setType(nextType);
    setCategory(nextType === "expense" ? EXPENSE_CATEGORIES[0] : INCOME_CATEGORIES[0]);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = Number(amount);
    if (!parsed || parsed <= 0) return;

    onAdd({
      id: crypto.randomUUID(),
      type,
      amount: parsed,
      category,
      memo: memo.trim(),
      date,
    });

    setAmount("");
    setMemo("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-zinc-900"
    >
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => handleTypeChange("expense")}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
            type === "expense"
              ? "bg-red-500 text-white"
              : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
          }`}
        >
          지출
        </button>
        <button
          type="button"
          onClick={() => handleTypeChange("income")}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
            type === "income"
              ? "bg-blue-500 text-white"
              : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
          }`}
        >
          수입
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-zinc-500">날짜</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/10"
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-zinc-500">분류</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/10"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-zinc-500">금액</label>
        <input
          type="number"
          inputMode="numeric"
          min={1}
          placeholder="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/10"
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-zinc-500">메모</label>
        <input
          type="text"
          placeholder="메모 (선택)"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          className="rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/10"
        />
      </div>

      <button
        type="submit"
        className="rounded-lg bg-zinc-900 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        추가하기
      </button>
    </form>
  );
}
