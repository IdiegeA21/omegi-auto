import { brand } from "@/config/brand";

const hello = `Hello ${brand.name}`;

export const enquiryText = (title: string, extra?: string) =>
  `${hello}, I'm interested in the ${title}${extra ? ` (${extra})` : ""}.`;

export const enquiryTextMany = (titles: string[]) =>
  titles.length === 1 ? enquiryText(titles[0]) : `${hello}, I'm interested in these cars: ${titles.join("; ")}.`;

/** WhatsApp when the primary number is set in config. Otherwise Instagram DM (can't be pre-filled, so the text is copied first). */
export function enquiryChannel(text: string) {
  const wa = brand.contacts.whatsapp;
  if (wa) return { kind: "whatsapp" as const, href: `https://wa.me/${wa}?text=${encodeURIComponent(text)}` };
  return { kind: "instagram" as const, href: brand.contacts.instagram.dm };
}
