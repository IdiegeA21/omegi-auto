import { brand } from "@/config/brand";
import { monthlyPayment } from "@/lib/payment";

/** 40% down, the rest is the balance. These come straight from their public offer. */
export function estimate(price: number, percent = brand.finance.downPaymentPercent) {
  const down = Math.round((price * percent) / 100);
  return { price, down, balance: price - down, percent };
}

/** One entry per configured tenor, or null. Null (the default) means: do not show any monthly figure. */
export function monthlyOptions(balance: number, rate = brand.finance.interestRatePercent, tenors = brand.finance.tenorMonths) {
  if (rate == null || !tenors || tenors.length === 0) return null;
  return tenors.map((months) => ({ months, amount: Math.round(monthlyPayment(balance, months, rate) ?? 0) }));
}

/** Reads what people actually type: "268,000,000", "₦268m", "20.4 million", "850k". Returns null if it isn't a number. */
export function parseNaira(input: string): number | null {
  const s = input.toLowerCase().replace(/[₦,\s]|naira|ngn/g, "");
  const m = s.match(/^(\d+(?:\.\d+)?)(b|billion|m|million|k|thousand)?$/);
  if (!m) return null;
  const mult = { b: 1e9, billion: 1e9, m: 1e6, million: 1e6, k: 1e3, thousand: 1e3 }[m[2] as "b"] ?? 1;
  const n = Math.round(parseFloat(m[1]) * mult);
  return n > 0 && n < 1e12 ? n : null;
}
