"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { TransitionLink } from "./Transition";
import WhatsAppLink from "./WhatsAppLink";
import { useMenu } from "./MenuSheet";
import { IconCar, IconChat, IconMenu, IconPercent } from "./Icons";

/**
 * Phones only. Three tabs and the WhatsApp action, always reachable with a thumb.
 * It is not an overlay: the page reserves its height (.site-pad), so it never covers content.
 * It slides away while a form field is focused so it can't sit on top of the keyboard.
 */
export default function Dock() {
  const pathname = usePathname();
  const { open } = useMenu();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const isField = (t: EventTarget | null) => t instanceof HTMLElement && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName);
    let t = 0;
    const inn = (e: FocusEvent) => { if (isField(e.target)) { window.clearTimeout(t); setHidden(true); } };
    const out = () => { t = window.setTimeout(() => setHidden(false), 120); };
    document.addEventListener("focusin", inn);
    document.addEventListener("focusout", out);
    return () => { window.clearTimeout(t); document.removeEventListener("focusin", inn); document.removeEventListener("focusout", out); };
  }, []);

  const tab = "relative flex min-h-[52px] flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold";
  const mark = (on: boolean) => on ? <span aria-hidden="true" className="absolute left-1/2 top-0 h-[3px] w-[40%] -translate-x-1/2 bg-omegi" /> : null;
  const onCars = pathname.startsWith("/inventory"), onPay = pathname.startsWith("/pay-40");

  return (
    <nav aria-label="Quick actions" data-hidden={hidden} className="dock fixed inset-x-0 bottom-0 z-40 border-t border-rule bg-showroom transition-transform duration-300 ease-out md:hidden">
      <div className="flex h-[var(--dock-h)] items-stretch gap-1 px-2">
        <TransitionLink href="/inventory" aria-current={onCars ? "page" : undefined} className={tab}>{mark(onCars)}<IconCar />Cars</TransitionLink>
        <TransitionLink href="/pay-40" aria-current={onPay ? "page" : undefined} className={tab}>{mark(onPay)}<IconPercent />Pay 40%</TransitionLink>
        <button type="button" onClick={open} className={tab}><IconMenu />More</button>
        <WhatsAppLink className="btn btn-red my-2 ml-1 min-h-0 flex-[1.7] px-3 text-[13px]"><IconChat className="h-[18px] w-[18px]" /> WhatsApp</WhatsAppLink>
      </div>
    </nav>
  );
}
