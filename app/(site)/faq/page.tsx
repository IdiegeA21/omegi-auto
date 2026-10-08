import type { Metadata } from "next";
import FaqList from "@/components/pages/FaqList";
import PageHead from "@/components/ui/PageHead";
import { getFaqs } from "@/lib/faq";

export const metadata: Metadata = { title: "FAQ", description: "The questions we get in DMs." };
export default function Faq() {
  return (<><PageHead eyebrow="FAQ" title="Asked in the DMs" lead="The questions we get most." /><section className="wrap pb-section"><div className="max-w-[52rem]"><FaqList faqs={getFaqs()} /></div></section></>);
}
