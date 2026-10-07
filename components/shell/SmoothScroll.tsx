"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, isFinePointer, prefersReducedMotion } from "@/lib/motion/gsap";
import { setLenis } from "@/lib/motion/scroll";
import { brand } from "@/config/brand";

/** Lenis on desktop pointers only. Phones keep native scrolling, which is smoother on mid-range devices. */
export default function SmoothScroll() {
  useEffect(() => {
    if (!brand.features.smoothScroll || prefersReducedMotion() || !isFinePointer()) return;
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => { gsap.ticker.remove(tick); lenis.destroy(); setLenis(null); };
  }, []);
  return null;
}
