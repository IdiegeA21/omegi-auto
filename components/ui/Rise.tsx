"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/motion/gsap";
import { gate } from "@/lib/motion/gate";
import { ease } from "@/lib/tokens";

/** Children marked data-rise fade up in batches as they enter the viewport, once. Visible without JS; never leaves anything hidden. */
export default function Rise({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const items = Array.from(el.querySelectorAll<HTMLElement>("[data-rise]"));
    const show = () => items.forEach((i) => i.setAttribute("data-in", ""));
    if (prefersReducedMotion()) { show(); return; }
    let ctx: gsap.Context | null = null;
    const cancel = gate.whenOpen(() => {
      ctx = gsap.context(() => {
        ScrollTrigger.batch(items, {
          start: "top 90%", once: true,
          onEnter: (batch) => {
            gsap.fromTo(batch, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: ease.out, stagger: 0.08,
              onComplete: () => batch.forEach((b) => { b.setAttribute("data-in", ""); gsap.set(b, { clearProps: "transform,opacity" }); }) });
          },
        });
      }, el);
    });
    return () => { cancel(); ctx?.revert(); show(); };
  }, []);
  return <div ref={ref} className={className}>{children}</div>;
}
