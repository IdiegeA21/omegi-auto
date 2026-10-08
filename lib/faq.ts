import raw from "@/data/faq.json";
export type Faq = { id: string; q: string; a: string | null };
/** note is internal and never shipped to the browser. */
export const getFaqs = (): Faq[] => (raw as { id: string; q: string; a: string | null; note?: string }[]).map(({ id, q, a }) => ({ id, q, a }));
export const faqFallback = "Message us on WhatsApp and we'll confirm.";
