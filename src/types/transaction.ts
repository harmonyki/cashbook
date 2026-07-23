export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  memo: string;
  date: string; // YYYY-MM-DD
}

export const EXPENSE_CATEGORIES = [
  "식비",
  "교통",
  "주거",
  "문화생활",
  "의료",
  "쇼핑",
  "기타",
];

export const INCOME_CATEGORIES = ["급여", "용돈", "부수입", "기타"];

/** 카테고리별 귀여운 이모지 */
export const CATEGORY_EMOJI: Record<string, string> = {
  식비: "🍰",
  교통: "🚌",
  주거: "🏠",
  문화생활: "🎬",
  의료: "💊",
  쇼핑: "🛍️",
  급여: "💼",
  용돈: "🎁",
  부수입: "🍀",
  기타: "🧸",
};

export function categoryEmoji(category: string): string {
  return CATEGORY_EMOJI[category] ?? "🧸";
}

/** 지출 카테고리별 도넛 차트 색상 (핑크 계열 + 파스텔 포인트) */
export const CATEGORY_COLORS: Record<string, string> = {
  식비: "#ff85b0",
  교통: "#8ec5ff",
  주거: "#c9b6ff",
  문화생활: "#ffd98a",
  의료: "#7fd8c3",
  쇼핑: "#ff5c96",
  기타: "#ffb0cd",
};

export function categoryColor(category: string): string {
  return CATEGORY_COLORS[category] ?? "#ffb0cd";
}
