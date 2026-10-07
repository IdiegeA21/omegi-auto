import { brand } from "@/config/brand";
import type { PaymentInput, PaymentView } from "@/types/payment";

/**
 * Turns a car's payment fields into what the UI should show.
 * Rules:
 *  - A stated down payment is always shown as stated.
 *  - With no stated down payment, a price on an installment-open car gets the 40% rule figure (labelled "rule").
 *  - A price is NEVER derived from a down payment.
 */
export function resolvePayment(p: PaymentInput | undefined, percent = brand.finance.downPaymentPercent): PaymentView {
  const price = p?.price ?? null;
  const installment = !!p?.installment;
  let downPayment: PaymentView["downPayment"] = null;

  if (p?.downPayment != null) downPayment = { amount: p.downPayment, basis: "stated" };
  else if (installment && price != null) downPayment = { amount: Math.round((price * percent) / 100), basis: "rule" };

  const downRatio = downPayment && price ? Math.min(1, downPayment.amount / price) : null;
  const mode = installment && downPayment ? "installment" : price != null ? "outright" : "ask";
  return { mode, installment, downPayment, price, downRatio };
}

/** Balance after the down payment, only when both are known. */
export const balanceOf = (price: number | null, down: number | null) => (price != null && down != null ? Math.max(0, price - down) : null);

/**
 * Monthly figure. Returns null unless an interest rate AND a tenor are set in config.
 * With both empty (the default) the site never shows a monthly repayment.
 */
export function monthlyPayment(balance: number, tenorMonths: number, ratePercent = brand.finance.interestRatePercent) {
  if (ratePercent == null || !tenorMonths) return null;
  const r = ratePercent / 100 / 12;
  return r === 0 ? balance / tenorMonths : (balance * r) / (1 - Math.pow(1 + r, -tenorMonths));
}
