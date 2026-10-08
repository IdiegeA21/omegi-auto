"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import CarMedia from "@/components/car/CarMedia";
import PaymentBlock from "@/components/car/PaymentBlock";
import { IconChat, IconChevron, IconPause, IconPlay } from "@/components/shell/Icons";
import { TransitionLink } from "@/components/shell/Transition";
import EnquiryButton from "@/components/shell/EnquiryButton";
import { carEnquiry } from "@/lib/enquiryRequests";
import { brand } from "@/config/brand";
import { heroSlideMs } from "@/config/ui";
import { carTitle } from "@/lib/carTitle";
import { resolvePayment } from "@/lib/payment";
import { gsap, prefersReducedMotion } from "@/lib/motion/gsap";
import { gate } from "@/lib/motion/gate";
import { ease } from "@/lib/tokens";
import type { PublicCar } from "@/types/car";

/**
 * Minimal hero: one car at a time, the car's name is the headline. The "Pay 40% and drive" tag appears ONLY on
 * cars with installment open; other slides show their plain price or "Ask for price".
 * Auto-advances with a pause control, pauses on hover/focus, swipes on touch, arrow keys work.
 * Only the first slide's image is eager; the next slide's image is allowed to load once it is next in line.
 */
export default function Hero({ cars }: { cars: PublicCar[] }) {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [reach, setReach] = useState(1);
  const root = useRef<HTMLElement>(null);
  const slides = useRef<Array<HTMLElement | null>>([]);
  const bars = useRef<Array<HTMLElement | null>>([]);
  const cur = useRef(0);
  const tween = useRef<gsap.core.Tween | null>(null);
  const held = useRef(false);
  const n = cars.length;

  const show = useCallback((to: number) => {
    const next = (to + n) % n;
    const from = cur.current;
    if (next === from) return;
    const a = slides.current[from], b = slides.current[next];
    cur.current = next;
    setI(next);
    setReach((r) => Math.max(r, Math.min(n - 1, next + 1)));
    if (!a || !b) return;
    if (prefersReducedMotion()) { gsap.set(a, { opacity: 0 }); gsap.set(b, { opacity: 1 }); return; }
    gsap.killTweensOf([a, b]);
    gsap.timeline()
      .to(a, { opacity: 0, duration: 0.45, ease: "power2.out" }, 0)
      .fromTo(b, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power2.out" }, 0.15)
      .fromTo(b.querySelectorAll("[data-h]"), { y: 34, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: ease.out, stagger: 0.07 }, 0.2)
      .fromTo(b.querySelector("[data-media]"), { scale: 1.07, x: 26 }, { scale: 1, x: 0, duration: 1.3, ease: ease.out }, 0.1);
  }, [n]);

  // Intro: the first slide's text is hidden by CSS until hydration (no flash), then rises once the stage is lit
  useEffect(() => {
    const first = slides.current[0];
    if (!first) return;
    const done = () => { first.setAttribute("data-in", ""); gsap.set(first.querySelectorAll("[data-h]"), { clearProps: "opacity,transform" }); };
    if (prefersReducedMotion()) { setPlaying(false); done(); return; }
    let t: gsap.core.Tween | null = null;
    const cancel = gate.whenOpen(() => { t = gsap.fromTo(first.querySelectorAll("[data-h]"), { opacity: 0, y: 34 }, { opacity: 1, y: 0, duration: 1, ease: ease.out, stagger: 0.08, delay: 0.1, onComplete: done }); });
    return () => { cancel(); t?.kill(); done(); };
  }, []);

  // Autoplay: the active progress bar IS the timer
  useEffect(() => {
    bars.current.forEach((b, k) => b && gsap.set(b, { scaleX: k < i ? 1 : 0 }));
    const bar = bars.current[i];
    if (!bar || !playing) { if (bar) gsap.set(bar, { scaleX: 1 }); return; }
    let cancel = () => {};
    cancel = gate.whenOpen(() => {
      tween.current = gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: heroSlideMs / 1000, ease: "none", paused: held.current, onComplete: () => show(cur.current + 1) });
    });
    return () => { cancel(); tween.current?.kill(); tween.current = null; };
  }, [i, playing, show]);

  const hold = (v: boolean) => { held.current = v; tween.current?.paused(v); };

  // Swipe (touch/pen). Vertical scrolling is left alone via touch-action: pan-y on the media.
  const startX = useRef<number | null>(null);
  const onDown = (e: React.PointerEvent) => { if (e.pointerType !== "mouse") startX.current = e.clientX; };
  const onUp = (e: React.PointerEvent) => {
    if (startX.current == null) return;
    const dx = e.clientX - startX.current; startX.current = null;
    if (Math.abs(dx) > 48) show(cur.current + (dx < 0 ? 1 : -1));
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); show(cur.current + 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); show(cur.current - 1); }
  };

  return (
    <section ref={root} aria-roledescription="carousel" aria-label="Featured cars" onKeyDown={onKey}
      onPointerEnter={(e) => e.pointerType === "mouse" && hold(true)} onPointerLeave={(e) => e.pointerType === "mouse" && hold(false)}
      onFocus={() => hold(true)} onBlur={() => hold(false)}>
      <div className="wrap pb-10 pt-6 md:pb-16 md:pt-10">
        <h1 className="t-eyebrow">{brand.tagline} · {brand.address.city}</h1>

        <div className="mt-4 grid">
          {cars.map((car, k) => {
            const title = carTitle(car);
            const v = resolvePayment(car.payment);
            // Images beyond the next slide are held back so only the hero image loads eagerly.
            const mediaCar = k > reach ? { ...car, media: { ...car.media, hero: null } } : car;
            return (
              <div key={car.id} ref={(el) => { slides.current[k] = el; }} role="group" aria-roledescription="slide" aria-label={`${k + 1} of ${n}`}
                data-hero-intro={k === 0 ? "" : undefined} aria-hidden={k !== i} inert={k !== i} style={{ opacity: k === 0 ? 1 : 0, gridArea: "1 / 1" }}
                className="grid gap-7 md:grid-cols-12 md:items-center md:gap-10">
                <div className="md:order-2 md:col-span-7" data-media-wrap onPointerDown={onDown} onPointerUp={onUp} style={{ touchAction: "pan-y" }}>
                  <div data-media className="overflow-hidden rounded-[1.75rem]">
                    <CarMedia car={mediaCar} priority={k === 0} sizes="(min-width:768px) 58vw, 94vw" ratio="aspect-[4/3] md:aspect-[5/4]" zoom={false} />
                  </div>
                </div>
                <div className="md:order-1 md:col-span-5">
                  <p data-h className="t-eyebrow">{String(k + 1).padStart(2, "0")} / {String(n).padStart(2, "0")} · {car.brand}</p>
                  <h2 data-h className="t-display t-d2 mt-3">{title}</h2>
                  <div data-h className="mt-6">
                    {v.installment ? (
                      <>
                        <span className="inline-flex items-center gap-2 rounded-full bg-omegi px-3.5 py-1.5 text-[13px] font-bold text-white"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-white" />Pay 40% and drive</span>
                        <div className="mt-4">
                          {v.downPayment
                            ? <PaymentBlock payment={car.payment} size="lg" hideTag />
                            : <p className="text-[15px] text-mute">Down payment: {brand.finance.unknownPrice.toLowerCase()}</p>}
                        </div>
                      </>
                    ) : <PaymentBlock payment={car.payment} size="lg" />}
                  </div>
                  <div data-h className="mt-8 flex flex-wrap gap-3">
                    <EnquiryButton request={carEnquiry(car)} className="btn btn-red"><IconChat /> Chat about this car</EnquiryButton>
                    <TransitionLink href={`/inventory/${car.slug}`} className="btn btn-line">View car</TransitionLink>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex items-center gap-3">
          <ol className="flex flex-1 gap-2" aria-label="Choose a slide">
            {cars.map((car, k) => (
              <li key={car.id} className="flex-1">
                <button type="button" onClick={() => show(k)} aria-label={`Show ${carTitle(car)}`} aria-current={k === i} className="group block w-full py-3">
                  <span className="block h-[3px] overflow-hidden rounded-full bg-rule"><span ref={(el) => { bars.current[k] = el; }} className="block h-full origin-left scale-x-0 bg-tarmac" /></span>
                </button>
              </li>
            ))}
          </ol>
          <button type="button" onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pause slideshow" : "Play slideshow"} className="grid h-11 w-11 place-items-center rounded-full border border-rule hover:bg-paper">
            {playing ? <IconPause /> : <IconPlay />}
          </button>
          <div className="hidden gap-2 md:flex">
            <button type="button" onClick={() => show(cur.current - 1)} aria-label="Previous car" className="grid h-11 w-11 place-items-center rounded-full border border-rule hover:bg-paper"><IconChevron dir="left" /></button>
            <button type="button" onClick={() => show(cur.current + 1)} aria-label="Next car" className="grid h-11 w-11 place-items-center rounded-full border border-rule hover:bg-paper"><IconChevron /></button>
          </div>
        </div>
        <p className="sr-only" aria-live="polite">{`Showing ${carTitle(cars[i])}`}</p>
      </div>
    </section>
  );
}
