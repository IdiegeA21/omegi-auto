import type Lenis from "lenis";

let lenis: Lenis | null = null;
let locks = 0;

export const setLenis = (l: Lenis | null) => { lenis = l; };
export const getLenis = () => lenis;

export function lockScroll() {
  locks++;
  lenis?.stop();
  document.documentElement.style.overflow = "hidden";
}
export function unlockScroll() {
  locks = Math.max(0, locks - 1);
  if (locks === 0) {
    lenis?.start();
    document.documentElement.style.overflow = "";
  }
}
export function scrollToTop(immediate = true) {
  if (lenis) lenis.scrollTo(0, { immediate, force: true });
  else window.scrollTo({ top: 0, behavior: immediate ? "auto" : "smooth" });
}
