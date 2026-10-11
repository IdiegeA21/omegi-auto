"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import CarCard from "@/components/car/CarCard";
import { IconArrow, IconChat } from "@/components/shell/Icons";
import { TransitionLink } from "@/components/shell/TransitionLink";
import EnquiryButton from "@/components/shell/EnquiryButton";
import { generalEnquiry } from "@/lib/enquiryRequests";
import Reveal from "@/components/ui/Reveal";
import { downBands } from "@/config/ui";
import { inBand } from "@/lib/inventory";
import { gsap, prefersReducedMotion } from "@/lib/motion/gsap";
import { ease } from "@/lib/tokens";
import type { PublicCar } from "@/types/car";

/** "What can you put down?" Browse by the number this business actually sells on: the down payment. */
export default function DownPaymentBrowser({ cars }: { cars: PublicCar[] }) {
  const [band, setBand] = useState<string>(downBands[0].id);
  const results = useMemo(() => inBand(cars, band), [cars, band]);
  const grid = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    const el = grid.current;
    if (!el || prefersReducedMotion()) return;
    const t = gsap.fromTo(el.children, { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: ease.out, stagger: 0.07, clearProps: "transform,opacity" });
    return () => { t.kill(); gsap.set(el.children, { clearProps: "transform,opacity" }); };
  }, [band]);

  return (
    <section className="border-t border-rule bg-paper py-section">
      <div className="wrap">
        <p className="t-eyebrow">Start with your budget</p>
        <Reveal as="h2" text="What can you put down?" className="t-display t-d2 mt-3 max-w-[14ch]" />
        <p className="t-lead mt-5 text-mute">Pick a down payment range and see the cars that fit.</p>

        <div role="radiogroup" aria-label="Down payment range" className="mt-8 flex flex-wrap gap-2.5">
          {downBands.map((b) => (
            <button key={b.id} type="button" role="radio" aria-checked={band === b.id} onClick={() => setBand(b.id)}
              className={`min-h-[48px] rounded-full border px-6 text-[15px] font-bold transition-colors duration-300 ${band === b.id ? "border-tarmac bg-tarmac text-white" : "border-rule bg-showroom hover:border-tarmac"}`}>
              {b.label}
            </button>
          ))}
        </div>

        <p className="mt-5 text-[14px] text-mute" role="status">{results.length} {results.length === 1 ? "car" : "cars"} in this range</p>
        <div ref={grid} className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((c) => <CarCard key={c.id} car={c} />)}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <TransitionLink href={`/inventory?band=${band}`} className="btn btn-ink">See all in this range <IconArrow /></TransitionLink>
          <EnquiryButton request={generalEnquiry("I'd like to know about other cars.")} className="btn btn-line"><IconChat /> Ask about other cars</EnquiryButton>
        </div>
        <p className="mt-6 max-w-[60ch] text-[13px] text-mute">Cars shown here have a down payment in their listing or a stated price. For the rest, message us.</p>
      </div>
    </section>
  );
}
