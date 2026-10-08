import { IconArrow, IconChat } from "@/components/shell/Icons";
import { TransitionLink } from "@/components/shell/Transition";
import WhatsAppLink from "@/components/shell/WhatsAppLink";
import Reveal from "@/components/ui/Reveal";
import { brand } from "@/config/brand";
import DepositBar from "./DepositBar";

const steps = [
  { n: "1", t: "Pick a car", d: "Browse the showroom, or answer three questions and we'll narrow it down." },
  { n: "2", t: `Pay ${brand.finance.downPaymentPercent}%`, d: "That is your down payment, paid upfront." },
  { n: "3", t: "Drive", d: `Take the car and spread the balance. ${brand.finance.termsNote}` },
];

/** The dealership's own offer, told as one motion: wheel rolls to 40%, then "Drive." */
export default function PayFortySection() {
  return (
    <section className="on-dark bg-tarmac py-section text-white">
      <div className="wrap">
        <p className="t-eyebrow">The offer</p>
        <Reveal as="h2" text={`Pay ${brand.finance.downPaymentPercent}%. Then drive.`} className="t-display t-d1 mt-3 max-w-[12ch]" />
        <div className="mt-10 md:mt-14"><DepositBar /></div>

        <ol className="mt-14 grid gap-8 border-t border-kerb pt-10 md:mt-20 md:grid-cols-3">
          {steps.map((s) => (
            <li key={s.n} className="grid grid-cols-[auto_1fr] gap-x-5">
              <span className="t-fig text-[2.75rem] text-campaign" aria-hidden="true">{s.n}</span>
              <div><h3 className="t-display text-[1.75rem]">{s.t}</h3><p className="mt-2 max-w-[34ch] text-[15px] text-mute-dark">{s.d}</p></div>
            </li>
          ))}
        </ol>

        <div className="mt-12 flex flex-wrap gap-3">
          <WhatsAppLink className="btn btn-red"><IconChat /> Start on WhatsApp</WhatsAppLink>
          <TransitionLink href="/pay-40" className="btn btn-line">How it works <IconArrow /></TransitionLink>
        </div>
      </div>
    </section>
  );
}
