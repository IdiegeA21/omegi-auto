"use client";
import { usePathname } from "next/navigation";
import { LogoImage } from "@/components/brand/Logo";
import Magnetic from "@/components/ui/Magnetic";
import { primaryNav } from "@/config/nav";
import { useShortlist } from "@/lib/shortlist";
import { TransitionLink } from "./Transition";
import WhatsAppLink from "./WhatsAppLink";
import { useMenu } from "./MenuSheet";
import { IconChat, IconHeart, IconMenu } from "./Icons";

/** Light, solid, sticky. Desktop: logo, four links drawn with the 40% bar, Menu, shortlist, WhatsApp. Phones: logo and shortlist (the dock carries the rest). */
export default function Header() {
  const pathname = usePathname();
  const { open } = useMenu();
  const saved = useShortlist().length;

  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-showroom">
      <div className="wrap flex h-header items-center justify-between gap-6">
        <TransitionLink href="/" aria-label="Omegi Autos, home" className="shrink-0"><LogoImage height={44} priority className="md:hidden" /><LogoImage height={54} priority className="hidden md:block" /></TransitionLink>

        <nav aria-label="Primary" className="hidden items-center gap-9 md:flex">
          {primaryNav.map((n) => (
            <TransitionLink key={n.href} href={n.href} aria-current={pathname.startsWith(n.href) ? "page" : undefined} className="u40 text-[15px] font-semibold">{n.label}</TransitionLink>
          ))}
          <button type="button" onClick={open} className="u40 text-[15px] font-semibold">More</button>
        </nav>

        <div className="flex items-center gap-2.5">
          <TransitionLink href="/shortlist" className="relative grid h-11 w-11 place-items-center rounded-full border border-rule hover:bg-paper" aria-label={`Shortlist, ${saved} saved`}>
            <IconHeart />
            {saved > 0 && <span aria-hidden="true" className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-omegi px-1 text-[11px] font-bold text-white">{saved}</span>}
          </TransitionLink>
          <Magnetic className="hidden md:inline-flex">
            <WhatsAppLink className="btn btn-red"><IconChat /> Chat on WhatsApp</WhatsAppLink>
          </Magnetic>
          <button type="button" onClick={open} className="grid h-11 w-11 place-items-center rounded-full border border-rule hover:bg-paper md:hidden" aria-label="Open menu"><IconMenu /></button>
        </div>
      </div>
    </header>
  );
}
