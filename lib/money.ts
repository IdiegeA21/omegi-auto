/** Naira formatting helpers. The ₦ glyph is drawn by <Money/> in the UI; plain strings are for messages and labels. */

const group = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const trim = (n: number, dp: number) => parseFloat(n.toFixed(dp)).toString();

/** 20400000 -> "20.4M", 268000000 -> "268M", 1500000000 -> "1.5B", 850000 -> "850K". No currency symbol. */
export function compactNumber(n: number): string {
  const a = Math.abs(n);
  if (a >= 1e9) return `${trim(n / 1e9, 2)}B`;
  if (a >= 1e6) return `${trim(n / 1e6, 2)}M`;
  if (a >= 1e4) return `${trim(n / 1e3, 1)}K`;
  return group(n);
}

/** Full figure with grouping, no symbol: 107200000 -> "107,200,000". */
export const fullNumber = (n: number) => group(n);

/** Plain-text naira for WhatsApp messages and logs. */
export const nairaText = (n: number, compact = true) => `₦${compact ? compactNumber(n) : fullNumber(n)}`;

/** Screen-reader wording: 20400000 -> "20.4 million naira". */
export function nairaSpoken(n: number): string {
  const a = Math.abs(n);
  if (a >= 1e9) return `${trim(n / 1e9, 2)} billion naira`;
  if (a >= 1e6) return `${trim(n / 1e6, 2)} million naira`;
  return `${group(n)} naira`;
}
