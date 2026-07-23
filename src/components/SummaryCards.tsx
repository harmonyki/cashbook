import { formatCurrency } from "@/lib/format";

interface Props {
  income: number;
  expense: number;
}

export default function SummaryCards({ income, expense }: Props) {
  const balance = income - expense;

  return (
    <div className="grid grid-cols-3 gap-2.5">
      <div className="rounded-2xl bg-white/80 p-3.5 text-center shadow-sm ring-1 ring-pink-100">
        <p className="text-xs text-ink-soft">💗 수입</p>
        <p className="mt-1 text-sm font-bold text-sky-500 sm:text-base">
          {formatCurrency(income)}
        </p>
      </div>
      <div className="rounded-2xl bg-white/80 p-3.5 text-center shadow-sm ring-1 ring-pink-100">
        <p className="text-xs text-ink-soft">🎀 지출</p>
        <p className="mt-1 text-sm font-bold text-pink-500 sm:text-base">
          {formatCurrency(expense)}
        </p>
      </div>
      <div className="rounded-2xl bg-gradient-to-b from-pink-400 to-pink-500 p-3.5 text-center shadow-md">
        <p className="text-xs text-white/90">🐷 잔액</p>
        <p className="mt-1 text-sm font-bold text-white sm:text-base">
          {formatCurrency(balance)}
        </p>
      </div>
    </div>
  );
}
