import { brand } from "@/config/brand";

export type EnquiryKind = "car" | "general" | "prequal" | "swap" | "sell" | "preorder" | "delivery" | "shortlist" | "finder" | "faq";

/** Plain data, so server components can hand it to the enquiry sheet. */
export type EnquiryRequest = {
  kind: EnquiryKind;
  title: string; // sheet heading
  intro: string; // first line of the message
  details?: { label: string; value: string }[]; // shown in the sheet and sent
  chips?: string[]; // one-tap questions
  preselect?: string[]; // chips on by default
  notePlaceholder?: string;
  reassurance?: string; // small line under the details, e.g. "No decision is made here."
};

export type EnquiryExtra = { chips?: string[]; note?: string; name?: string };

/** The clean message that opens in WhatsApp. Empty parts are left out. */
export function buildMessage(req: EnquiryRequest, extra: EnquiryExtra = {}): string {
  const lines: string[] = [`Hello ${brand.name},`, "", req.intro];
  if (req.details?.length) { lines.push(""); req.details.forEach((d) => lines.push(`${d.label}: ${d.value}`)); }
  const chips = extra.chips ?? req.preselect ?? [];
  if (chips.length) { lines.push("", chips.length === 1 ? "Question:" : "Questions:"); chips.forEach((c) => lines.push(`- ${c}`)); }
  if (extra.note?.trim()) lines.push("", extra.note.trim());
  if (extra.name?.trim()) lines.push("", `My name is ${extra.name.trim()}.`);
  return lines.join("\n");
}
