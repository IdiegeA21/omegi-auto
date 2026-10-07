import { LogoImage } from "@/components/brand/Logo";
import OpenGate from "@/components/shell/OpenGate";
import WhatsAppLink from "@/components/shell/WhatsAppLink";
import { IconCheck, IconChat } from "@/components/shell/Icons";
import { brand } from "@/config/brand";

/**
 * Minimal chrome for paid-ad traffic: logo, one action, no navigation, no preloader, no smooth scroll, no cursor.
 * Plain links and no page transition, so it loads and responds instantly.
 */
export default function AdLayout({ children }: { children: React.ReactNode }) {
  const reg = brand.registration;
  return (
    <>
      <OpenGate />
      <a href="#main" className="skip">Skip to content</a>
      <header className="border-b border-rule bg-showroom">
        <div className="wrap flex h-[64px] items-center justify-between gap-4">
          <a href="/" aria-label="Omegi Autos, home"><LogoImage height={42} priority /></a>
          <WhatsAppLink className="btn btn-red"><IconChat /> Chat on WhatsApp</WhatsAppLink>
        </div>
      </header>
      <main id="main" tabIndex={-1} className="outline-none">{children}</main>
      <footer className="on-dark bg-tarmac text-[13px] text-mute-dark">
        <div className="wrap flex flex-col gap-3 py-8 md:flex-row md:items-center md:justify-between">
          {reg.show && <p className="inline-flex w-fit items-center gap-2 text-white/90"><span className="grid h-5 w-5 place-items-center rounded-full bg-campaign text-tarmac"><IconCheck className="h-3 w-3" /></span>{reg.statement} · {reg.label} {reg.number}</p>}
          <p>{brand.conceptLabel}</p>
        </div>
      </footer>
    </>
  );
}
