"use client";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { WheelMark } from "@/components/brand/WheelMark";
import { routeLabel } from "@/config/nav";
import { gsap, prefersReducedMotion } from "@/lib/motion/gsap";
import { gate } from "@/lib/motion/gate";
import { lockScroll, scrollToTop, unlockScroll } from "@/lib/motion/scroll";
import { ease } from "@/lib/tokens";

import { TransitionCtx } from "./transitionContext";

/** Seconds. Intro ≈ 1.1s, exit ≈ 0.9s: slow enough to read where you are going, short enough not to get in the way. */
const T = { cover: 0.62, lag: 0.08, labelAt: 0.5, wheelAt: 0.56, exit: 0.8 };
const frame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));

/**
 * The signature page transition: a drive-through.
 *  1. A black panel then a red panel sweep across, always left to right, so the direction never reverses.
 *  2. While you are covered, the destination's name rises ("Taking you to / Cars"), so you are never disoriented.
 *  3. A wheel rolls along a rail that lives INSIDE the red panel. Its spin is computed from the distance it travels (it
 *     rolls, it doesn't slide), pausing at the halfway mark while the new page arrives.
 *  4. The panels drive on off the right edge and the new page's own entrances play as the screen clears.
 * Transform and opacity only. Reduced motion: plain navigation. Never traps the user: a timeout guarantees the exit.
 */
export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const root = useRef<HTMLDivElement>(null);
  const a = useRef<HTMLDivElement>(null);
  const b = useRef<HTMLDivElement>(null);
  const kicker = useRef<HTMLParagraphElement>(null);
  const label = useRef<HTMLParagraphElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const wheel = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const waiters = useRef<Array<() => void>>([]);

  useEffect(() => { waiters.current.splice(0).forEach((f: () => void) => f()); }, [pathname]);
  useEffect(() => () => { gsap.killTweensOf([a.current, b.current, kicker.current, label.current, rail.current, wheel.current]); }, []);

  const go = useCallback((href: string) => {
    if (busy.current) return;
    const target = new URL(href, window.location.href);
    if (target.pathname === window.location.pathname && target.search === window.location.search) { scrollToTop(false); return; }
    const r = root.current, pa = a.current, pb = b.current, kk = kicker.current, lb = label.current, rl = rail.current, wh = wheel.current;
    if (!r || !pa || !pb || !kk || !lb || !rl || !wh || prefersReducedMotion()) { router.push(href); return; }

    busy.current = true;
    gate.close();
    lockScroll();
    lb.textContent = routeLabel(href);
    // Place everything BEFORE the layer becomes visible. x/y are zeroed explicitly so no parsed CSS transform can ever stack
    // with xPercent (GSAP reads a CSS transform as pixels, which is what left the panels off-screen before).
    gsap.set([pa, pb], { x: 0, y: 0, xPercent: -101 });
    gsap.set([kk, lb], { x: 0, y: 44, opacity: 0 });
    gsap.set(rl, { opacity: 0 });
    gsap.set(wh, { x: 0, y: 0, rotation: 0 });
    r.setAttribute("data-on", "");
    const railW = rl.offsetWidth, R = wh.offsetWidth / 2;
    const roll = (frac: number) => ({ x: railW * frac, rotation: ((railW * frac) / R) * (180 / Math.PI) });

    let arrived: Promise<void> = Promise.resolve();
    const intro = () => new Promise<void>((res) => {
      gsap.timeline({ onComplete: res })
        .to(pa, { xPercent: 0, duration: T.cover, ease: "power3.inOut" }, 0)
        .to(pb, { xPercent: 0, duration: T.cover, ease: "power3.inOut" }, T.lag)
        .add(() => {
          // fully covered: now it is safe to swap the route underneath
          arrived = new Promise<void>((done) => { waiters.current.push(done); window.setTimeout(done, 3000); });
          router.push(href);
        }, T.cover + T.lag)
        .to([kk, lb], { opacity: 1, y: 0, duration: 0.7, ease: ease.out, stagger: 0.07 }, T.labelAt)
        .to(rl, { opacity: 1, duration: 0.4 }, T.labelAt)
        .to(wh, { ...roll(0.5), duration: 0.55, ease: "power2.out" }, T.wheelAt);
    });
    const exit = () => new Promise<void>((res) => {
      gsap.timeline({ onComplete: res })
        .to([kk, lb], { opacity: 0, y: -28, duration: 0.35, ease: "power2.in", stagger: 0.04 }, 0)
        .to(wh, { ...roll(1), duration: 0.85, ease: "power2.inOut" }, 0)
        .to(pb, { xPercent: 101, duration: T.exit, ease: "power3.inOut" }, 0.08)
        .to(pa, { xPercent: 101, duration: T.exit, ease: "power3.inOut" }, 0.08 + T.lag)
        .add(() => gate.open(), 0.4);
    });

    (async () => {
      try {
        await intro();
        await arrived;
        scrollToTop(true);
        await frame();
        await exit();
      } finally {
        gsap.set([pa, pb], { x: 0, y: 0, xPercent: -101 });
        gsap.set([kk, lb, rl, wh], { clearProps: "all" });
        r.removeAttribute("data-on");
        unlockScroll();
        gate.open();
        busy.current = false;
      }
    })();
  }, [router]);

  return (
    <TransitionCtx.Provider value={go}>
      {children}
      <div ref={root} className="tr" aria-hidden="true">
        <div ref={a} className="tr__a" />
        <div ref={b} className="tr__b">
          <div className="tr__stage">
            <p ref={kicker} className="tr__kicker">Taking you to</p>
            <p ref={label} className="tr__label t-display" />
          </div>
          {/* The rail and wheel are children of the red panel, so they can never appear before it does. */}
          <div ref={rail} className="tr__rail"><div className="tr__line" /><div ref={wheel} className="tr__wheel"><WheelMark className="h-full w-full" /></div></div>
        </div>
      </div>
    </TransitionCtx.Provider>
  );
}
