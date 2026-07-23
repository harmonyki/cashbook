import { Transaction, TransactionType } from "@/types/transaction";

export interface CategoryStat {
  category: string;
  amount: number;
  ratio: number; // 0~1
}

/** 특정 타입(income/expense)의 카테고리별 합계를 큰 금액 순으로 반환 */
export function categoryBreakdown(
  transactions: Transaction[],
  type: TransactionType
): CategoryStat[] {
  const map = new Map<string, number>();
  let total = 0;
  for (const t of transactions) {
    if (t.type !== type) continue;
    map.set(t.category, (map.get(t.category) ?? 0) + t.amount);
    total += t.amount;
  }
  const stats: CategoryStat[] = [];
  for (const [category, amount] of map) {
    stats.push({ category, amount, ratio: total > 0 ? amount / total : 0 });
  }
  stats.sort((a, b) => b.amount - a.amount);
  return stats;
}

export function sumByType(
  transactions: Transaction[],
  type: TransactionType
): number {
  return transactions
    .filter((t) => t.type === type)
    .reduce((sum, t) => sum + t.amount, 0);
}

/** 도넛 차트용 세그먼트 (SVG stroke-dasharray 계산에 사용) */
export interface DonutSegment extends CategoryStat {
  color: string;
  offset: number; // 앞선 세그먼트들의 누적 비율 (0~1)
}
