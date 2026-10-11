import type { Metadata } from "next";
import FinanceTools from "@/components/forms/FinanceTools";
import FaqList from "@/components/pages/FaqList";
import PageHead from "@/components/ui/PageHead";
import Steps from "@/components/ui/Steps";
import { brand } from "@/config/brand";
import { getPublicCars } from "@/lib/cars";
import { getFaqs } from "@/lib/faq";

export const metadata: Metadata = { title: "Finance estimator", description: "See your 40% down payment and balance." };

export default function Finance() {
  const pct = brand.finance.downPaymentPercent;
  return (
    <>
      <PageHead art="ghost" ghost={`${pct}%`} eyebrow="Finance" title={`Your ${pct}%`} lead="Pick a car or enter a price to see the down payment and the balance." />
      <section className="wrap pb-section"><FinanceTools cars={getPublicCars()} /></section>
      <section className="border-t border-rule bg-paper py-section">
        <div className="wrap">
          <p className="t-eyebrow">How it works</p>
          <h2 className="t-display t-d2 mt-3 max-w-[14ch]">Three steps. No guesswork.</h2>
          <div className="mt-10"><Steps level={3} steps={[
            { t: "See your figure", d: `Your down payment is ${pct}% of the price. The rest is the balance.` },
            { t: "Tell us about you", d: "The pre-qualification form only collects details so our team can prepare. It makes no decision." },
            { t: "Confirm on WhatsApp", d: `${brand.finance.termsNote} Nothing is final until you have chatted with the team.` },
          ]} /></div>
        </div>
      </section>
      <section className="wrap grid gap-10 py-section lg:grid-cols-12">
        <div className="lg:col-span-4"><p className="t-eyebrow">Common questions</p><h2 className="t-display t-d3 mt-3">Before you ask.</h2></div>
        <div className="lg:col-span-8"><FaqList faqs={getFaqs().filter((f) => ["interest", "upfront", "term", "approval"].includes(f.id))} /></div>
      </section>
    </>
  );
}
