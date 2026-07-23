interface Props {
  year: number;
  month: number;
  onPrev: () => void;
  onNext: () => void;
}

export default function MonthSelector({ year, month, onPrev, onNext }: Props) {
  return (
    <div className="flex items-center justify-center gap-3">
      <button
        onClick={onPrev}
        className="grid h-9 w-9 place-items-center rounded-full bg-white/80 text-lg text-pink-500 shadow-sm ring-1 ring-pink-200 transition hover:bg-pink-100 active:scale-95"
        aria-label="이전 달"
      >
        ‹
      </button>
      <p className="min-w-36 rounded-full bg-white/70 px-5 py-1.5 text-center text-base font-semibold text-ink ring-1 ring-pink-200">
        {year}년 {month}월
      </p>
      <button
        onClick={onNext}
        className="grid h-9 w-9 place-items-center rounded-full bg-white/80 text-lg text-pink-500 shadow-sm ring-1 ring-pink-200 transition hover:bg-pink-100 active:scale-95"
        aria-label="다음 달"
      >
        ›
      </button>
    </div>
  );
}
