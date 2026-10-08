"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Field, FormShell, SelectField } from "@/components/forms/Fields";
import { IconChat } from "@/components/shell/Icons";
import EnquiryButton from "@/components/shell/EnquiryButton";
import { useEnquiry } from "@/components/shell/EnquirySheet";
import Money from "@/components/ui/Money";
import { brand } from "@/config/brand";
import { carTitle } from "@/lib/carTitle";
import { estimate, monthlyOptions, parseNaira } from "@/lib/estimate";
import { collect } from "@/lib/forms";
import { gsap, prefersReducedMotion } from "@/lib/motion/gsap";
import { nairaText } from "@/lib/money";
import { resolvePayment } from "@/lib/payment";
import { ease } from "@/lib/tokens";
import type { EnquiryRequest } from "@/lib/enquiry";
import type { PublicCar } from "@/types/car";

const EMPLOYMENT = ["Employed", "Self-employed", "Business owner", "Other"];
const TIMES = ["Morning", "Afternoon", "Evening", "Any time"];
type Result = { price: number | null; down: number | null; balance: number | null; source: string } | null;

/**
 * Estimator + pre-qualification. The 40% and the balance come straight from their public offer.
 * A monthly figure appears only if an interest rate AND tenor are set in config; otherwise the page says
 * "Final terms are confirmed on WhatsApp." Nothing here approves, declines or promises anything.
 */
