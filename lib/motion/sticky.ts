"use client";
import { useEffect, useRef, type RefObject } from "react";

/**
 * Scroll progress (0 to 1) of a tall "track" element while its first child is stuck (position: sticky).
 *
 * Why not ScrollTrigger pin? Pinning swaps the element to position:fixed and inserts spacers, and it must be
 * re-measured whenever the page height changes. On real phones the address bar sliding in and out changes the
 * viewport mid-scroll, which can leave a pinned section stranded (we saw a pinned globe vanish on iOS and Android).
 * Sticky is handled natively by the browser, needs no measuring, and we only read the track's rect.
 */
export function useStickyProgress(track: RefObject<HTMLElement | null>, onProgress: (p: number, el: HTMLElement) => void, deps: unknown[] = []) {
  const cb = useRef(onProgress);
  cb.current = onProgress;
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let raf = 0, last = -1;
    const read = () => {
      raf = 0;
      const stuck = el.firstElementChild as HTMLElement | null;
      const r = el.getBoundingClientRect();
      const total = r.height - (stuck?.offsetHeight ?? window.innerHeight);
      const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
      if (p !== last) { last = p; cb.current(p, el); }
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(read); };
    read();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const ro = new ResizeObserver(() => { last = -1; schedule(); });
    ro.observe(el);
    return () => { window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); ro.disconnect(); cancelAnimationFrame(raf); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
