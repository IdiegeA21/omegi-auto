import type { Metadata } from "next";
import { IconCheck } from "@/components/shell/Icons";
import { SellForm } from "@/components/forms/BusinessForms";
import PageHead from "@/components/ui/PageHead";
import Steps from "@/components/ui/Steps";

export const metadata: Metadata = { title: "Sell your car" };

const asks = ["Make and model", "Year", "Mileage", "Condition (foreign used or Nigerian used)", "Your city", "Your asking price, if you have one"];

export default function Sell() {
  return (
    <>
      <PageHead art="wheel" eyebrow="Sell" title="Sell your car" lead="Tell us about your car and our team will take it from there on WhatsApp." />
      <section className="wrap pb-section"><Steps steps={[
        { t: "Describe your car", d: "A few details is enough to start." },
        { t: "Review and send", d: "You see exactly what will be sent before anything leaves your phone." },
        { t: "Chat with the team", d: "They reply on WhatsApp. We don't give a valuation or promise a price on this site." },
      ]} /></section>
      <section className="border-t border-rule bg-paper py-section">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7"><h2 className="t-display t-d3">Tell us about it</h2><div className="mt-8 max-w-[44rem]"><SellForm /></div></div>
          <aside className="lg:col-span-5"><div className="rounded-3xl border border-rule bg-showroom p-6 md:p-8"><h2 className="t-display text-[1.75rem]">What we&apos;ll ask for</h2>
            <ul className="mt-5 grid gap-3">{asks.map((a) => <li key={a} className="flex items-start gap-3 text-[15px]"><span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-omegi text-white"><IconCheck className="h-3 w-3" /></span>{a}</li>)}</ul></div></aside>
        </div>
      </section>
    </>
  );
}
