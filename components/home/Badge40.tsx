import { WheelMark } from "@/components/brand/WheelMark";
import { brand } from "@/config/brand";

/** A ring of text turning slowly around the wheel. Decorative (the offer is stated in words next to it), so hidden from screen readers. */
export default function Badge40({ className = "", id = "badge40" }: { className?: string; id?: string }) {
  const pct = brand.finance.downPaymentPercent;
  const unit = `PAY ${pct}% AND DRIVE \u2022 `;
  return (
    <div className={`badge40 ${className}`} aria-hidden="true" data-badge>
      <svg viewBox="0 0 200 200" className="badge40__ring" fill="currentColor" aria-hidden="true" focusable="false">
        <defs><path id={`${id}-path`} d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0" /></defs>
        <text fontSize="19"><textPath href={`#${id}-path`} textLength="498" lengthAdjust="spacing">{unit + unit}</textPath></text>
      </svg>
      <WheelMark className="badge40__wheel" />
    </div>
  );
}
