import { LogoImage } from "@/components/brand/LogoImage";
import Footer from "@/components/shell/Footer";
import { IconArrow, IconChat } from "@/components/shell/Icons";
import OpenGate from "@/components/shell/OpenGate";
import WhatsAppLink from "@/components/shell/WhatsAppLink";

/**
 * Lean chrome for paid-ad traffic: no preloader, smooth scroll, cursor or page transition, so it loads and responds
 * instantly. It is still clearly part of the same site: the logo and "Main site" link lead home, a short row of
 * links reaches the rest of the site, and the footer is the same footer as everywhere else.
 */
export default function AdLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <OpenGate />
      <a href="#main" className="skip">Skip to content</a>
      <header className="border-b border-rule bg-showroom">
        <div className="wrap flex h-[64px] items-center justify-between gap-3 md:h-[72px]">
          <div className="flex items-center gap-4 md:gap-8">
            <a href="/" aria-label="Omegi Autos, home"><LogoImage height={42} priority /></a>
            <nav aria-label="Site" className="hidden items-center gap-6 md:flex">
              <a href="/" className="u40 text-[15px] font-semibold">Main site</a>
              <a href="/inventory" className="u40 text-[15px] font-semibold">Cars</a>
              <a href="/finance" className="u40 text-[15px] font-semibold">Finance</a>
              <a href="/faq" className="u40 text-[15px] font-semibold">FAQ</a>
            </nav>
          </div>
          <div className="flex items-center gap-2.5">
            <a href="/" className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-rule px-4 text-[14px] font-bold hover:bg-paper md:hidden">Main site <IconArrow className="h-3.5 w-3.5" /></a>
            <WhatsAppLink className="btn btn-red min-h-[44px] px-4 text-[14px] md:min-h-[48px] md:px-6 md:text-[15px]"><IconChat /> <span className="hidden sm:inline">Chat on </span>WhatsApp</WhatsAppLink>
          </div>
        </div>
      </header>
      <main id="main" tabIndex={-1} className="outline-none">{children}</main>
      <Footer />
    </>
  );
}
