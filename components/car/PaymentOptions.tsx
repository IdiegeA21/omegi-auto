import { brand } from "@/config/brand";
import type { PublicCar } from "@/types/car";

/** The ways this car can be paid for, stated from the car's own data and the dealership's public posts. Nothing here adds a term. */
export default function PaymentOptions({ car }: { car: PublicCar }) {
  const opts = [
    car.payment.installment && { t: "Pay in installments", d: `Pay ${brand.finance.downPaymentPercent}% and drive. ${brand.finance.termsNote}`, tone: "red" as const },
    car.payment.outright !== false && { t: "Cash purchase", d: "Prefer to pay in full? Message us for the price.", tone: "ink" as const },
  ].filter((o): o is { t: string; d: string; tone: "red" | "ink" } => !!o);
  if (opts.length === 0) return null;
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2">
      {opts.map((o) => (
        <div key={o.t} className={`rounded-3xl p-6 ${o.tone === "red" ? "on-dark bg-omegi text-white" : "bg-paper"}`}>
          <h2 className="t-display text-[1.7rem]">{o.t}</h2>
          <p className={`mt-2 text-[14px] ${o.tone === "red" ? "text-white/85" : "text-mute"}`}>{o.d}</p>
        </div>
      ))}
    </div>
  );
}
