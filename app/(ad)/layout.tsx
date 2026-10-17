import { LogoImage } from "@/components/brand/LogoImage";
import Footer from "@/components/shell/Footer";
import { IconArrow, IconChat } from "@/components/shell/Icons";
import OpenGate from "@/components/shell/OpenGate";
import WhatsAppLink from "@/components/shell/WhatsAppLink";

/**
 * Lean chrome for paid-ad traffic: no preloader, smooth scroll, cursor or page transition, so it loads and responds
 * instantly. It is still clearly part of the same site. Below 1024px the way back is its own slim bar above the header,
 * so the logo never sits beside a row of buttons; from 1024px the links sit in the header like the main site.
 */
export default function AdLayout({ children }: { children: React.ReactNode }) {
  const link = "inline-flex min-h-[44px] items-center text-[13px] font-semibold";
  return (
    <>
      <OpenGate />
      <a href="#main" className="skip">Skip to content</a>
      <div className="on-dark bg-tarmac text-white lg:hidden">
        <div className="wrap flex items-center justify-between gap-4">
          <a href="/" className={`${link} gap-2`}><IconArrow className="h-3.5 w-3.5 rotate-180" /> Back to main site</a>
          <nav aria-label="Site" className="flex items-center gap-5"><a href="/inventory" className={link}>Cars</a><a href="/faq" className={link}>FAQ</a></nav>
        </div>
      </div>
      <header className="border-b border-rule bg-showroom">
        <div className="wrap flex h-[68px] items-center justify-between gap-6 lg:h-[76px]">
          <a href="/" aria-label="Omegi Autos, home" className="shrink-0"><LogoImage height={44} priority /></a>
          <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
            <a href="/" className="u40 text-[15px] font-semibold">Main site</a>
            <a href="/inventory" className="u40 text-[15px] font-semibold">Cars</a>
            <a href="/finance" className="u40 text-[15px] font-semibold">Finance</a>
            <a href="/faq" className="u40 text-[15px] font-semibold">FAQ</a>
          </nav>
          <WhatsAppLink className="btn btn-red min-h-[44px] shrink-0 px-5 text-[14px] lg:min-h-[48px] lg:px-6 lg:text-[15px]"><IconChat /> WhatsApp</WhatsAppLink>
        </div>
      </header>
      <main id="main" tabIndex={-1} className="outline-none">{children}</main>
      <Footer />
    </>
  );
}
