import type { Metadata } from "next";
import { WheelMark } from "@/components/brand/Logo";
import { IconChat } from "@/components/shell/Icons";
import WhatsAppLink from "@/components/shell/WhatsAppLink";
import { brand } from "@/config/brand";
import { faqFallback, getFaqs } from "@/lib/faq";

export const metadata: Metadata = { title: "Pay 40% and drive", description: "Pay 40% and drive your dream car. Car loan dealership in Lagos." };

const ASK = "Hello Omegi Autos, I saw your Pay 40% offer and I'd like to know more.";
const steps = [
  { n: "1", t: "Pick a car", d: "Tell us the one you like, or ask what we have." },
  { n: "2", t: `Pay ${brand.finance.downPaymentPercent}%`, d: "That is your down payment, paid upfront." },
  { n: "3", t: "Drive", d: `Take the car and spread the balance. ${brand.finance.termsNote}` },
];

/**
 * The page their paid ads point to. One message, one action (WhatsApp, a direct link so it works instantly),
 * minimal navigation, and no client JavaScript or GSAP: the bar animates in CSS.
 */
export default function Pay40() {
  const pct = brand.finance.downPaymentPercent;
  const headline = brand.offer.headline.split(" ");
  const faqs = getFaqs().filter((f) => ["upfront", "interest", "which-cars"].includes(f.id));
  const claims = brand.offer.claims.filter((c) => c.show);
  return (
    <>
      <section className="wrap pb-12 pt-10 md:pb-20 md:pt-16">
        <p className="t-eyebrow">{brand.tagline}</p>
        <h1 aria-label={`${brand.offer.headline}.`} className="ad-rise t-display t-d1 mt-4 max-w-[13ch]">
          {headline.map((w, i) => <span key={i} aria-hidden="true" style={{ ["--i" as string]: i }}>{w}{i < headline.length - 1 ? "\u00A0" : "."}</span>)}
        </h1>
        {claims.length > 0 && <p className="t-lead mt-6 text-mute">{claims.map((c) => c.text).join(". ")}.</p>}
        <div className="mt-8 flex flex-col items-start gap-4">
          <WhatsAppLink text={ASK} className="btn btn-red min-h-[56px] px-8 text-[1.05rem]"><IconChat /> Chat on WhatsApp</WhatsAppLink>
          <p className="text-[13px] text-mute">Opens WhatsApp with your message ready. {brand.finance.termsNote}</p>
        </div>

        <div className="abar mt-14 md:mt-20" style={{ ["--pct" as string]: pct / 100 }}>
          <div className="abar__drive" aria-hidden="true"><span className="t-display t-d2">Drive.</span></div>
          <div className="abar__rail">
            <div className="abar__track"><div className="abar__fill" /></div>
            <div className="abar__tick" aria-hidden="true" />
            <div className="abar__wheel" aria-hidden="true"><WheelMark className="h-full w-full" /></div>
          </div>
          <div className="abar__labels" aria-hidden="true">
            <span className="abar__l0">Price of the car</span><span className="abar__l40"><b>{pct}%</b> now</span><span className="abar__l100">Balance</span>
          </div>
          <p className="sr-only">{`Pay ${pct} percent of the price now, then drive. ${brand.finance.termsNote}`}</p>
        </div>
      </section>

      <section className="border-t border-rule bg-paper py-14 md:py-20">
        <div className="wrap">
          <ol className="grid gap-8 md:grid-cols-3">
            {steps.map((s) => (
              <li key={s.n} className="grid grid-cols-[auto_1fr] gap-x-5">
                <span className="t-fig text-[2.75rem] text-omegi" aria-hidden="true">{s.n}</span>
                <div><h2 className="t-display text-[1.75rem]">{s.t}</h2><p className="mt-2 max-w-[34ch] text-[15px] text-mute">{s.d}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="wrap py-14 md:py-20">
        <h2 className="t-display t-d3">Asked in the DMs</h2>
        <dl className="mt-6 max-w-[52rem] border-t border-rule">
          {faqs.map((f) => (<div key={f.id} className="border-b border-rule py-5"><dt className="text-[1.1rem] font-bold">{f.q}</dt><dd className="mt-2 max-w-[60ch] text-mute">{f.a ?? faqFallback}</dd></div>))}
        </dl>
        <div className="mt-10 flex flex-col items-start gap-4">
          <WhatsAppLink text={ASK} className="btn btn-red min-h-[56px] px-8 text-[1.05rem]"><IconChat /> Chat on WhatsApp</WhatsAppLink>
          <a href="/inventory" className="u40 text-[14px] font-semibold text-mute">Or browse the cars</a>
        </div>
      </section>
    </>
  );
}
