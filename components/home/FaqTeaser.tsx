import FaqList from "@/components/pages/FaqList";
import { IconArrow } from "@/components/shell/Icons";
import { TransitionLink } from "@/components/shell/TransitionLink";
import Reveal from "@/components/ui/Reveal";
import { getFaqs } from "@/lib/faq";

export default function FaqTeaser() {
  return (
    <section className="border-t border-rule bg-paper py-section">
      <div className="wrap grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="t-eyebrow">Asked in the DMs</p>
          <Reveal as="h2" text="Questions we get." className="t-display t-d2 mt-3" />
          <TransitionLink href="/faq" className="btn btn-ink mt-8">All questions <IconArrow /></TransitionLink>
        </div>
        <div className="lg:col-span-7"><FaqList faqs={getFaqs()} limit={4} /></div>
      </div>
    </section>
  );
}