export default function FinanceTools({ cars }: { cars: PublicCar[] }) {
  const available = useMemo(() => cars.filter((c) => c.status === "available"), [cars]);
  const [mode, setMode] = useState<"car" | "price">("car");
  const [carId, setCarId] = useState("");
  const [priceText, setPriceText] = useState("");
  const out = useRef<HTMLDivElement>(null);
  const { open } = useEnquiry();
  const pct = brand.finance.downPaymentPercent;

  const result: Result = useMemo(() => {
    if (mode === "price") {
      const p = parseNaira(priceText);
      if (!p) return null;
      const e = estimate(p);
      return { price: e.price, down: e.down, balance: e.balance, source: `Price you entered` };
    }
    const car = available.find((c) => c.id === carId);
    if (!car) return null;
    const v = resolvePayment(car.payment);
    if (v.price != null) { const down = v.downPayment?.amount ?? estimate(v.price).down; return { price: v.price, down, balance: v.price - down, source: carTitle(car) }; }
    if (v.downPayment) return { price: null, down: v.downPayment.amount, balance: null, source: carTitle(car) };
    return { price: null, down: null, balance: null, source: carTitle(car) };
  }, [mode, priceText, carId, available]);

  const typed = priceText.trim().length > 0;
  const monthly = result?.balance != null ? monthlyOptions(result.balance) : null;

  useEffect(() => {
    const el = out.current;
    if (!el || !result || prefersReducedMotion()) return;
    const t = gsap.fromTo(el.querySelectorAll("[data-n]"), { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: ease.out, stagger: 0.06, clearProps: "transform,opacity" });
    return () => { t.kill(); };
  }, [result?.price, result?.down, carId]);

  const grouped = useMemo(() => {
    const g = { price: [] as PublicCar[], down: [] as PublicCar[], ask: [] as PublicCar[] };
    available.forEach((c) => { const v = resolvePayment(c.payment); (v.price != null ? g.price : v.downPayment ? g.down : g.ask).push(c); });
    return g;
  }, [available]);
  const label = (c: PublicCar) => { const v = resolvePayment(c.payment); return `${carTitle(c)}${v.price != null ? ` · ${nairaText(v.price)}` : v.downPayment ? ` · down ${nairaText(v.downPayment.amount)}` : ""}`; };

  const request: EnquiryRequest | null = result && (result.down != null)
    ? { kind: "general", title: "Confirm my terms", intro: "I used your finance estimator and I'd like to confirm the terms.",
        details: [{ label: result.source.startsWith("Price") ? "Price" : "Car", value: result.price != null && result.source.startsWith("Price") ? nairaText(result.price) : result.source },
          ...(result.price != null && !result.source.startsWith("Price") ? [{ label: "Price", value: nairaText(result.price) }] : []),
          { label: `Down payment${result.price != null && result.down === estimate(result.price).down ? ` (${pct}%)` : ""}`, value: nairaText(result.down) },
          ...(result.balance != null ? [{ label: "Balance", value: nairaText(result.balance) }] : [])],
        chips: ["What are the financing terms?"], preselect: ["What are the financing terms?"] }
    : null;

  const submitPrequal = (f: HTMLFormElement) => open({
    kind: "prequal", title: "Pre-qualification details", intro: "I'd like to pre-qualify for your car financing.",
    details: [
      ...collect(f, [["name", "Name"], ["employment", "Employment"], ["down", "Preferred down payment"], ["time", "Best time to contact"]]),
      ...(result?.source ? [{ label: result.source.startsWith("Price") ? "Price" : "Car", value: result.source.startsWith("Price") && result.price != null ? nairaText(result.price) : result.source }] : []),
    ],
    reassurance: "These details only help our team prepare. No decision is made on this site.",
  });

  const radio = (on: boolean) => `min-h-[48px] flex-1 rounded-full border px-5 text-[15px] font-bold transition-colors duration-300 ${on ? "border-tarmac bg-tarmac text-white" : "border-rule hover:border-tarmac"}`;
  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
      <div>
        <h2 className="t-display t-d3">Your {pct}%</h2>
        <div role="radiogroup" aria-label="How do you want to start?" className="mt-6 flex gap-2.5">
          <button type="button" role="radio" aria-checked={mode === "car"} onClick={() => setMode("car")} className={radio(mode === "car")}>Pick a car</button>
          <button type="button" role="radio" aria-checked={mode === "price"} onClick={() => setMode("price")} className={radio(mode === "price")}>Enter a price</button>
        </div>
        <div className="mt-5">
          {mode === "car" ? (
            <SelectField label="Car" name="car" value={carId} onChange={setCarId} placeholder="Choose a car" required>
              {grouped.price.length > 0 && <optgroup label="Price listed">{grouped.price.map((c) => <option key={c.id} value={c.id}>{label(c)}</option>)}</optgroup>}
              {grouped.down.length > 0 && <optgroup label="Down payment listed">{grouped.down.map((c) => <option key={c.id} value={c.id}>{label(c)}</option>)}</optgroup>}
              {grouped.ask.length > 0 && <optgroup label="Ask for price">{grouped.ask.map((c) => <option key={c.id} value={c.id}>{label(c)}</option>)}</optgroup>}
            </SelectField>
          ) : (
            <Field label="Car price" name="price" value={priceText} onChange={setPriceText} inputMode="text" required placeholder="e.g. 80,000,000 or 80m" hint={typed && !parseNaira(priceText) ? "Enter a number, like 80,000,000 or 80m." : undefined} />
          )}
        </div>

        <div ref={out} className="mt-8 rounded-3xl bg-tarmac p-6 text-white md:p-8" aria-live="polite">
          {!result ? (
            <p className="text-[15px] text-mute-dark">{mode === "car" ? "Choose a car to see your down payment." : "Enter a price to see your down payment and balance."}</p>
          ) : (
            <>
              <p data-n className="text-[13px] font-semibold text-mute-dark">{result.source}</p>
              {result.down != null ? (
                <>
                  <p data-n className="mt-4 text-[13px] font-semibold text-mute-dark">Down payment{result.price != null && result.down === estimate(result.price).down ? ` (${pct}%)` : ""}</p>
                  <p data-n className="t-fig mt-1 text-[3rem] text-campaign md:text-[4rem]"><Money amount={result.down} compact={false} /></p>
                  {result.balance != null ? (
                    <div data-n className="mt-5 grid grid-cols-2 gap-4 border-t border-kerb pt-5">
                      <div><p className="text-[13px] text-mute-dark">Balance</p><p className="t-fig mt-1 text-[1.6rem]"><Money amount={result.balance} compact={false} /></p></div>
                      <div><p className="text-[13px] text-mute-dark">Price</p><p className="t-fig mt-1 text-[1.6rem]"><Money amount={result.price!} compact={false} /></p></div>
                    </div>
                  ) : <p data-n className="mt-4 text-[14px] text-mute-dark">This car lists a down payment but not a full price. Enter the price to see the balance, or ask us.</p>}
                  {result.price != null && (
                    <div data-n className="mt-5" aria-hidden="true"><div className="h-3 overflow-hidden rounded-full bg-pit"><div className="h-full origin-left bg-campaign" style={{ width: `${(result.down / result.price) * 100}%` }} /></div>
                      <div className="mt-1.5 flex justify-between text-[11px] font-semibold text-mute-dark"><span>{Math.round((result.down / result.price) * 100)}% now</span><span>Balance</span></div></div>
                  )}
                </>
              ) : <p data-n className="mt-4 text-[15px]">{brand.finance.unknownPrice}. Enter a price above, or message us for this car&apos;s figures.</p>}

              {monthly ? (
                <ul data-n className="mt-5 grid gap-2 border-t border-kerb pt-5 text-[14px]">{monthly.map((m) => <li key={m.months} className="flex justify-between"><span>{m.months} months</span><span className="font-bold"><Money amount={m.amount} compact={false} /> / month</span></li>)}</ul>
              ) : <p data-n className="mt-5 border-t border-kerb pt-4 text-[14px] text-mute-dark">{brand.finance.termsNote}</p>}

              {request && <EnquiryButton request={request} className="btn btn-red mt-6 w-full"><IconChat /> Confirm on WhatsApp</EnquiryButton>}
            </>
          )}
        </div>
      </div>

      <div>
        <h2 className="t-display t-d3">Pre-qualify</h2>
        <p className="mt-3 max-w-[44ch] text-[15px] text-mute">Tell us a little about yourself so our team can prepare before you chat. This only collects details. No decision is made here.</p>
        <div className="mt-6">
          <FormShell submit="Review and send" onSubmit={submitPrequal}>
            <Field label="Your name" name="name" required autoComplete="name" />
            <SelectField label="Employment" name="employment" required options={EMPLOYMENT} />
            <Field label="Preferred down payment" name="down" placeholder={result?.down != null ? nairaText(result.down) : `e.g. ${pct}% of the price`} />
            <SelectField label="Best time to contact you" name="time" options={TIMES} />
          </FormShell>
        </div>
      </div>
    </div>
  );
}
