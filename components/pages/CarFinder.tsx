"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import CarCard from "@/components/car/CarCard";
import { IconArrow, IconChat } from "@/components/shell/Icons";
import EnquiryButton from "@/components/shell/EnquiryButton";
import { downBands } from "@/config/ui";
import { carTitle } from "@/lib/carTitle";
import { figureLines } from "@/lib/enquiryRequests";
import { findMatches, type FinderAnswers } from "@/lib/finder";
import { facets } from "@/lib/inventory";
import { gsap, prefersReducedMotion } from "@/lib/motion/gsap";
import { ease } from "@/lib/tokens";
import type { EnquiryRequest } from "@/lib/enquiry";
import type { PublicCar } from "@/types/car";

const Opt = ({ on, onClick, children }: { on?: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button type="button" aria-pressed={on} onClick={onClick}
    className={`min-h-[64px] rounded-2xl border px-5 text-left text-[1.05rem] font-bold transition-colors duration-300 ${on ? "border-tarmac bg-tarmac text-white" : "border-rule bg-showroom hover:border-tarmac"}`}>{children}</button>
);

/** Three questions: what you can put down, what kind of car, which brand. Ends in the enquiry sheet. */
export default function CarFinder({ cars }: { cars: PublicCar[] }) {
  const fac = useMemo(() => facets(cars.filter((c) => c.status === "available")), [cars]);
  // If every car is the same body type, asking about body type is pointless: ask about the kind of drive instead.
  const useBody = fac.bodyTypes.length > 1;
  const typeOptions = useBody ? fac.bodyTypes : fac.categories;
  const steps = ["budget", ...(typeOptions.length > 1 ? ["type"] : []), "brand", "results"] as const;

  const [i, setI] = useState(0);
  const [a, setA] = useState<FinderAnswers>({ band: null, body: null, category: null, brands: [] });
  const [budgetSet, setBudgetSet] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const step = steps[i];
  const next = () => setI((n) => Math.min(n + 1, steps.length - 1));

  useEffect(() => {
    const el = stage.current;
    if (!el || prefersReducedMotion()) return;
    const t = gsap.fromTo(el, { x: 36, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: ease.out, clearProps: "transform,opacity" });
    return () => { t.kill(); };
  }, [i]);

  const result = useMemo(() => (step === "results" ? findMatches(cars, a) : null), [step, cars, a]);
  const bandLabel = downBands.find((b) => b.id === a.band)?.label ?? "Not sure yet";
  const typeLabel = (useBody ? a.body : a.category) ?? "No preference";
  const picks = result ? [...result.exact, ...result.askPrice, ...result.closest] : [];
  const request: EnquiryRequest = {
    kind: "finder", title: "Ask about these cars", intro: "I used your Car Finder.",
    details: [
      { label: "Down payment I can make", value: bandLabel }, { label: useBody ? "Body type" : "Kind of car", value: typeLabel },
      { label: "Brand", value: a.brands.length ? a.brands.join(", ") : "No preference" },
      ...picks.slice(0, 4).map((c, k) => ({ label: `Pick ${k + 1}`, value: `${carTitle(c)}${figureLines(c)[0] ? ` (${figureLines(c)[0].label} ${figureLines(c)[0].value})` : ""}` })),
    ],
    chips: ["Are these available?", "What are the financing terms?"],
  };
  const reset = () => { setA({ band: null, body: null, category: null, brands: [] }); setBudgetSet(false); setI(0); };
  const setType = (v: string | null) => setA((p) => (useBody ? { ...p, body: v, category: null } : { ...p, category: v, body: null }));

  return (
    <div className="wrap pb-section">
      <ol className="flex gap-2" aria-label="Progress">
        {steps.map((s, k) => <li key={s} className="flex-1"><span className={`block h-[3px] rounded-full transition-colors duration-500 ${k <= i ? "bg-tarmac" : "bg-rule"}`} /><span className="sr-only">{`Step ${k + 1} of ${steps.length}${k === i ? ", current" : ""}`}</span></li>)}
      </ol>

      <div ref={stage} className="mt-10 min-h-[22rem]">
        {step === "budget" && (
          <section aria-labelledby="q-budget">
            <p className="t-eyebrow">Question 1</p>
            <h2 id="q-budget" className="t-display t-d2 mt-3">What can you put down?</h2>
            <div className="mt-8 grid gap-3 md:grid-cols-2">
              {downBands.map((b) => <Opt key={b.id} on={budgetSet && a.band === b.id} onClick={() => { setA({ ...a, band: b.id }); setBudgetSet(true); next(); }}>{b.label}</Opt>)}
              <Opt on={budgetSet && a.band === null} onClick={() => { setA({ ...a, band: null }); setBudgetSet(true); next(); }}>Not sure yet</Opt>
            </div>
          </section>
        )}

        {step === "type" && (
          <section aria-labelledby="q-type">
            <p className="t-eyebrow">Question 2</p>
            <h2 id="q-type" className="t-display t-d2 mt-3">{useBody ? "What body type?" : "What kind of drive?"}</h2>
            <div className="mt-8 grid gap-3 md:grid-cols-2">
              {typeOptions.map((t) => <Opt key={t} on={(useBody ? a.body : a.category) === t} onClick={() => { setType(t); next(); }}>{t}</Opt>)}
              <Opt on={!(useBody ? a.body : a.category)} onClick={() => { setType(null); next(); }}>No preference</Opt>
            </div>
          </section>
        )}

        {step === "brand" && (
          <section aria-labelledby="q-brand">
            <p className="t-eyebrow">Question {steps.indexOf("brand") + 1}</p>
            <h2 id="q-brand" className="t-display t-d2 mt-3">Any brand in mind?</h2>
            <p className="mt-3 text-mute">Pick as many as you like, or none.</p>
            <div className="mt-8 flex flex-wrap gap-2.5">
              {fac.brands.map((b) => (
                <button key={b} type="button" aria-pressed={a.brands.includes(b)} onClick={() => setA((p) => ({ ...p, brands: p.brands.includes(b) ? p.brands.filter((x) => x !== b) : [...p.brands, b] }))}
                  className={`min-h-[48px] rounded-full border px-5 text-[15px] font-bold transition-colors duration-300 ${a.brands.includes(b) ? "border-tarmac bg-tarmac text-white" : "border-rule hover:border-tarmac"}`}>{b}</button>
              ))}
            </div>
            <button type="button" onClick={next} className="btn btn-ink mt-10">{a.brands.length ? "Show my cars" : "No preference, show cars"} <IconArrow /></button>
          </section>
        )}

        {step === "results" && result && (
          <section aria-labelledby="q-results">
            <p className="t-eyebrow">Your matches</p>
            <h2 id="q-results" className="t-display t-d2 mt-3">{picks.length === 0 ? "Nothing yet." : result.relaxed ? "Closest we have." : `${result.exact.length + result.askPrice.length} ${result.exact.length + result.askPrice.length === 1 ? "car" : "cars"} for you.`}</h2>
            <p className="mt-3 text-mute">{bandLabel} · {typeLabel} · {a.brands.length ? a.brands.join(", ") : "Any brand"}</p>
            {result.relaxed && <p className="mt-4 max-w-[60ch] rounded-2xl bg-paper px-5 py-4 text-[15px]">Nothing matched everything, so we loosened the {result.relaxed === "brand" ? "brand" : result.relaxed === "type" ? "type and brand" : "budget, type and brand"} to show the closest cars. Message us and we&apos;ll look for an exact match.</p>}

            {result.exact.length > 0 && <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{result.exact.map((c) => <CarCard key={c.id} car={c} className="h-full" />)}</div>}
            {result.askPrice.length > 0 && (
              <>
                <h3 className="mt-12 text-[1.1rem] font-bold">Also a match, no figure listed yet</h3>
                <p className="mt-1 text-[14px] text-mute">Ask us for the down payment on these.</p>
                <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{result.askPrice.map((c) => <CarCard key={c.id} car={c} className="h-full" />)}</div>
              </>
            )}
            {result.closest.length > 0 && <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{result.closest.map((c) => <CarCard key={c.id} car={c} className="h-full" />)}</div>}

            <div className="mt-10 flex flex-wrap gap-3">
              <EnquiryButton request={request} className="btn btn-red"><IconChat /> Ask about these cars</EnquiryButton>
              <button type="button" onClick={reset} className="btn btn-line">Start over</button>
            </div>
          </section>
        )}
      </div>

      {i > 0 && step !== "results" && <button type="button" onClick={() => setI((n) => n - 1)} className="u40 mt-6 text-[14px] font-bold">Back</button>}
    </div>
  );
}
