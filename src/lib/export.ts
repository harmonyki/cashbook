import { Transaction } from "@/types/transaction";
import { categoryBreakdown, sumByType } from "@/lib/stats";

function csvCell(value: string | number): string {
  const s = String(value);
  // 쉼표/따옴표/줄바꿈이 있으면 따옴표로 감싸고 내부 따옴표는 escape
  if (/[",\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function csvRow(cells: (string | number)[]): string {
  return cells.map(csvCell).join(",");
}

/**
 * 선택한 달의 내역 + 카테고리 통계를 하나의 CSV 문자열로 만든다.
 * Excel에서 한글이 깨지지 않도록 UTF-8 BOM을 붙여 반환.
 */
export function buildMonthlyCsv(
  year: number,
  month: number,
  transactions: Transaction[]
): string {
  const income = sumByType(transactions, "income");
  const expense = sumByType(transactions, "expense");
  const balance = income - expense;

  const sorted = [...transactions].sort((a, b) =>
    a.date < b.date ? -1 : a.date > b.date ? 1 : 0
  );

  const lines: string[] = [];
  lines.push(csvRow([`${year}년 ${month}월 가계부 통계`]));
  lines.push("");

  // 요약
  lines.push(csvRow(["[ 요약 ]"]));
  lines.push(csvRow(["수입", income]));
  lines.push(csvRow(["지출", expense]));
  lines.push(csvRow(["잔액", balance]));
  lines.push("");

  // 지출 카테고리 통계
  lines.push(csvRow(["[ 지출 카테고리 통계 ]"]));
  lines.push(csvRow(["카테고리", "금액", "비율(%)"]));
  for (const s of categoryBreakdown(transactions, "expense")) {
    lines.push(csvRow([s.category, s.amount, (s.ratio * 100).toFixed(1)]));
  }
  lines.push("");

  // 수입 카테고리 통계
  lines.push(csvRow(["[ 수입 카테고리 통계 ]"]));
  lines.push(csvRow(["카테고리", "금액", "비율(%)"]));
  for (const s of categoryBreakdown(transactions, "income")) {
    lines.push(csvRow([s.category, s.amount, (s.ratio * 100).toFixed(1)]));
  }
  lines.push("");

  // 전체 내역
  lines.push(csvRow(["[ 전체 내역 ]"]));
  lines.push(csvRow(["날짜", "구분", "카테고리", "금액", "메모"]));
  for (const t of sorted) {
    lines.push(
      csvRow([
        t.date,
        t.type === "income" ? "수입" : "지출",
        t.category,
        t.amount,
        t.memo,
      ])
    );
  }

  return lines.join("\r\n");
}

/** 브라우저에서 CSV 파일 다운로드를 트리거 */
export function downloadCsv(filename: string, csv: string) {
  const BOM = "﻿"; // Excel 한글 깨짐 방지
  const blob = new Blob([BOM + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
