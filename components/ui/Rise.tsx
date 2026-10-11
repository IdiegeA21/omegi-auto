"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { gsap, prefersReducedMotion } from "@/lib/motion/gsap";
import { ease } from "@/lib/tokens";

/**
 * Children marked data-rise fade up as they scroll into view. Content is visible by default: only items that are
 * still below the fold when this mounts are marked pending (hidden), and an IntersectionObserver releases them.
 * If scripts fail, nothing is ever left hidden.
 */
export default function Rise({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || typeof IntersectionObserver === "undefined") return;
    const items = Array.from(el.querySelectorAll<HTMLElement>("[data-rise]")).filter((i) => i.getBoundingClientRect().top > window.innerHeight * 0.92);
    if (items.length === 0) return;
    items.forEach((i) => i.setAttribute("data-pending", ""));
    const release = (batch: HTMLElement[]) => {
      gsap.fromTo(batch, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: ease.out, stagger: 0.08,
        onStart: () => batch.forEach((b) => b.removeAttribute("data-pending")),
        onComplete: () => gsap.set(batch, { clearProps: "transform,opacity" }) });
    };
    const io = new IntersectionObserver((entries) => {
      const hit = entries.filter((e) => e.isIntersecting).map((e) => e.target as HTMLElement);
      if (hit.length) { hit.forEach((t) => io.unobserve(t)); release(hit); }
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.01 });
    items.forEach((i) => io.observe(i));
    return () => { io.disconnect(); gsap.killTweensOf(items); items.forEach((i) => { i.removeAttribute("data-pending"); gsap.set(i, { clearProps: "transform,opacity" }); }); };
  }, []);
  return <div ref={ref} className={className}>{children}</div>;
}
