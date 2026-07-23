interface Props {
  year: number;
  month: number;
  onPrev: () => void;
  onNext: () => void;
}

export default function MonthSelector({ year, month, onPrev, onNext }: Props) {
  return (
    <div className="flex items-center justify-center gap-4">
      <button
        onClick={onPrev}
        className="rounded-full px-3 py-1 text-lg text-zinc-500 hover:bg-black/5 dark:hover:bg-white/10"
        aria-label="이전 달"
      >
        ‹
      </button>
      <p className="w-32 text-center text-base font-semibold">
        {year}년 {month}월
      </p>
      <button
        onClick={onNext}
        className="rounded-full px-3 py-1 text-lg text-zinc-500 hover:bg-black/5 dark:hover:bg-white/10"
        aria-label="다음 달"
      >
        ›
      </button>
    </div>
  );
}
