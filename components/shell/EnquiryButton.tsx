"use client";
import type { ReactNode } from "react";
import { buildMessage, type EnquiryRequest } from "@/lib/enquiry";
import { enquiryChannel } from "@/lib/whatsapp";
import { useEnquiry } from "./EnquirySheet";

/** Opens the enquiry sheet. It is a real link to WhatsApp underneath, so it still works if JavaScript has not loaded. */
export default function EnquiryButton({ request, className = "", children }: { request: EnquiryRequest; className?: string; children: ReactNode }) {
  const enquiry = useEnquiry();
  const { href } = enquiryChannel(buildMessage(request));
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className} onClick={(e) => { if (!enquiry) return; e.preventDefault(); enquiry.open(request); }}>
      {children}
    </a>
  );
}
