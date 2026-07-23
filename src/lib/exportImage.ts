import { Transaction, categoryColor, categoryEmoji } from "@/types/transaction";
import { formatCurrency } from "@/lib/format";
import { categoryBreakdown } from "@/lib/stats";

const FONT = "'Apple SD Gothic Neo', 'Malgun Gothic', 'Segoe UI', sans-serif";

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

/**
 * 선택한 달의 통계를 핑크 리포트 카드 PNG로 그려 다운로드한다.
 * 외부 라이브러리 없이 Canvas 2D로 직접 렌더링.
 */
export function downloadStatsImage(
  year: number,
  month: number,
  transactions: Transaction[],
  income: number,
  expense: number
) {
  const balance = income - expense;
  const expenseStats = categoryBreakdown(transactions, "expense");
  const numCats = expenseStats.length;

  const W = 760;
  const pad = 40;

  // 레이아웃 세로 위치 계산
  const donutCenterY = 540;
  const donutBottom = donutCenterY + 114;
  const legendBlockH = numCats * 34;
  const legendBottom = donutCenterY - legendBlockH / 2 + legendBlockH;
  const donutSectionBottom = numCats > 0 ? Math.max(donutBottom, legendBottom) : 470;
  const footerY = donutSectionBottom + 50;
  const H = footerY + 34;

  const scale = 2; // 레티나 선명도
  const canvas = document.createElement("canvas");
  canvas.width = W * scale;
  canvas.height = H * scale;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.scale(scale, scale);

  // ── 배경 (핑크 그라데이션) ──
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#ffe7f1");
  bg.addColorStop(0.5, "#fff5f9");
  bg.addColorStop(1, "#ffe7f1");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // 안쪽 흰 카드
  ctx.fillStyle = "rgba(255,255,255,0.75)";
  roundRect(ctx, 20, 20, W - 40, H - 40, 28);
  ctx.fill();

  ctx.textBaseline = "alphabetic";

  // ── 헤더 ──
  ctx.textAlign = "center";
  ctx.fillStyle = "#f43f85";
  ctx.font = `bold 34px ${FONT}`;
  ctx.fillText(`🎀 ${year}년 ${month}월 통계`, W / 2, 74);
  ctx.fillStyle = "#a988a0";
  ctx.font = `16px ${FONT}`;
  ctx.fillText("핑크 가계부 리포트", W / 2, 100);

  // ── 요약 3칸 ──
  const gap = 16;
  const boxW = (W - 2 * pad - 2 * gap) / 3;
  const boxY = 128;
  const boxH = 92;
  const summary: { label: string; value: number; color: string; fill: string }[] = [
    { label: "💗 수입", value: income, color: "#3aa0e8", fill: "#eaf4ff" },
    { label: "🎀 지출", value: expense, color: "#f43f85", fill: "#ffe7f1" },
    { label: "🐷 잔액", value: balance, color: "#ffffff", fill: "#ff6fa5" },
  ];
  summary.forEach((s, i) => {
    const x = pad + i * (boxW + gap);
    ctx.fillStyle = s.fill;
    roundRect(ctx, x, boxY, boxW, boxH, 18);
    ctx.fill();
    ctx.textAlign = "center";
    ctx.fillStyle = i === 2 ? "rgba(255,255,255,0.9)" : "#a988a0";
    ctx.font = `15px ${FONT}`;
    ctx.fillText(s.label, x + boxW / 2, boxY + 34);
    ctx.fillStyle = s.color;
    ctx.font = `bold 22px ${FONT}`;
    ctx.fillText(formatCurrency(s.value), x + boxW / 2, boxY + 66);
  });

  // ── 수입 vs 지출 막대 ──
  const maxBar = Math.max(income, expense, 1);
  const barLabelX = pad;
  const barX = pad + 70;
  const barValW = 150;
  const barW = W - pad - barValW - barX;
  const bars = [
    { label: "💗 수입", value: income, color: "#8ec5ff" },
    { label: "🎀 지출", value: expense, color: "#ff5c96" },
  ];
  bars.forEach((b, i) => {
    const by = 258 + i * 42;
    const bh = 26;
    ctx.textAlign = "left";
    ctx.fillStyle = "#a988a0";
    ctx.font = `14px ${FONT}`;
    ctx.fillText(b.label, barLabelX, by + 18);
    // 트랙
    ctx.fillStyle = "#ffe0ec";
    roundRect(ctx, barX, by, barW, bh, 13);
    ctx.fill();
    // 채움
    const fw = Math.max((b.value / maxBar) * barW, b.value > 0 ? 8 : 0);
    if (fw > 0) {
      ctx.fillStyle = b.color;
      roundRect(ctx, barX, by, fw, bh, 13);
      ctx.fill();
    }
    ctx.textAlign = "right";
    ctx.fillStyle = "#6b4a5a";
    ctx.font = `bold 15px ${FONT}`;
    ctx.fillText(formatCurrency(b.value), W - pad, by + 18);
  });

  // ── 지출 카테고리 도넛 + 범례 ──
  ctx.textAlign = "left";
  ctx.fillStyle = "#6b4a5a";
  ctx.font = `bold 18px ${FONT}`;
  ctx.fillText("📊 지출 카테고리", pad, 400);

  if (numCats === 0) {
    ctx.fillStyle = "#a988a0";
    ctx.font = `16px ${FONT}`;
    ctx.fillText("지출 내역이 없어요 🩷", pad, 440);
  } else {
    const cx = 195;
    const cy = donutCenterY;
    const r = 92;
    ctx.lineWidth = 44;
    ctx.lineCap = "butt";
    // 배경 링
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = "#ffe7f1";
    ctx.stroke();
    // 세그먼트
    let a = -Math.PI / 2;
    for (const s of expenseStats) {
      const end = a + s.ratio * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(cx, cy, r, a, end);
      ctx.strokeStyle = categoryColor(s.category);
      ctx.stroke();
      a = end;
    }
    // 중앙 텍스트
    ctx.textAlign = "center";
    ctx.fillStyle = "#a988a0";
    ctx.font = `13px ${FONT}`;
    ctx.fillText("총 지출", cx, cy - 6);
    ctx.fillStyle = "#f43f85";
    ctx.font = `bold 20px ${FONT}`;
    ctx.fillText(formatCurrency(expense), cx, cy + 20);

    // 범례
    const legX = 360;
    let ly = cy - legendBlockH / 2 + 22;
    for (const s of expenseStats) {
      ctx.fillStyle = categoryColor(s.category);
      ctx.beginPath();
      ctx.arc(legX + 7, ly - 5, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.textAlign = "left";
      ctx.fillStyle = "#6b4a5a";
      ctx.font = `16px ${FONT}`;
      ctx.fillText(`${categoryEmoji(s.category)} ${s.category}`, legX + 24, ly);
      ctx.textAlign = "right";
      ctx.fillStyle = "#a988a0";
      ctx.font = `bold 16px ${FONT}`;
      ctx.fillText(`${Math.round(s.ratio * 100)}%`, W - pad, ly);
      ly += 34;
    }
  }

  // ── 푸터 ──
  ctx.textAlign = "center";
  ctx.fillStyle = "#c99bb4";
  ctx.font = `14px ${FONT}`;
  ctx.fillText("🐷 핑크 가계부 · cashbook-amber.vercel.app", W / 2, footerY);

  // ── 다운로드 ──
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `가계부_${year}-${String(month).padStart(2, "0")}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, "image/png");
}
