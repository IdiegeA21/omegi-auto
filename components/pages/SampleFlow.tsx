"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { WheelMark } from "@/components/brand/Logo";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/motion/gsap";
import { ease } from "@/lib/tokens";

const STAGES = ["Request", "Search", "Inspection", "Shipping", "Arrival", "Handover"];

/**
 * ILLUSTRATION ONLY. A generic pre-order tracker so visitors can picture the idea. It is labelled "Sample flow" on
 * screen and makes no claim about Omegi Autos' real process, steps or timing.
 */
export default function SampleFlow() {
  const root = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState<number>(STAGES.length - 1);
  const tl = useRef<gsap.core.Timeline | null>(null);

  const play = useCallback(() => {
    const el = root.current;
    if (!el) return;
    const rail = el.querySelector<HTMLElement>(".sflow__rail")!, fill = el.querySelector(".sflow__fill")!, wheel = el.querySelector<HTMLElement>(".sflow__wheel")!;
    const R = wheel.offsetWidth / 2, W = () => rail.offsetWidth;
    tl.current?.kill();
    setOn(0);
    gsap.set(fill, { scaleX: 0 }); gsap.set(wheel, { x: 0, rotation: 0 });
    const t = gsap.timeline();
    STAGES.forEach((_, k) => {
      if (k === 0) return;
      t.to(wheel, { x: () => (W() * k) / (STAGES.length - 1), rotation: () => ((W() * k) / (STAGES.length - 1) / R) * (180 / Math.PI), duration: 0.8, ease: "power2.inOut" }, ">0.35")
        .to(fill, { scaleX: k / (STAGES.length - 1), duration: 0.8, ease: "power2.inOut" }, "<")
        .add(() => setOn(k), ">");
    });
    tl.current = t;
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const rail = el.querySelector<HTMLElement>(".sflow__rail")!, fill = el.querySelector(".sflow__fill")!, wheel = el.querySelector<HTMLElement>(".sflow__wheel")!;
    const rest = () => { gsap.set(fill, { scaleX: 1 }); gsap.set(wheel, { x: rail.offsetWidth, rotation: (rail.offsetWidth / (wheel.offsetWidth / 2)) * (180 / Math.PI) }); };
    rest();
    const onResize = () => { if (!tl.current || !tl.current.isActive()) rest(); };
    window.addEventListener("resize", onResize);
    if (prefersReducedMotion()) return () => window.removeEventListener("resize", onResize);
    const st = ScrollTrigger.create({ trigger: el, start: "top 80%", once: true, onEnter: play });
    return () => { window.removeEventListener("resize", onResize); st.kill(); tl.current?.kill(); };
  }, [play]);

  return (
    <div ref={root} className="rounded-3xl border border-rule p-6 md:p-10" role="group" aria-label="Sample flow, illustration only">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="inline-flex items-center gap-2 rounded-full bg-tarmac px-3.5 py-1.5 text-[12px] font-bold uppercase tracking-wider text-white">Sample flow</p>
        <button type="button" onClick={play} className="btn btn-line min-h-[44px] px-5 text-[14px]">Replay</button>
      </div>
      <div className="sflow mt-10">
        <div className="sflow__rail"><div className="sflow__line" /><div className="sflow__fill" /><div className="sflow__wheel" aria-hidden="true"><WheelMark className="h-full w-full" /></div></div>
        <ol className="sflow__nodes">
          {STAGES.map((s, k) => <li key={s} data-on={k <= on ? "true" : "false"}><span className="sflow__dot" /><span className="sflow__label">{s}</span></li>)}
        </ol>
      </div>
      <p className="mt-8 max-w-[62ch] text-[14px] text-mute">This is an example of how a tracker could look. It is not a description of how Omegi Autos handles pre-orders. Your actual steps are confirmed with you on WhatsApp.</p>
    </div>
  );
}
