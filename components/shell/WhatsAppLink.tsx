import type { ReactNode } from "react";
import { brand } from "@/config/brand";
import { enquiryChannel } from "@/lib/whatsapp";

/**
 * The single contact route. Opens WhatsApp with a clean pre-written message to the one number set in config/brand.ts.
 * (Stage 3 puts the enquiry sheet in front of this for car-specific enquiries.)
 */
export default function WhatsAppLink({ text = brand.defaultMessage, className = "", children, label }: { text?: string; className?: string; children?: ReactNode; label?: string }) {
  const { href, kind } = enquiryChannel(text);
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className} aria-label={label}>
      {children}
      <span className="sr-only"> ({kind === "whatsapp" ? "opens WhatsApp" : "opens Instagram"} in a new tab)</span>
    </a>
  );
}
