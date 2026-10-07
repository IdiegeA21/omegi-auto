"use client";
import { useEffect, useRef, useState } from "react";
import { gsap, isFinePointer, prefersReducedMotion } from "@/lib/motion/gsap";
import { WheelMark } from "@/components/brand/Logo";
import { brand } from "@/config/brand";

/** A small wheel that trails the pointer and spins with horizontal movement. Desktop fine pointers only. Native cursor stays visible. */
export default function Cursor() {
  const root = useRef<HTMLDivElement>(null);
  const spin = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => { setOn(brand.features.cursor && isFinePointer() && !prefersReducedMotion()); }, []);

  useEffect(() => {
    if (!on) return;
    const el = root.current, sp = spin.current;
    if (!el || !sp) return;
    const promote = () => { try { el.hidePopover(); el.showPopover(); } catch {} };
    promote();
    gsap.set(el, { xPercent: -50, yPercent: -50, x: -100, y: -100 });
    const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3" });
    const rTo = gsap.quickTo(sp, "rotation", { duration: 0.6, ease: "power3" });
    let rot = 0, lastX = 0, seen = false, hot = false;
    const move = (e: PointerEvent) => {
      if (!seen) { seen = true; gsap.set(el, { x: e.clientX, y: e.clientY }); gsap.to(el, { opacity: 1, duration: 0.3 }); lastX = e.clientX; }
      xTo(e.clientX); yTo(e.clientY);
      rot += (e.clientX - lastX) * 0.9; lastX = e.clientX; rTo(rot);
    };
    const over = (e: PointerEvent) => {
      const t = (e.target as Element | null)?.closest?.("a, button, [data-cursor], input, select, textarea, summary, label");
      const next = !!t;
      if (next !== hot) { hot = next; el.classList.toggle("is-hot", next); gsap.to(el, { scale: next ? 1.7 : 1, duration: 0.35, ease: "power3.out", overwrite: "auto" }); }
    };
    const leave = () => gsap.to(el, { opacity: 0, duration: 0.2 });
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    window.addEventListener("omegi:toplayer", promote);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
      window.removeEventListener("omegi:toplayer", promote);
      gsap.killTweensOf([el, sp]);
      try { el.hidePopover(); } catch {}
    };
  }, [on]);

  if (!on) return null;
  return (
    <div ref={root} popover="manual" className="cursor" aria-hidden="true">
      <div ref={spin} className="h-full w-full"><WheelMark className="h-full w-full" /></div>
    </div>
  );
}
