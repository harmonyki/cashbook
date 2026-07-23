"use client";

import { Transaction, categoryColor, categoryEmoji } from "@/types/transaction";
import { formatCurrency } from "@/lib/format";
import { categoryBreakdown } from "@/lib/stats";
import { buildMonthlyCsv, downloadCsv } from "@/lib/export";
import { downloadStatsImage } from "@/lib/exportImage";

interface Props {
  year: number;
  month: number;
  transactions: Transaction[];
  income: number;
  expense: number;
}

const RADIUS = 52;
const CIRC = 2 * Math.PI * RADIUS;

export default function StatsSection({
  year,
  month,
  transactions,
  income,
  expense,
}: Props) {
  const expenseStats = categoryBreakdown(transactions, "expense");
  const hasData = transactions.length > 0;

  function handleDownload() {
    const csv = buildMonthlyCsv(year, month, transactions);
    downloadCsv(`가계부_${year}-${String(month).padStart(2, "0")}.csv`, csv);
  }

  function handleDownloadImage() {
    downloadStatsImage(year, month, transactions, income, expense);
  }

  // 도넛 세그먼트 누적 offset 계산
  let acc = 0;
  const segments = expenseStats.map((s) => {
    const seg = { ...s, color: categoryColor(s.category), offset: acc };
    acc += s.ratio;
    return seg;
  });

  const maxBar = Math.max(income, expense, 1);

  return (
    <section className="flex flex-col gap-4 rounded-3xl bg-white/80 p-5 shadow-sm ring-1 ring-pink-100">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-1.5 text-base font-bold text-ink">
          📊 이번 달 통계
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handleDownloadImage}
            disabled={!hasData}
            className="rounded-full bg-pink-500 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-40"
            title="이번 달 통계를 이미지(PNG)로 저장"
          >
            🖼 이미지 저장
          </button>
          <button
            onClick={handleDownload}
            disabled={!hasData}
            className="rounded-full bg-pink-100 px-3 py-1.5 text-xs font-bold text-pink-600 transition hover:bg-pink-200 disabled:cursor-not-allowed disabled:opacity-40"
            title="이번 달 통계를 CSV 파일로 저장"
          >
            ⬇ CSV
          </button>
        </div>
      </div>

      {!hasData ? (
        <p className="py-8 text-center text-sm text-ink-soft">
          내역을 추가하면 귀여운 그래프가 나타나요! 🩷
        </p>
      ) : (
        <>
          {/* 수입 vs 지출 막대 */}
          <div className="flex flex-col gap-2.5">
            <BarRow
              label="💗 수입"
              value={income}
              max={maxBar}
              color="var(--sky)"
            />
            <BarRow
              label="🎀 지출"
              value={expense}
              max={maxBar}
              color="var(--pink-500)"
            />
          </div>

          {/* 지출 카테고리 도넛 */}
          {segments.length > 0 && (
            <div className="mt-1 flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-center">
              <div className="relative shrink-0">
                <svg width="150" height="150" viewBox="0 0 150 150">
                  <circle
                    cx="75"
                    cy="75"
                    r={RADIUS}
                    fill="none"
                    stroke="#ffe7f1"
                    strokeWidth="20"
                  />
                  {segments.map((s) => (
                    <circle
                      key={s.category}
                      cx="75"
                      cy="75"
                      r={RADIUS}
                      fill="none"
                      stroke={s.color}
                      strokeWidth="20"
                      strokeDasharray={`${s.ratio * CIRC} ${CIRC}`}
                      strokeDashoffset={-s.offset * CIRC}
                      transform="rotate(-90 75 75)"
                      strokeLinecap="butt"
                    />
                  ))}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[10px] text-ink-soft">총 지출</span>
                  <span className="text-sm font-bold text-pink-600">
                    {formatCurrency(expense)}
                  </span>
                </div>
              </div>

              {/* 범례 */}
              <ul className="flex w-full flex-col gap-1.5 sm:max-w-[180px]">
                {segments.map((s) => (
                  <li
                    key={s.category}
                    className="flex items-center justify-between gap-2 text-xs"
                  >
                    <span className="flex items-center gap-1.5 text-ink">
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-full"
                        style={{ background: s.color }}
                      />
                      {categoryEmoji(s.category)} {s.category}
                    </span>
                    <span className="font-semibold text-ink-soft">
                      {Math.round(s.ratio * 100)}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </section>
  );
}

function BarRow({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  const pct = Math.max((value / max) * 100, value > 0 ? 4 : 0);
  return (
    <div className="flex items-center gap-3">
      <span className="w-14 shrink-0 text-xs font-medium text-ink-soft">
        {label}
      </span>
      <div className="h-5 flex-1 overflow-hidden rounded-full bg-pink-100/70">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="w-24 shrink-0 text-right text-xs font-bold text-ink">
        {formatCurrency(value)}
      </span>
    </div>
  );
}
