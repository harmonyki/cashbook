"use client";

import { useState, FormEvent } from "react";
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  Transaction,
  TransactionType,
  categoryEmoji,
} from "@/types/transaction";
import { todayString } from "@/lib/format";

interface Props {
  onAdd: (transaction: Transaction) => void;
}

const inputClass =
  "rounded-xl border border-pink-200 bg-white/90 px-3 py-2 text-sm text-ink outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-200";
const labelClass = "text-xs font-medium text-ink-soft";

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
      className="flex flex-col gap-4 rounded-3xl bg-white/80 p-5 shadow-sm ring-1 ring-pink-100"
    >
      <div className="flex gap-2 rounded-2xl bg-pink-100/70 p-1">
        <button
          type="button"
          onClick={() => handleTypeChange("expense")}
          className={`flex-1 rounded-xl py-2 text-sm font-semibold transition ${
            type === "expense"
              ? "bg-pink-500 text-white shadow"
              : "text-ink-soft hover:text-pink-500"
          }`}
        >
          🎀 지출
        </button>
        <button
          type="button"
          onClick={() => handleTypeChange("income")}
          className={`flex-1 rounded-xl py-2 text-sm font-semibold transition ${
            type === "income"
              ? "bg-sky-400 text-white shadow"
              : "text-ink-soft hover:text-sky-500"
          }`}
        >
          💗 수입
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className={labelClass}>날짜</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputClass}
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className={labelClass}>분류</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputClass}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {categoryEmoji(c)} {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className={labelClass}>금액</label>
        <div className="relative">
          <input
            type="number"
            inputMode="numeric"
            min={1}
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={`${inputClass} w-full pr-8`}
            required
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-ink-soft">
            원
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className={labelClass}>메모</label>
        <input
          type="text"
          placeholder="메모 (선택)"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        className="rounded-2xl bg-gradient-to-r from-pink-400 to-pink-500 py-3 text-sm font-bold text-white shadow-md transition hover:brightness-105 active:scale-[0.99]"
      >
        추가하기 ✨
      </button>
    </form>
  );
}
