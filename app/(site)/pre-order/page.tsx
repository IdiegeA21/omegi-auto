import type { Metadata } from "next";
import { PreOrderForm } from "@/components/forms/BusinessForms";
import SampleFlow from "@/components/pages/SampleFlow";
import { IconCheck } from "@/components/shell/Icons";
import PageHead from "@/components/ui/PageHead";
import Steps from "@/components/ui/Steps";

export const metadata: Metadata = { title: "Pre-order", description: "Request the car you want." };

const tips = ["The make and model you want", "A year range that suits you", "Colour and must-have options", "Your budget, if you have one"];

export default function PreOrder() {
  return (
    <>
      <PageHead art="silhouette" eyebrow="Pre-order" title="Request a car" lead="Don't see the car you want? Tell us what you're after." />
      <section className="wrap pb-section"><Steps steps={[
        { t: "Describe the car", d: "The more you tell us, the easier it is to look for it." },
        { t: "Review and send", d: "Your request opens in WhatsApp for you to send. Nothing leaves your phone before that." },
        { t: "Hear from the team", d: "They reply on WhatsApp. This is a request, not an order." },
      ]} /></section>
      <section className="border-t border-rule bg-paper py-section">
        <div className="wrap grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div><h2 className="t-display t-d3">Your request</h2><div className="mt-8 max-w-[40rem]"><PreOrderForm /></div>
            <div className="mt-10 rounded-3xl border border-rule bg-showroom p-6"><h3 className="text-[15px] font-bold">A good request includes</h3>
              <ul className="mt-4 grid gap-2.5">{tips.map((t) => <li key={t} className="flex items-start gap-3 text-[15px]"><span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-omegi text-white"><IconCheck className="h-3 w-3" /></span>{t}</li>)}</ul></div></div>
          <div><h2 className="t-display t-d3">What a tracker could look like</h2><div className="mt-8"><SampleFlow /></div></div>
        </div>
      </section>
    </>
  );
}
