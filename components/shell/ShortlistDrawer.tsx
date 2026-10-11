"use client";
import Image from "next/image";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { CarSilhouette } from "@/components/brand/CarSilhouette";
import { shortlistEnquiryFromSaved } from "@/lib/enquiryRequests";
import { gsap, prefersReducedMotion } from "@/lib/motion/gsap";
import { lockScroll, unlockScroll } from "@/lib/motion/scroll";
import { MAX_SHORTLIST, removeSaved, useShortlist } from "@/lib/shortlist";
import { ease } from "@/lib/tokens";
import { useEnquiry } from "./EnquirySheet";
import { IconChat, IconClose } from "./Icons";
import { TransitionLink } from "./TransitionLink";
import { useIsolateScroll } from "./useIsolateScroll";

const Ctx = createContext({ open: () => {}, close: () => {} });
export const useShortlistDrawer = () => useContext(Ctx);

/**
 * The shortlist as a side panel first: a quick preview of saved cars, then a choice to send an enquiry, open the
 * full compare page, or keep browsing. Slides in from the right on every screen size.
 */
export function ShortlistProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const saved = useShortlist();
  const enquiry = useEnquiry();
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
    const onOpenEvt = () => setOpen(true);
    d.addEventListener("cancel", onCancel); d.addEventListener("close", onClose); window.addEventListener("omegi:shortlist-open", onOpenEvt);
    return () => { d.removeEventListener("cancel", onCancel); d.removeEventListener("close", onClose); window.removeEventListener("omegi:shortlist-open", onOpenEvt); };
  }, []);

  useEffect(() => {
    const d = dlg.current, p = panel.current, s = scrim.current;
    if (!d || !p || !s) return;
    gsap.killTweensOf([p, s]);
    if (isOpen) {
      if (!d.open) d.showModal();
      window.dispatchEvent(new Event("omegi:toplayer"));
      lockScroll();
      if (!prefersReducedMotion()) {
        gsap.fromTo(s, { opacity: 0 }, { opacity: 1, duration: 0.4 });
        gsap.fromTo(p, { xPercent: 100 }, { xPercent: 0, duration: 0.75, ease: ease.out });
        gsap.fromTo(p.querySelectorAll("[data-row]"), { x: 26, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: ease.out, stagger: 0.07, delay: 0.2 });
      }
      return () => { unlockScroll(); };
    }
    if (d.open) {
      if (prefersReducedMotion()) { d.close(); return; }
      gsap.to(s, { opacity: 0, duration: 0.3 });
      gsap.to(p, { xPercent: 100, duration: 0.5, ease: ease.inOut, onComplete: () => d.close() });
    }
  }, [isOpen]);

  const send = () => {
    if (!saved.length) return;
    setOpen(false);
    window.setTimeout(() => enquiry?.open(shortlistEnquiryFromSaved(saved)), 350);
  };

  return (
    <Ctx.Provider value={{ open, close }}>
      {children}
      <dialog ref={dlg} data-lenis-prevent aria-labelledby="sl-title" className="fixed inset-0 m-0 h-full max-h-none w-full max-w-none border-0 bg-transparent p-0 backdrop:bg-transparent">
        <div ref={scrim} className="absolute inset-0 bg-tarmac/55" onClick={close} />
        <div ref={panel} className="absolute right-0 top-0 flex h-full w-[min(94vw,460px)] flex-col bg-showroom">
          <div className="flex items-start justify-between gap-4 border-b border-rule px-6 pb-4 pt-6">
            <div>
              <p className="t-eyebrow">{saved.length} of {MAX_SHORTLIST} saved</p>
              <h2 id="sl-title" className="t-display mt-1 text-[2.2rem]">Your shortlist</h2>
            </div>
            <button type="button" onClick={close} aria-label="Close shortlist" className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-rule hover:bg-paper"><IconClose /></button>
          </div>

          <div data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-4">
            {saved.length === 0 ? (
              <div data-row className="rounded-3xl bg-paper p-6">
                <p className="text-[1.1rem] font-bold">Nothing saved yet.</p>
                <p className="mt-2 text-[15px] text-mute">Tap the heart on any car to save it here. You can keep up to {MAX_SHORTLIST} and compare them side by side.</p>
                <TransitionLink href="/inventory" onClick={close} className="btn btn-red mt-5">Browse the cars</TransitionLink>
              </div>
            ) : (
              <ul className="grid gap-3">
                {saved.map((c) => (
                  <li key={c.id} data-row className="flex items-center gap-4 rounded-2xl border border-rule p-3">
                    <TransitionLink href={c.slug ? `/inventory/${c.slug}` : "/inventory"} onClick={close} className="relative block h-[66px] w-[88px] shrink-0 overflow-hidden rounded-xl bg-tarmac" aria-label={`Open ${c.title}`}>
                      {c.image ? <Image src={c.image} alt="" fill sizes="88px" className="object-cover" /> : <CarSilhouette className="absolute inset-x-[6%] top-[22%] w-[88%] text-white/[.2]" />}
                    </TransitionLink>
                    <div className="min-w-0 flex-1">
                      <TransitionLink href={c.slug ? `/inventory/${c.slug}` : "/inventory"} onClick={close} className="block truncate text-[15px] font-bold">{c.title}</TransitionLink>
                      <p className="mt-0.5 text-[13px] text-mute">{c.figure ?? "Ask for price"}</p>
                    </div>
                    <button type="button" onClick={() => removeSaved(c.id)} aria-label={`Remove ${c.title}`} className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-mute hover:bg-paper hover:text-omegi"><IconClose className="h-4 w-4" /></button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div data-row className="grid gap-2.5 border-t border-rule bg-paper px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <button type="button" onClick={send} disabled={saved.length === 0} className="btn btn-red w-full disabled:opacity-40"><IconChat /> Send enquiry</button>
            <div className="grid grid-cols-2 gap-2.5">
              <TransitionLink href="/shortlist" onClick={close} className="btn btn-ink">Open shortlist page</TransitionLink>
              <button type="button" onClick={close} className="btn btn-line">Keep browsing</button>
            </div>
          </div>
        </div>
      </dialog>
    </Ctx.Provider>
  );
}
