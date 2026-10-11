"use client";
import { useEffect, type RefObject } from "react";

/**
 * While a panel is open the page scroll is locked (Lenis is stopped), and a stopped Lenis cancels every wheel event
 * on the window, which would also kill scrolling INSIDE the panel. Wheel and touch events inside the panel therefore
 * stop here instead of reaching the window, so the panel's own overflow scrolls natively.
 * Pair with data-lenis-prevent on the same element.
 */
export function useIsolateScroll(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const stop = (e: Event) => e.stopPropagation();
    el.addEventListener("wheel", stop, { passive: true });
    el.addEventListener("touchmove", stop, { passive: true });
    return () => { el.removeEventListener("wheel", stop); el.removeEventListener("touchmove", stop); };
  }, [ref]);
}
