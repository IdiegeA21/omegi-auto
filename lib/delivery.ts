import type { EnquiryRequest } from "@/lib/enquiry";

/** How a destination reads in buttons and messages: "Abuja (FCT)", "Lagos", "Port Harcourt, Rivers State". */
export const destName = (p: { id: string; city: string; state: string }) => (p.id === "fct" ? "Abuja (FCT)" : p.city === p.state ? p.city : `${p.city}, ${p.state} State`);

export type DeliveryChoice = { originCity: string; typed: string; place: { id: string; city: string; state: string; zone: string } | null; originId: string; car: string };

/** The button label and the message for the delivery map. No distance, time or cost is ever stated. */
export function deliveryCopy(c: DeliveryChoice) {
  const typed = c.typed.trim();
  const here = !typed && c.place?.id === c.originId;
  const target = typed || (c.place ? destName(c.place) : "");
  const cta = !target ? "Ask us about delivery" : here ? `Ask about delivery in ${c.originCity}` : `Ask about delivery to ${target}`;
  const request: EnquiryRequest = {
    kind: "delivery",
    title: target ? (here ? `Delivery in ${c.originCity}` : `Delivery to ${target}`) : "Delivery",
    intro: target ? (here ? `I'd like to ask about delivery in ${c.originCity}.` : `I'd like to ask about delivery to ${target}.`) : "I'd like to ask about delivery.",
    details: [
      ...(target && !here ? [{ label: "From", value: c.originCity }, { label: "To", value: target }] : []),
      ...(c.place && !typed ? [{ label: "Region", value: c.place.zone }] : []),
      ...(c.car ? [{ label: "Car", value: c.car }] : []),
    ],
    chips: ["How does delivery work?", "How long does it take?", "What does it cost?"],
  };
  return { cta, request, target, here };
}
