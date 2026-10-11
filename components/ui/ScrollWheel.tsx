"use client";
import { useEffect, useRef } from "react";
import { WheelMark } from "@/components/brand/WheelMark";
import { gsap, prefersReducedMotion } from "@/lib/motion/gsap";

/** A large faint wheel behind a page head that turns as you scroll the page. Decorative; transform only; still under reduced motion. */
export default function ScrollWheel({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const t = gsap.to(el, { rotation: 300, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.6 } });
    return () => { t.scrollTrigger?.kill(); t.kill(); };
  }, []);
  return <div ref={ref} aria-hidden="true" className={className}><WheelMark className="h-full w-full" /></div>;
}
