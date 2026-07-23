import { Transaction, categoryEmoji } from "@/types/transaction";
import { formatCurrency } from "@/lib/format";

interface Props {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export default function TransactionList({ transactions, onDelete }: Props) {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-12 text-center">
        <span className="text-4xl">🐷</span>
        <p className="text-sm text-ink-soft">아직 이번 달 내역이 없어요!</p>
        <p className="text-xs text-ink-soft/70">위에서 첫 내역을 추가해 보세요 ✨</p>
      </div>
    );
  }

  const sorted = [...transactions].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <ul className="flex flex-col divide-y divide-pink-100">
      {sorted.map((t) => (
        <li key={t.id} className="flex items-center justify-between gap-3 py-3">
          <div className="flex items-center gap-3">
            <span
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-pink-100 text-lg"
              aria-hidden
            >
              {categoryEmoji(t.category)}
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-ink">
                {t.category}
                {t.memo && (
                  <span className="ml-2 text-xs font-normal text-ink-soft">
                    {t.memo}
                  </span>
                )}
              </span>
              <span className="text-xs text-ink-soft/80">{t.date}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-bold ${
                t.type === "income" ? "text-sky-500" : "text-pink-500"
              }`}
            >
              {t.type === "income" ? "+" : "-"}
              {formatCurrency(t.amount)}
            </span>
            <button
              onClick={() => onDelete(t.id)}
              className="grid h-6 w-6 place-items-center rounded-full text-xs text-pink-300 transition hover:bg-pink-100 hover:text-pink-500"
              aria-label="삭제"
              title="삭제"
            >
              ✕
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
