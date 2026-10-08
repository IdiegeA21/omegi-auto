"use client";
import type { ReactNode } from "react";
import { useContact } from "@/components/shell/ContactModal";

/** Opens the on-site contact dialog (WhatsApp or Instagram) with the message pre-filled. Never navigates away by itself. */
export default function EnquiryAction({ text, children, className = "btn btn-red", heading }: { text: string; children: ReactNode; className?: string; heading?: string }) {
  const open = useContact();
  return <button type="button" className={className} onClick={() => open({ text, heading })} data-cursor>{children}</button>;
}
