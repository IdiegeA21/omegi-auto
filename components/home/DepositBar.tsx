"use client";
import { useEffect, useRef } from "react";
import { WheelMark } from "@/components/brand/WheelMark";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/motion/gsap";
import { ease } from "@/lib/tokens";
import { brand } from "@/config/brand";

/**
 * The signature moment. The track stands for the price of a car. The wheel rolls along it and stops at the 40% mark,
 * the red segment grows exactly as far as the wheel's centre, and "Drive." arrives. The wheel's turn is computed from
 * the distance it travels, so it rolls rather than slides. Transform and opacity only; plays once on entering view.
 */
export default function DepositBar() {
  const root = useRef<HTMLDivElement>(null);
  const pct = brand.finance.downPaymentPercent / 100;

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const track = el.querySelector<HTMLElement>(".dbar__track")!, fill = el.querySelector(".dbar__fill")!, wheel = el.querySelector<HTMLElement>(".dbar__wheel")!;
    const labels = el.querySelectorAll("[data-label]"), drive = el.querySelector(".dbar__drive > span")!;
    const R = () => wheel.offsetWidth / 2;
    const dist = () => track.offsetWidth * pct;
    const turn = () => (dist() / R()) * (180 / Math.PI);

    let done = false;
    const onResize = () => { if (done) gsap.set(wheel, { x: dist(), rotation: turn() }); };
    window.addEventListener("resize", onResize);

    if (prefersReducedMotion()) {
      gsap.set(fill, { scaleX: pct }); gsap.set(wheel, { x: dist(), rotation: turn() }); done = true;
      return () => window.removeEventListener("resize", onResize);
    }

    const ctx = gsap.context(() => {
      gsap.set(fill, { scaleX: 0 }); gsap.set(wheel, { x: 0, rotation: 0 }); gsap.set(labels, { opacity: 0, y: 12 }); gsap.set(drive, { yPercent: 110 });
      const tl = gsap.timeline({ paused: true, onComplete: () => { done = true; } });
      tl.to(fill, { scaleX: pct, duration: 1.9, ease: "power3.inOut" }, 0)
        .to(wheel, { x: () => dist(), rotation: () => turn(), duration: 1.9, ease: "power3.inOut" }, 0)
        .to(labels, { opacity: 1, y: 0, duration: 0.7, ease: ease.out, stagger: 0.12 }, 1.55)
        .to(drive, { yPercent: 0, duration: 0.9, ease: ease.out }, 1.75);
      ScrollTrigger.create({ trigger: el, start: "top 78%", once: true, onEnter: () => tl.play() });
    }, el);
    return () => { window.removeEventListener("resize", onResize); ctx.revert(); };
  }, [pct]);

  return (
    <div ref={root} className="dbar" style={{ ["--pct" as string]: pct }}>
      <div className="dbar__drive" aria-hidden="true"><span className="t-display t-d2">Drive.</span></div>
      <div className="dbar__rail">
        <div className="dbar__track"><div className="dbar__fill" /></div>
        <div className="dbar__tick" aria-hidden="true" />
        <div className="dbar__wheel" aria-hidden="true"><WheelMark className="h-full w-full" /></div>
      </div>
      <div className="dbar__labels" aria-hidden="true">
        <span className="dbar__l0"><span data-label className="block">Price of the car</span></span>
        <span className="dbar__l40"><span data-label className="block">{brand.finance.downPaymentPercent}% now</span></span>
        <span className="dbar__l100"><span data-label className="block">Balance</span></span>
      </div>
      <p className="sr-only">{`Pay ${brand.finance.downPaymentPercent} percent of the price now, then drive. ${brand.finance.termsNote}`}</p>
    </div>
  );
}
