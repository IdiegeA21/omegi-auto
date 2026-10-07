"use client";
import { useEffect, useRef, useState } from "react";
import { gsap, isFinePointer, prefersReducedMotion } from "@/lib/motion/gsap";
import { dur } from "@/lib/tokens";

/** Desktop-only. Never mounts on touch or reduced motion. Dot follows tightly, ring trails. */
export default function Cursor() {
  const [on, setOn] = useState(false);
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => { if (isFinePointer() && !prefersReducedMotion()) setOn(true); }, []);

  useEffect(() => {
    if (!on) return;
    document.body.classList.add("has-cursor");
    const d = dot.current!, r = ring.current!;
    gsap.set([d, r], { xPercent: 0, opacity: 0 });
    const dx = gsap.quickTo(d, "x", { duration: 0.12, ease: "power3.out" });
    const dy = gsap.quickTo(d, "y", { duration: 0.12, ease: "power3.out" });
    const rx = gsap.quickTo(r, "x", { duration: 0.45, ease: "power3.out" });
    const ry = gsap.quickTo(r, "y", { duration: 0.45, ease: "power3.out" });
    let shown = false;
    const move = (e: PointerEvent) => {
      if (!shown) { shown = true; gsap.set([d, r], { x: e.clientX, y: e.clientY }); gsap.to([d, r], { opacity: 1, duration: dur.fast }); }
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const t = (e.target as Element).closest?.("a,button,[data-cursor]") as HTMLElement | null;
      const text = t?.dataset.cursorLabel ?? "";
      if (label.current) label.current.textContent = text;
      gsap.to(r, { scale: t ? (text ? 2 : 1.6) : 1, backgroundColor: t && text ? "rgba(200,16,46,1)" : t ? "rgba(200,16,46,.12)" : "rgba(200,16,46,0)", duration: dur.fast, overwrite: "auto" });
      if (label.current) gsap.to(label.current, { opacity: text ? 1 : 0, duration: dur.fast });
    };
    const leave = () => gsap.to([d, r], { opacity: 0, duration: dur.fast });
    const enter = () => { if (shown) gsap.to([d, r], { opacity: 1, duration: dur.fast }); };
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    document.documentElement.addEventListener("pointerenter", enter);
    return () => {
      document.body.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.documentElement.removeEventListener("pointerenter", enter);
      gsap.killTweensOf([d, r]);
    };
  }, [on]);

  // The contact modal is a native <dialog>, which lives in the browser's top layer and paints above any z-index.
  // The cursor therefore joins the top layer too (popover), and is re-promoted each time a dialog opens
  // (a later top-layer entry sits above an earlier one), so the pointer is never hidden behind a modal.
  useEffect(() => {
    if (!on) return;
    const els = [ring.current, dot.current] as (HTMLElement | null)[];
    const promote = () => els.forEach((el) => { if (!el || !("showPopover" in el)) return; try { if (el.matches(":popover-open")) el.hidePopover(); el.showPopover(); } catch {} });
    promote();
    window.addEventListener("omegi:toplayer", promote);
    return () => { window.removeEventListener("omegi:toplayer", promote); els.forEach((el) => { try { el?.hidePopover?.(); } catch {} }); };
  }, [on]);

  if (!on) return null;
  return (
    <div aria-hidden="true">
      <div ref={ring} popover="manual" className="cursor-ring"><span ref={label} /></div>
      <div ref={dot} popover="manual" className="cursor-dot" />
    </div>
  );
}
