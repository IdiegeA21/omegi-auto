"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { gsap, prefersReducedMotion } from "@/lib/motion/gsap";
import { lockScroll, unlockScroll } from "@/lib/motion/scroll";
import { ease } from "@/lib/tokens";
import { brand } from "@/config/brand";
import { menuGroups } from "@/config/nav";
import { TransitionLink } from "./TransitionLink";
import { useIsolateScroll } from "./useIsolateScroll";
import WhatsAppLink from "./WhatsAppLink";
import { IconChat, IconClose, IconInstagram } from "./Icons";

const Ctx = createContext({ isOpen: false, open: () => {}, close: () => {} });
export const useMenu = () => useContext(Ctx);

/** Full index of the site. Bottom sheet on phones, right-hand panel on desktop. Native <dialog>: focus trap, Esc, inert page. */
export function MenuProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const dlg = useRef<HTMLDialogElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const scrim = useRef<HTMLDivElement>(null);
  useIsolateScroll(dlg);
  const open = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const d = dlg.current;
    if (!d) return;
    const onCancel = (e: Event) => { e.preventDefault(); setOpen(false); };
    const onClose = () => setOpen(false);
    d.addEventListener("cancel", onCancel);
    d.addEventListener("close", onClose);
    return () => { d.removeEventListener("cancel", onCancel); d.removeEventListener("close", onClose); };
  }, []);

  useEffect(() => {
    const d = dlg.current, p = panel.current, s = scrim.current;
    if (!d || !p || !s) return;
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const off = mobile ? { yPercent: 100 } : { xPercent: 100 };
    const on = { yPercent: 0, xPercent: 0 };
    gsap.killTweensOf([p, s]);

    if (isOpen) {
      if (!d.open) d.showModal();
      window.dispatchEvent(new Event("omegi:toplayer"));
      lockScroll();
      if (!prefersReducedMotion()) {
        gsap.fromTo(s, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" });
        gsap.fromTo(p, off, { ...on, duration: 0.7, ease: ease.out });
        gsap.fromTo(p.querySelectorAll("[data-row]"), { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: ease.out, stagger: 0.03, delay: 0.12 });
      }
      return () => { unlockScroll(); };
    }
    if (d.open) {
      if (prefersReducedMotion()) { d.close(); return; }
      gsap.to(s, { opacity: 0, duration: 0.35 });
      gsap.to(p, { ...off, duration: 0.45, ease: ease.inOut, onComplete: () => d.close() });
    }
  }, [isOpen]);

  return (
    <Ctx.Provider value={{ isOpen, open, close }}>
      {children}
      <dialog ref={dlg} data-lenis-prevent aria-label="Site menu" className="fixed inset-0 m-0 h-full max-h-none w-full max-w-none border-0 bg-transparent p-0 backdrop:bg-transparent">
        <div ref={scrim} className="absolute inset-0 bg-tarmac/55" onClick={close} />
        <div ref={panel} className="absolute inset-x-0 bottom-0 flex max-h-[90dvh] flex-col overflow-hidden rounded-t-[1.75rem] bg-showroom md:inset-x-auto md:right-0 md:top-0 md:max-h-none md:h-full md:w-[480px] md:rounded-none">
          <div className="flex items-center justify-between px-6 pb-2 pt-5">
            <p className="t-eyebrow">Menu</p>
            <button type="button" onClick={close} className="grid h-11 w-11 place-items-center rounded-full border border-rule hover:bg-paper" aria-label="Close menu"><IconClose /></button>
          </div>
          <nav data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-4" aria-label="Site">
            {menuGroups.map((g) => (
              <section key={g.title} className="pt-4">
                <h2 data-row className="t-eyebrow">{g.title}</h2>
                <ul>
                  {g.items.map((i) => (
                    <li key={i.href} data-row>
                      <TransitionLink href={i.href} onClick={close} className="group flex items-baseline justify-between gap-4 border-b border-rule py-3">
                        <span className="t-display text-[1.7rem] transition-colors duration-300 group-hover:text-omegi">{i.label}</span>
                        {i.hint && <span className="text-[13px] text-mute">{i.hint}</span>}
                      </TransitionLink>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </nav>
          <div data-row className="grid gap-2.5 border-t border-rule bg-paper px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <WhatsAppLink className="btn btn-red w-full"><IconChat /> Chat on WhatsApp</WhatsAppLink>
            <a href={brand.contacts.instagram.url} target="_blank" rel="noopener noreferrer" className="btn btn-line w-full"><IconInstagram /> @{brand.contacts.instagram.handle}<span className="sr-only"> (opens in a new tab)</span></a>
          </div>
        </div>
      </dialog>
    </Ctx.Provider>
  );
}
