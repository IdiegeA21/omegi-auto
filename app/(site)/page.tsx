import PaymentBlock from "@/components/car/PaymentBlock";
import { IconChat } from "@/components/shell/Icons";
import { TransitionLink } from "@/components/shell/Transition";
import WhatsAppLink from "@/components/shell/WhatsAppLink";
import Magnetic from "@/components/ui/Magnetic";
import ReplayIntro from "@/components/ui/ReplayIntro";
import Reveal from "@/components/ui/Reveal";
import { brand } from "@/config/brand";

/**
 * STAGE 1 PREVIEW. Shows the shell and design system working together. The real home (minimal hero, featured cars,
 * down-payment browser) is built in Stage 2 and replaces this file.
 */
const c = brand.colors;
const swatches = [
  { name: "Showroom", hex: c.showroom, note: "Primary background", dark: false },
  { name: "Paper", hex: c.paper, note: "Raised light surface", dark: false },
  { name: "Tarmac", hex: c.tarmac, note: "Ink and dark bands", dark: true },
  { name: "Omegi Red", hex: c.omegiRed, note: "Logo red. White on it 7.36:1", dark: true },
  { name: "Campaign Red", hex: c.campaignRed, note: "Ad red. Large type on tarmac 4.72:1", dark: true },
  { name: "Graphite", hex: c.onLightMuted, note: "Muted text. On white 6.7:1", dark: true },
];

export default function Home() {
  return (
    <>
      <section className="wrap pb-20 pt-12 md:pb-32 md:pt-24">
        <p className="t-eyebrow">{brand.tagline}</p>
        <Reveal as="h1" text={brand.offer.headline + "."} className="t-display t-d1 mt-5 max-w-[13ch]" />
        <p className="t-lead mt-8 text-mute">Stage 1 shell preview. The real hero, featured cars and the Deposit Bar arrive in Stage 2.</p>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Magnetic><WhatsAppLink className="btn btn-red"><IconChat /> Chat on WhatsApp</WhatsAppLink></Magnetic>
          <TransitionLink href="/inventory" className="btn btn-line">See the cars</TransitionLink>
          <ReplayIntro />
        </div>
      </section>

      <section className="border-t border-rule bg-paper py-16 md:py-24">
        <div className="wrap">
          <p className="t-eyebrow">Colour, sampled from the logo and their ad</p>
          <ul className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-6">
            {swatches.map((s) => (
              <li key={s.name} className="overflow-hidden rounded-2xl border border-rule bg-showroom">
                <div className="h-24" style={{ background: s.hex }} />
                <div className="p-3"><p className="text-sm font-bold">{s.name}</p><p className="text-xs text-mute">{s.hex}</p><p className="mt-1 text-xs text-mute">{s.note}</p></div>
              </li>
            ))}
          </ul>

          <p className="t-eyebrow mt-16">Type: one variable family, two widths</p>
          <div className="mt-6 grid gap-8 md:grid-cols-2">
            <div>
              <p className="t-display t-d2">Down payment</p>
              <p className="t-fig mt-4 text-6xl text-omegi">40% · 1,240</p>
            </div>
            <p className="t-lead">Body text sits at normal width and weight for easy reading on a phone, while headlines and figures use the condensed, heavy cut that echoes their ads.</p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="wrap">
          <p className="t-eyebrow">Installment cars and outright cars look different (figures from their captions)</p>
          <div className="mt-8 grid gap-6 md:grid-cols-4">
            <div className="rounded-3xl border border-rule p-6">
              <p className="mb-4 text-sm font-bold">2022 Mercedes-Benz GLE53</p>
              <PaymentBlock payment={{ downPayment: 50_000_000, downPaymentBy: "caption", installment: true }} />
            </div>
            <div className="rounded-3xl border border-rule p-6">
              <p className="mb-4 text-sm font-bold">2022 Mercedes-AMG G63</p>
              <PaymentBlock payment={{ price: 268_000_000, installment: true }} />
            </div>
            <div className="rounded-3xl border border-rule p-6">
              <p className="mb-4 text-sm font-bold">Outright only (sample treatment)</p>
              <PaymentBlock payment={{ price: 268_000_000 }} />
            </div>
            <div className="rounded-3xl border border-rule p-6">
              <p className="mb-4 text-sm font-bold">Price not stated</p>
              <PaymentBlock payment={{}} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
