import Money from "@/components/ui/Money";
import { brand } from "@/config/brand";
import { resolvePayment } from "@/lib/payment";
import type { PaymentInput } from "@/types/payment";

type Size = "sm" | "md" | "lg";
const FIG: Record<Size, string> = { sm: "text-[1.65rem]", md: "text-[2.4rem]", lg: "text-[3.4rem] md:text-[4.4rem]" };

/**
 * Two deliberately different treatments:
 *  - Installment-open cars lead with the DOWN PAYMENT in red-accent, with a tag and (when both figures are known) a 40/60 bar.
 *  - Outright cars show a plain PRICE in ink. No tag, no bar.
 * Missing figures show a neutral placeholder, never a guess.
 */
export default function PaymentBlock({ payment, size = "md", className = "", hideTag = false }: { payment?: PaymentInput; size?: Size; className?: string; hideTag?: boolean }) {
  const v = resolvePayment(payment);
  const unknown = brand.finance.unknownPrice;

  if (v.mode === "installment" && v.downPayment) {
    const ratio = v.downRatio;
    return (
      <div className={className}>
        {!hideTag && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-omegi px-2.5 py-1 text-[11px] font-bold leading-none text-white">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-white" /> Installment option
          </span>
        )}
        <p className={`${hideTag ? "" : "mt-3 "}text-[13px] font-semibold text-mute`}>
          Down payment{v.downPayment.basis === "rule" ? ` (${brand.finance.downPaymentPercent}%)` : ""}
        </p>
        <p className={`t-fig text-omegi ${FIG[size]}`}><Money amount={v.downPayment.amount} /></p>
        {ratio != null && (
          <div className="mt-3" aria-hidden="true">
            <div className="pay-bar"><i style={{ transform: `scaleX(${ratio})` }} /></div>
            <div className="mt-1.5 flex justify-between text-[11px] font-semibold text-mute"><span>{Math.round(ratio * 100)}% now</span><span>Balance later</span></div>
          </div>
        )}
        <p className="mt-2 text-[13px] text-mute">
          Full price: {v.price != null ? <Money amount={v.price} className="font-bold text-tarmac" /> : <span className="font-semibold text-tarmac">{unknown}</span>}
        </p>
      </div>
    );
  }

  if (v.mode === "outright" && v.price != null) {
    return (
      <div className={className}>
        <p className="text-[13px] font-semibold text-mute">Price</p>
        <p className={`t-fig text-tarmac ${FIG[size]}`}><Money amount={v.price} /></p>
      </div>
    );
  }

  return (
    <div className={className}>
      <p className="text-[13px] font-semibold text-mute">Price</p>
      <p className="mt-0.5 text-lg font-bold text-tarmac">{unknown}</p>
    </div>
  );
}
