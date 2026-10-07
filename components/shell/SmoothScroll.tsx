"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/motion/gsap";
import { setLenis } from "@/lib/motion/scroll";

/** Lenis driven by GSAP's ticker so ScrollTrigger and smooth scroll share one clock. Native scroll on touch and reduced motion. */
export default function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    setLenis(lenis);
    const sync = () => ScrollTrigger.update();
    lenis.on("scroll", sync);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.off("scroll", sync);
      lenis.destroy();
      setLenis(null);
    };
  }, []);
  return null;
}
