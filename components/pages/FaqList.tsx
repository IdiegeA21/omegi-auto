import EnquiryButton from "@/components/shell/EnquiryButton";
import { IconChat } from "@/components/shell/Icons";
import { faqFallback, type Faq } from "@/lib/faq";

/** DM-style questions. Native <details>, so it works without JavaScript. Unanswered ones say so and hand off to WhatsApp. */
export default function FaqList({ faqs, limit }: { faqs: Faq[]; limit?: number }) {
  return (
    <div className="border-t border-rule">
      {(limit ? faqs.slice(0, limit) : faqs).map((f) => (
        <details key={f.id} className="group border-b border-rule">
          <summary className="flex min-h-[64px] cursor-pointer list-none items-center justify-between gap-6 py-4 text-[1.1rem] font-bold md:text-[1.25rem] [&::-webkit-details-marker]:hidden">
            {f.q}
            <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-rule transition-transform duration-300 group-open:rotate-45">+</span>
          </summary>
          <div className="pb-6 pr-12">
            <p className="max-w-[62ch] text-[16px] text-mute">{f.a ?? faqFallback}</p>
            {f.a === null && (
              <EnquiryButton request={{ kind: "faq", title: "Ask on WhatsApp", intro: `My question: ${f.q}` }} className="btn btn-line mt-4 min-h-[44px] px-5 text-[14px]"><IconChat className="h-4 w-4" /> Ask on WhatsApp</EnquiryButton>
            )}
          </div>
        </details>
      ))}
    </div>
  );
}
