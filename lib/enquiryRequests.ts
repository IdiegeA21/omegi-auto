import { brand } from "@/config/brand";
import { carTitle } from "@/lib/carTitle";
import { nairaText } from "@/lib/money";
import { resolvePayment } from "@/lib/payment";
import type { EnquiryRequest } from "@/lib/enquiry";
import type { PublicCar } from "@/types/car";
import type { SavedCar } from "@/lib/shortlist";

export const CAR_CHIPS = ["Is it available?", "Can I inspect it?", "What are the financing terms?"];

/** The figures we know about a car, as message lines. Unknown figures are left out, never guessed. */
export function figureLines(car: PublicCar): { label: string; value: string }[] {
  const v = resolvePayment(car.payment);
  const out: { label: string; value: string }[] = [];
  if (v.downPayment) out.push({ label: v.downPayment.basis === "rule" ? `Down payment (${brand.finance.downPaymentPercent}%)` : "Down payment", value: nairaText(v.downPayment.amount) });
  if (v.price != null) out.push({ label: "Price", value: nairaText(v.price) });
  return out;
}

/** One short line describing the money we know about a car, for saved-car previews. */
export const figureLabel = (car: PublicCar): string => { const f = figureLines(car)[0]; return f ? `${f.label} ${f.value}` : brand.finance.unknownPrice; };

export function carEnquiry(car: PublicCar): EnquiryRequest {
  const title = carTitle(car);
  if (car.status === "sold")
    return { kind: "car", title: "Ask for a similar car", intro: `I'm looking for a car like the ${title}.`, chips: ["What do you have like this?"] };
  return { kind: "car", title: "Ask about this car", intro: `I'm interested in the ${title}.`, details: figureLines(car), chips: CAR_CHIPS };
}

export const generalEnquiry = (intro = "I'd like to know more about your cars and financing."): EnquiryRequest => ({
  kind: "general", title: "Message us", intro, chips: ["What cars do you have?", "What are the financing terms?"],
});

export function shortlistEnquiry(cars: PublicCar[]): EnquiryRequest {
  return {
    kind: "shortlist", title: "Send my shortlist", intro: `Here is my shortlist (${cars.length} ${cars.length === 1 ? "car" : "cars"}):`,
    details: cars.map((c, i) => { const f = figureLines(c)[0]; return { label: `${i + 1}. ${carTitle(c)}`, value: f ? `${f.label} ${f.value}` : brand.finance.unknownPrice }; }),
    chips: ["Are these available?", "Can I inspect them?", "What are the financing terms?"],
  };
}

/** The same shortlist message, built from the small snapshots the drawer holds. */
export function shortlistEnquiryFromSaved(saved: SavedCar[]): EnquiryRequest {
  return {
    kind: "shortlist", title: "Send my shortlist", intro: `Here is my shortlist (${saved.length} ${saved.length === 1 ? "car" : "cars"}):`,
    details: saved.map((c, i) => ({ label: `${i + 1}. ${c.title}`, value: c.figure ?? brand.finance.unknownPrice })),
    chips: ["Are these available?", "Can I inspect them?", "What are the financing terms?"],
  };
}
