"use client";
import { useEffect, useRef } from "react";
import Logo from "@/components/brand/Logo";
import { gsap, prefersReducedMotion } from "@/lib/motion/gsap";
import { gate } from "@/lib/motion/gate";
import { lockScroll, unlockScroll } from "@/lib/motion/scroll";
import { ease } from "@/lib/tokens";
import { brand } from "@/config/brand";

/**
 * First visit per session only.
 *  1. The logo assembles from its own parts in pure CSS (app/preloader.css), starting at first paint, so a slow
 *     connection never sits on a blank screen. The wheel rolls in with its turn linked to its travel.
 *  2. Once those animations end and JS is ready, GSAP holds a beat, lifts the white curtain (the logo drifts down
 *     against it for depth) and lights the stage so the page's own entrances play where they can be seen.
 * Transform and opacity only. A hard timeout guarantees the page is never held.
 */
export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const html = document.documentElement;
    if (!el) return;
    if (html.dataset.seen === "1" || !brand.features.preloader) { gate.open(); return; }

    let locked = true, finished = false, cancelled = false;
    lockScroll();
    const release = () => { if (locked) { locked = false; unlockScroll(); } };
    const finish = () => {
      if (finished) return;
      finished = true;
      try { sessionStorage.setItem("omegi-seen", "1"); } catch {}
      html.dataset.seen = "1";
      release();
      gate.open();
    };
    const safety = window.setTimeout(finish, 8000);
    let ctx: gsap.Context | null = null;

    // Wait for the CSS intro (not the long failsafe animation) to finish, then play the exit.
    const intro = el.getAnimations({ subtree: true }).filter((a: Animation) => (a as CSSAnimation).animationName !== "pl-failsafe");
    Promise.all(intro.map((a: Animation) => a.finished.catch(() => undefined))).then(() => {
      if (cancelled) return;
      if (prefersReducedMotion()) {
        gsap.to(el, { opacity: 0, duration: 0.4, delay: 0.4, onComplete: () => { el.style.display = "none"; finish(); } });
        return;
      }
      ctx = gsap.context(() => {
        gsap.timeline({ onComplete: () => { el.style.display = "none"; finish(); } })
          .to(el, { yPercent: -100, duration: 0.9, ease: ease.inOut }, 0.35)
          .to(el.querySelector(".pl-logo"), { yPercent: 18, duration: 0.9, ease: ease.inOut }, 0.35)
          .add(() => gate.open(), 0.8);
      }, el);
    });

    return () => { cancelled = true; window.clearTimeout(safety); ctx?.revert(); gsap.killTweensOf(el); release(); };
  }, []);

  return (
    <div ref={root} className="preloader" aria-hidden="true">
      <div className="pl-logo w-[min(78vw,540px)]"><Logo tone="light" className="w-full" /></div>
    </div>
  );
}
