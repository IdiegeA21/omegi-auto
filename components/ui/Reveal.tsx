"use client";
import { createElement, useEffect, useRef, type ElementType } from "react";
import { gsap, prefersReducedMotion } from "@/lib/motion/gsap";
import { gate } from "@/lib/motion/gate";
import { ease } from "@/lib/tokens";

/** Headline whose words rise into place once the stage is lit (preloader or page transition finished). Visible without JS. */
export default function Reveal({ text, as = "h2", className = "", delay = 0, stagger = 0.07 }: { text: string; as?: ElementType; className?: string; delay?: number; stagger?: number }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const inner = el.querySelectorAll<HTMLElement>(".rv-i");
    const show = () => { el.classList.add("is-in"); gsap.set(inner, { clearProps: "transform" }); };
    if (prefersReducedMotion()) { show(); return; }
    let tween: gsap.core.Tween | null = null;
    const cancel = gate.whenOpen(() => {
      tween = gsap.fromTo(inner, { yPercent: 105 }, { yPercent: 0, duration: 1.05, ease: ease.out, stagger, delay, onComplete: show });
    });
    return () => { cancel(); tween?.kill(); show(); };
  }, [text, delay, stagger]);

  const words = text.split(" ");
  return createElement(
    as,
    { ref, className: `rv ${className}`, "aria-label": text },
    words.map((w, i) => (
      <span key={i} aria-hidden="true">
        <span className="rv-w"><span className="rv-i">{w}</span></span>
        {i < words.length - 1 ? " " : null}
      </span>
    )),
  );
}
