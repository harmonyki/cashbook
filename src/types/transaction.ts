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
