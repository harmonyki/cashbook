import { formatCurrency } from "@/lib/format";

interface Props {
  income: number;
  expense: number;
}

export default function SummaryCards({ income, expense }: Props) {
  const balance = income - expense;

  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900">
        <p className="text-xs text-zinc-500">수입</p>
        <p className="mt-1 text-lg font-semibold text-blue-500">
          {formatCurrency(income)}
        </p>
      </div>
      <div className="rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900">
        <p className="text-xs text-zinc-500">지출</p>
        <p className="mt-1 text-lg font-semibold text-red-500">
          {formatCurrency(expense)}
        </p>
      </div>
      <div className="rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900">
        <p className="text-xs text-zinc-500">잔액</p>
        <p
          className={`mt-1 text-lg font-semibold ${
            balance >= 0 ? "text-zinc-900 dark:text-zinc-50" : "text-red-500"
          }`}
        >
          {formatCurrency(balance)}
        </p>
      </div>
    </div>
  );
}
