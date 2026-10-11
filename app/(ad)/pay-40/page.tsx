import type { Metadata } from "next";
import { WheelMark } from "@/components/brand/WheelMark";
import { IconArrow, IconCheck, IconChat, IconInstagram } from "@/components/shell/Icons";
import WhatsAppLink from "@/components/shell/WhatsAppLink";
import Money from "@/components/ui/Money";
import { brand } from "@/config/brand";
import { carTitle } from "@/lib/carTitle";
import { getPublicCars } from "@/lib/cars";
import { buildMessage } from "@/lib/enquiry";
import { carEnquiry } from "@/lib/enquiryRequests";
import { faqFallback, getFaqs } from "@/lib/faq";
import { resolvePayment } from "@/lib/payment";
import { enquiryChannel } from "@/lib/whatsapp";

export const metadata: Metadata = { title: "Pay 40% and drive", description: "Pay 40% and drive your dream car. Car loan dealership in Lagos." };

const ASK = "Hello Omegi Autos, I saw your Pay 40% offer and I'd like to know more.";
const steps = [
  { n: "1", t: "Pick a car", d: "Tell us the one you like, or ask what we have." },
  { n: "2", t: `Pay ${brand.finance.downPaymentPercent}%`, d: "That is your down payment, paid upfront." },
  { n: "3", t: "Drive", d: `Take the car and spread the balance. ${brand.finance.termsNote}` },
];

/**
 * The page their paid ads point to. One message, one action (WhatsApp, a direct link so it works instantly),
 * and no client JavaScript or GSAP: the bar animates in CSS. Below the fold it shows real down payments, trust
 * details and answers, so a visitor can decide without leaving.
 */
export default function Pay40() {
  const pct = brand.finance.downPaymentPercent;
  const headline = brand.offer.headline.split(" ");
  const faqs = getFaqs().filter((f) => ["upfront", "interest", "which-cars", "term"].includes(f.id));
  const claims = brand.offer.claims.filter((c) => c.show);
  const all = getPublicCars();
  const start = all.filter((c) => c.status === "available").map((c) => ({ c, v: resolvePayment(c.payment) })).filter((x) => x.v.installment && x.v.downPayment).sort((a, b) => a.v.downPayment!.amount - b.v.downPayment!.amount);
  const sold = all.filter((c) => c.status === "sold" && c.handover);
  const reg = brand.registration, ig = brand.contacts.instagram;
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

      {start.length > 0 && (
        <section className="wrap py-14 md:py-20">
          <p className="t-eyebrow">Real down payments from our listings</p>
          <h2 className="t-display t-d3 mt-3">Cars you can start with</h2>
          <ul className="mt-8 border-t border-rule">
            {start.map(({ c, v }) => (
              <li key={c.id}>
                <a href={enquiryChannel(buildMessage(carEnquiry(c))).href} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between gap-4 border-b border-rule py-5 transition-colors duration-300 hover:bg-paper md:px-4">
                  <span className="min-w-0"><span className="block truncate text-[1.05rem] font-bold md:text-[1.25rem]">{carTitle(c)}</span><span className="text-[13px] text-mute">Down payment{v.downPayment!.basis === "rule" ? ` (${pct}%)` : ""}</span></span>
                  <span className="flex items-center gap-4"><span className="t-fig text-[1.8rem] text-omegi md:text-[2.4rem]"><Money amount={v.downPayment!.amount} /></span><span className="hidden items-center gap-1.5 text-[13px] font-bold sm:inline-flex">Ask <IconArrow className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" /></span></span>
                  <span className="sr-only"> Ask about this car on WhatsApp (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[13px] text-mute">{brand.finance.termsNote} Cars without a listed figure: ask us.</p>
        </section>
      )}

      <section className="on-dark bg-tarmac py-14 text-white md:py-20">
        <div className="wrap grid gap-10 md:grid-cols-3">
          <div>
            <p className="t-eyebrow">Registered</p>
            {reg.show ? <p className="mt-3 flex items-center gap-3 text-[1.3rem] font-bold"><span className="grid h-8 w-8 place-items-center rounded-full bg-campaign text-tarmac"><IconCheck className="h-4 w-4" /></span>{reg.statement}</p> : null}
            {reg.show && <p className="t-fig mt-3 text-[2.6rem]">{reg.label} {reg.number}</p>}
          </div>
          <div>
            <p className="t-eyebrow">On Instagram</p>
            <a href={ig.url} target="_blank" rel="noopener noreferrer" className="u40 mt-3 inline-flex items-center gap-2 text-[1.3rem] font-bold"><IconInstagram />@{ig.handle}<span className="sr-only"> (opens in a new tab)</span></a>
            {brand.features.showFollowerCount && <p className="t-fig mt-3 text-[2.6rem]">{ig.followers} <span className="text-[1rem] font-semibold text-mute-dark">followers</span></p>}
          </div>
          <div>
            <p className="t-eyebrow">Recently handed over</p>
            <ul className="mt-3 grid gap-2.5 text-[15px]">{sold.map((c) => <li key={c.id}><span className="font-bold">{carTitle(c)}</span> <span className="text-mute-dark">to {c.handover!.customer}</span></li>)}</ul>
          </div>
        </div>
      </section>

      <section className="wrap py-14 md:py-20">
        <h2 className="t-display t-d3">Asked in the DMs</h2>
        <dl className="mt-6 max-w-[52rem] border-t border-rule">
          {faqs.map((f) => (<div key={f.id} className="border-b border-rule py-5"><dt className="text-[1.1rem] font-bold">{f.q}</dt><dd className="mt-2 max-w-[60ch] text-mute">{f.a ?? faqFallback}</dd></div>))}
        </dl>
        <div className="mt-10 flex flex-col items-start gap-4">
          <WhatsAppLink text={ASK} className="btn btn-red min-h-[56px] px-8 text-[1.05rem]"><IconChat /> Chat on WhatsApp</WhatsAppLink>
          <a href="/inventory" className="u40 text-[14px] font-semibold text-mute">Or browse all the cars</a>
        </div>
      </section>
    </>
  );
}
