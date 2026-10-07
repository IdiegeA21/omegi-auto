"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, type ComponentProps, type MouseEvent, type ReactNode } from "react";
import { WheelMark } from "@/components/brand/Logo";
import { gsap, prefersReducedMotion } from "@/lib/motion/gsap";
import { gate } from "@/lib/motion/gate";
import { scrollToTop } from "@/lib/motion/scroll";
import { ease } from "@/lib/tokens";

const Ctx = createContext<(href: string) => void>(() => {});
export const useGo = () => useContext(Ctx);

const frame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));

/**
 * Page transition: a red panel slides over the page while the wheel rolls across it, the route changes underneath,
 * then the panel leaves the other way. About 1.1s end to end. Reduced motion: plain navigation.
 */
export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const panel = useRef<HTMLDivElement>(null);
  const wheel = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const waiters = useRef<Array<() => void>>([]);

  useEffect(() => { waiters.current.splice(0).forEach((f: () => void) => f()); }, [pathname]);
  useEffect(() => () => { gsap.killTweensOf([panel.current, wheel.current]); }, []);

  const go = useCallback((href: string) => {
    if (busy.current) return;
    const target = new URL(href, window.location.href);
    if (target.pathname === window.location.pathname && target.search === window.location.search) { scrollToTop(false); return; }
    const p = panel.current, w = wheel.current;
    if (!p || !w || prefersReducedMotion()) { router.push(href); return; }

    busy.current = true;
    gate.close();
    p.style.pointerEvents = "auto";

    const cover = () => new Promise<void>((res) => {
      gsap.timeline({ onComplete: res })
        .fromTo(p, { xPercent: 100 }, { xPercent: 0, duration: 0.55, ease: ease.inOut })
        .fromTo(w, { x: "32vw", rotation: 0 }, { x: 0, rotation: -360, duration: 0.55, ease: ease.inOut }, 0);
    });
    const reveal = () => new Promise<void>((res) => {
      gsap.timeline({ onComplete: res })
        .to(p, { xPercent: -100, duration: 0.55, ease: ease.inOut })
        .to(w, { x: "-32vw", rotation: -720, duration: 0.55, ease: ease.inOut }, 0)
        .add(() => gate.open(), 0.2);
    });

    (async () => {
      try {
        await cover();
        const arrived = new Promise<void>((res) => { waiters.current.push(res); window.setTimeout(res, 2500); });
        router.push(href);
        await arrived;
        scrollToTop(true);
        await frame();
        await reveal();
      } finally {
        gsap.set(p, { xPercent: 100 });
        gsap.set(w, { clearProps: "transform" });
        p.style.pointerEvents = "none";
        gate.open();
        busy.current = false;
      }
    })();
  }, [router]);

  return (
    <Ctx.Provider value={go}>
      {children}
      <div ref={panel} className="tr-panel" aria-hidden="true">
        <div ref={wheel} className="w-[min(34vw,180px)]"><WheelMark className="h-auto w-full" /></div>
      </div>
    </Ctx.Provider>
  );
}

/** next/link that plays the page transition for plain internal clicks. Everything else behaves like a normal link. */
export function TransitionLink({ href, onClick, ...rest }: Omit<ComponentProps<typeof Link>, "href"> & { href: string }) {
  const go = useGo();
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (!href.startsWith("/") || href.startsWith("/#")) return;
    if (rest.target && rest.target !== "_self") return;
    e.preventDefault();
    go(href);
  };
  return <Link href={href} onClick={handle} {...rest} />;
}
