"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Field, SelectField } from "@/components/forms/Fields";
import { IconChat } from "@/components/shell/Icons";
import EnquiryButton from "@/components/shell/EnquiryButton";
import { brand } from "@/config/brand";
import { gsap, prefersReducedMotion } from "@/lib/motion/gsap";
import { deliveryCopy, destName as dest } from "@/lib/delivery";
import { bezierAt, routeCurve } from "@/lib/route";
import type { Place } from "@/types/geo";

const ZONES = ["North West", "North East", "North Central", "South West", "South East", "South South"] as const;
const WR = 17; // wheel radius in map units
const TRAIL = 40;
const SIDE: Record<Place["side"], string> = { r: "translate(18px,-50%)", l: "translate(calc(-100% - 18px),-50%)", t: "translate(-50%,calc(-100% - 18px))", b: "translate(-50%,18px)" };

/**
 * Where should we deliver? An illustrated map of Nigeria: pick a city (or any state capital) and a route draws from Lagos with
 * the wheel rolling along it. No distance, time or cost is shown, because none has been supplied; the calls to action change
 * with the destination ("Ask about delivery to Abuja (FCT)") and the details go to WhatsApp through the enquiry sheet.
 */
export default function DeliveryMap({ outline, places, w, h, originId, cars, initialId = null }: { outline: string; places: Place[]; w: number; h: number; originId: string; cars: string[]; initialId?: string | null }) {
  const origin = places.find((p) => p.id === originId)!;
  const [selId, setSelId] = useState<string | null>(initialId);
  const [zone, setZone] = useState<string>("All");
  const [custom, setCustom] = useState("");
  const [car, setCar] = useState("");
  const svg = useRef<SVGSVGElement>(null);
  const sel = places.find((p) => p.id === selId) ?? null;
  const route = useMemo(() => (sel && sel.id !== origin.id ? routeCurve(origin, sel) : null), [sel, origin]);
  const trail = useMemo(() => (sel && route ? Array.from({ length: TRAIL }, (_, i) => bezierAt(origin, route.c, sel, (i + 1) / (TRAIL + 1))) : []), [sel, route, origin]);

  const pick = (id: string | null) => { setSelId(id); if (id) setCustom(""); };

  // The wheel rolls from Lagos to the destination; the trail of dots lights up behind it. Opacity and SVG transforms only.
  useEffect(() => {
    const el = svg.current;
    if (!el) return;
    const wheel = el.querySelector<SVGGElement>("[data-wheel]")!, spin = el.querySelector<SVGGElement>("[data-spin]")!;
    const dots = Array.from(el.querySelectorAll<SVGCircleElement>("[data-trail]"));
    const place = (x: number, y: number, deg: number) => { wheel.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)})`); spin.setAttribute("transform", `rotate(${deg.toFixed(1)})`); };
    if (!sel || !route) { place(origin.x, origin.y, 0); return; }
    const dir = Math.sign(sel.x - origin.x) || 1;
    const turn = (travelled: number) => dir * (travelled / WR) * (180 / Math.PI);
    if (prefersReducedMotion()) { dots.forEach((d) => (d.style.opacity = "1")); place(sel.x, sel.y, turn(route.len)); return; }
    dots.forEach((d) => (d.style.opacity = "0"));
    place(origin.x, origin.y, 0);
    const o = { p: 0 }; let lit = 0;
    const tw = gsap.to(o, {
      p: 1, duration: Math.min(2.6, 1 + route.len / 420), ease: "power2.inOut", delay: 0.15,
      onUpdate: () => { const pt = bezierAt(origin, route.c, sel, o.p); place(pt.x, pt.y, turn(o.p * route.len)); const n = Math.floor(o.p * dots.length); while (lit < n) { dots[lit].style.opacity = "1"; lit++; } },
      onComplete: () => { dots.forEach((d) => (d.style.opacity = "1")); place(sel.x, sel.y, turn(route.len)); },
    });
    return () => { tw.kill(); };
  }, [sel, route, origin]);

  const typed = custom.trim();
  const chips = zone === "All" ? places.filter((p) => p.major && p.id !== origin.id) : places.filter((p) => p.zone === zone && p.id !== origin.id);
  const inZone = (p: Place) => zone === "All" || p.zone === zone;
  const { cta, request, target, here } = deliveryCopy({ originCity: origin.city, typed, place: sel, originId, car });

  const chip = (on: boolean) => `min-h-[44px] rounded-full border px-4 text-[14px] font-semibold transition-colors duration-300 ${on ? "border-tarmac bg-tarmac text-white" : "border-rule bg-showroom hover:border-tarmac"}`;

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
      <div className="order-2 lg:order-1 lg:col-span-5">
        <p className="t-eyebrow">Where to?</p>
        <h2 className="t-display t-d3 mt-3">Pick your destination</h2>

        <div role="group" aria-label="Region" className="mt-6 flex flex-wrap gap-2">
          {["All", ...ZONES].map((z) => <button key={z} type="button" aria-pressed={zone === z} onClick={() => setZone(z)} className={chip(zone === z)}>{z === "All" ? "All regions" : z}</button>)}
        </div>
        <div role="group" aria-label="Cities" className="mt-4 flex flex-wrap gap-2">
          {chips.map((p) => <button key={p.id} type="button" aria-pressed={selId === p.id && !typed} onClick={() => pick(p.id)} className={chip(selId === p.id && !typed)}>{p.city}</button>)}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <SelectField label="Or choose any state" name="state" value={selId && !typed ? selId : ""} onChange={(v) => pick(v || null)} placeholder="Choose a state">
            {ZONES.map((z) => <optgroup key={z} label={z}>{places.filter((p) => p.zone === z).map((p) => <option key={p.id} value={p.id}>{p.state === "FCT" ? "FCT (Abuja)" : `${p.state} (${p.city})`}</option>)}</optgroup>)}
          </SelectField>
          <Field label="Not listed? Type your city" name="city" value={custom} onChange={(v) => { setCustom(v); if (v.trim()) setSelId(null); }} placeholder="e.g. Ikot Ekpene" autoComplete="address-level2" />
        </div>
        <div className="mt-4"><SelectField label="Car (if you have one in mind)" name="car" value={car} onChange={setCar} options={cars} /></div>

        <div className="mt-6 rounded-3xl bg-paper p-6" aria-live="polite">
          {target ? (
            <>
              <p className="t-eyebrow">{here ? "Our base" : "Your route"}</p>
              <p className="t-display mt-2 text-[2rem] leading-[1] md:text-[2.4rem]">{here ? origin.city : `${origin.city} → ${typed || sel!.city}`}</p>
              <p className="mt-2 text-[14px] text-mute">{typed ? "We deliver nationwide." : `${sel!.state === "FCT" ? "FCT" : `${sel!.state} State`} · ${sel!.zone}`}</p>
              <p className="mt-4 text-[14px]">{here ? "We are based in Lagos. Message us to arrange handover or delivery within the city." : "We deliver nationwide. Timing and cost for this route are confirmed with you on WhatsApp."}</p>
            </>
          ) : <p className="text-[15px] text-mute">Choose a city, a state, or type yours. We&apos;ll draw the route from {origin.city}.</p>}
          <EnquiryButton request={request} className="btn btn-red mt-5 w-full justify-center whitespace-normal text-center"><IconChat className="h-5 w-5 shrink-0" /> {cta}</EnquiryButton>
        </div>
      </div>

      <div className="order-1 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:order-2 lg:col-span-7 lg:self-start">
        <div className="on-dark rounded-3xl bg-tarmac p-3 text-white md:p-6">
          <div className="relative w-full" style={{ aspectRatio: `${w} / ${h}` }}>
            <svg ref={svg} viewBox={`0 0 ${w} ${h}`} className="absolute inset-0 h-full w-full" role="img" aria-label={`Map of Nigeria${target ? `, showing the route from ${origin.city} to ${target}` : ""}`}>
              <defs><pattern id="dm" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="4.5" cy="4.5" r="1.5" fill="rgb(255 255 255 / .2)" /></pattern></defs>
              <path d={outline} fill="url(#dm)" />
              <path d={outline} fill="none" stroke="rgb(255 255 255 / .42)" strokeWidth="1.6" strokeLinejoin="round" />
              {places.map((p) => {
                const on = p.id === selId && !typed, dim = !inZone(p);
                return (
                  <g key={p.id} opacity={dim ? 0.28 : 1}>
                    {on && p.id !== origin.id && <circle className="map-ping" cx={p.x} cy={p.y} r="10" fill="rgb(var(--c-campaign))" opacity=".5" />}
                    {on && <circle cx={p.x} cy={p.y} r="10" fill="none" stroke="rgb(var(--c-campaign))" strokeWidth="2" />}
                    <circle cx={p.x} cy={p.y} r={p.id === origin.id ? 7 : p.major ? 5 : 3.2} fill={p.id === origin.id ? "rgb(var(--c-campaign))" : on ? "rgb(var(--c-campaign))" : "#fff"} fillOpacity={p.major || p.id === origin.id || on ? 1 : 0.7} />
                  </g>
                );
              })}
              {trail.map((t, i) => <circle key={`${selId}-${i}`} data-trail cx={t.x} cy={t.y} r="2.6" fill="rgb(var(--c-campaign))" style={{ opacity: 0 }} />)}
              <g data-wheel transform={`translate(${origin.x} ${origin.y})`}><g data-spin fill="#fff"><circle r={WR + 3} fill="rgb(var(--c-tarmac))" /><use href="#wheel-mark" x={-WR} y={-WR} width={WR * 2} height={WR * 2} /></g></g>
            </svg>

            {places.map((p) => {
              const show = p.id === originId || (p.id === selId && !typed) ? "block" : p.major ? "hidden md:block" : "hidden";
              return (
                <span key={`l-${p.id}`} className={`pointer-events-none absolute whitespace-nowrap text-[11px] font-bold md:text-[12.5px] ${show} ${p.id === selId && !typed ? "text-campaign" : "text-white"}`} style={{ left: `${p.px}%`, top: `${p.py}%`, transform: SIDE[p.side], opacity: inZone(p) ? 1 : 0.3 }}>{p.city}</span>
              );
            })}
            {places.map((p) => {
              const focusable = p.major || p.id === originId;
              return (
                <button key={`b-${p.id}`} type="button" onClick={() => pick(p.id)} tabIndex={focusable ? 0 : -1} aria-hidden={focusable ? undefined : true} aria-pressed={focusable ? p.id === selId && !typed : undefined}
                  aria-label={focusable ? `Select ${dest(p)}` : undefined} className="absolute h-11 w-11 -translate-x-1/2 -translate-y-1/2 rounded-full focus-visible:outline-white" style={{ left: `${p.px}%`, top: `${p.py}%` }} />
              );
            })}
          </div>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 px-2 pb-1 text-[12px] text-mute-dark md:mt-5">
            <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-campaign" /> {origin.city}, our base</li>
            <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-white" /> Cities and state capitals</li>
            <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full border-2 border-campaign" /> Your destination</li>
          </ul>
        </div>
        <p className="mt-3 text-[12.5px] text-mute">Illustrative map. Positions are approximate. It shows no distance, time or cost, because those are confirmed with you on WhatsApp.</p>
      </div>
    </div>
  );
}
