import { Transaction } from "@/types/transaction";
import { formatCurrency } from "@/lib/format";

interface Props {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export default function TransactionList({ transactions, onDelete }: Props) {
  if (transactions.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-zinc-400">
        이번 달 내역이 없습니다.
      </p>
    );
  }

  const sorted = [...transactions].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <ul className="flex flex-col divide-y divide-black/5 dark:divide-white/10">
      {sorted.map((t) => (
        <li key={t.id} className="flex items-center justify-between gap-3 py-3">
          <div className="flex flex-col">
            <span className="text-xs text-zinc-400">{t.date}</span>
            <span className="text-sm font-medium">
              {t.category}
              {t.memo && (
                <span className="ml-2 font-normal text-zinc-400">{t.memo}</span>
              )}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`text-sm font-semibold ${
                t.type === "income" ? "text-blue-500" : "text-red-500"
              }`}
            >
              {t.type === "income" ? "+" : "-"}
              {formatCurrency(t.amount)}
            </span>
            <button
              onClick={() => onDelete(t.id)}
              className="text-xs text-zinc-400 hover:text-red-500"
              aria-label="삭제"
            >
              삭제
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
