import { compactNumber, fullNumber, nairaSpoken } from "@/lib/money";

/** Naira sign drawn as SVG so it matches the type weight everywhere (the font's Latin subset has no U+20A6). */
export function Naira({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 14" aria-hidden="true" focusable="false" className={className}
      style={{ display: "inline-block", height: ".72em", width: ".62em", verticalAlign: "baseline", marginRight: ".06em" }}
      fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="butt" strokeLinejoin="miter">
      <path d="M1.6 13V1.2L10.4 12.8V1" />
      <path d="M0 5.1h12M0 8.9h12" strokeWidth="1.7" />
    </svg>
  );
}

/** ₦20.4M (compact, default) or ₦20,400,000 (compact={false}). Screen readers hear "20.4 million naira". */
export default function Money({ amount, compact = true, className = "" }: { amount: number; compact?: boolean; className?: string }) {
  return (
    <span role="img" aria-label={nairaSpoken(amount)} className={`whitespace-nowrap ${className}`}>
      <span aria-hidden="true"><Naira />{compact ? compactNumber(amount) : fullNumber(amount)}</span>
    </span>
  );
}
