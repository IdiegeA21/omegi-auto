import type { Metadata } from "next";
import FaqList from "@/components/pages/FaqList";
import { IconChat } from "@/components/shell/Icons";
import EnquiryButton from "@/components/shell/EnquiryButton";
import PageHead from "@/components/ui/PageHead";
import { getFaqs } from "@/lib/faq";
import { generalEnquiry } from "@/lib/enquiryRequests";

export const metadata: Metadata = { title: "FAQ", description: "The questions we get in DMs." };

export default function Faq() {
  return (
    <>
      <PageHead art="ghost" ghost="?" eyebrow="FAQ" title="Asked in the DMs" lead="The questions we get most." />
      <section className="wrap grid gap-10 pb-section lg:grid-cols-12">
        <div className="lg:col-span-8"><FaqList faqs={getFaqs()} /></div>
        <aside className="lg:col-span-4"><div className="rounded-3xl bg-paper p-6 md:p-8 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]"><h2 className="t-display text-[2rem]">Still wondering?</h2><p className="mt-3 text-[15px] text-mute">Ask the team directly. They reply on WhatsApp.</p>
          <EnquiryButton request={generalEnquiry("I have a question.")} className="btn btn-red mt-6 w-full"><IconChat /> Ask on WhatsApp</EnquiryButton></div></aside>
      </section>
    </>
  );
}
