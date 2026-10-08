"use client";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import CarCard from "@/components/car/CarCard";
import { IconChat, IconClose, IconSearch, IconSliders } from "@/components/shell/Icons";
import EnquiryButton from "@/components/shell/EnquiryButton";
import { generalEnquiry } from "@/lib/enquiryRequests";
import { downBands, inventoryPageSize } from "@/config/ui";
import { applyFilters, defaultFilters, facets, filtersToParams, paramsToFilters, type Filters, type SortKey } from "@/lib/inventory";
import type { PublicCar } from "@/types/car";

const Chip = ({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button type="button" aria-pressed={on} onClick={onClick}
    className={`min-h-[44px] rounded-full border px-4 text-[14px] font-semibold transition-colors duration-300 ${on ? "border-tarmac bg-tarmac text-white" : "border-rule bg-showroom hover:border-tarmac"}`}>{children}</button>
);
const Group = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <fieldset className="min-w-0"><legend className="t-eyebrow mb-2.5">{label}</legend><div className="flex flex-wrap gap-2">{children}</div></fieldset>
);

const SORTS: { v: SortKey; l: string }[] = [
  { v: "featured", l: "Featured first" }, { v: "down-asc", l: "Down payment: low to high" }, { v: "down-desc", l: "Down payment: high to low" },
  { v: "year-desc", l: "Newest year" }, { v: "name", l: "Name, A to Z" },
];

/** Search, filters (brand, category, status, budget range), sort, and results that load in pages as you scroll. State lives in the URL so views can be shared. */
export default function InventoryClient({ cars }: { cars: PublicCar[] }) {
  const sp = useSearchParams();
  const [f, setF] = useState<Filters>(() => paramsToFilters(new URLSearchParams(sp.toString())));
  const [panel, setPanel] = useState(false);
  const [shown, setShown] = useState(inventoryPageSize);
  const sentinel = useRef<HTMLDivElement>(null);
  const fac = useMemo(() => facets(cars), [cars]);
  const q = useDeferredValue(f.q);
  const results = useMemo(() => applyFilters(cars, { ...f, q }), [cars, f, q]);
  const set = (patch: Partial<Filters>) => setF((p) => ({ ...p, ...patch }));
  const dirty = JSON.stringify(f) !== JSON.stringify(defaultFilters);

  useEffect(() => {
    const qs = filtersToParams(f).toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
    setShown(inventoryPageSize);
  }, [f]);

  useEffect(() => {
    const el = sentinel.current;
    if (!el || shown >= results.length) return;
    const io = new IntersectionObserver((e) => { if (e[0].isIntersecting) setShown((s) => s + inventoryPageSize); }, { rootMargin: "700px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [shown, results.length]);

  const bandLabel = downBands.find((b) => b.id === f.band)?.label;
  const visible = results.slice(0, shown);
  const noun = f.by === "down" ? "down payment" : "price";

  return (
    <div className="wrap pb-section">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <label className="relative block flex-1">
          <span className="sr-only">Search cars</span>
          <IconSearch className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-mute" />
          <input type="search" value={f.q} onChange={(e) => set({ q: e.target.value })} placeholder="Search by make, model or feature" autoComplete="off"
            className="h-[52px] w-full rounded-full border border-rule bg-showroom pl-12 pr-5 text-[16px] outline-none placeholder:text-mute focus:border-tarmac" />
        </label>
        <div className="flex gap-3">
          <button type="button" onClick={() => setPanel((o) => !o)} aria-expanded={panel} aria-controls="filters" className="btn btn-line md:hidden"><IconSliders /> Filters{dirty ? " •" : ""}</button>
          <label className="flex-1 md:flex-none">
            <span className="sr-only">Sort by</span>
            <select value={f.sort} onChange={(e) => set({ sort: e.target.value as SortKey })} className="h-[52px] w-full rounded-full border border-rule bg-showroom px-5 text-[15px] font-semibold outline-none focus:border-tarmac md:w-auto">
              {SORTS.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}
            </select>
          </label>
        </div>
      </div>

      <div id="filters" className={`${panel ? "grid" : "hidden"} mt-6 gap-6 md:grid md:grid-cols-2 lg:grid-cols-4`}>
        <Group label="Brand">{fac.brands.map((b) => <Chip key={b} on={f.brands.includes(b)} onClick={() => set({ brands: f.brands.includes(b) ? f.brands.filter((x) => x !== b) : [...f.brands, b] })}>{b}</Chip>)}</Group>
        {fac.categories.length > 1 && <Group label="Category">{fac.categories.map((c) => <Chip key={c} on={f.category === c} onClick={() => set({ category: f.category === c ? null : c })}>{c}</Chip>)}</Group>}
        {fac.bodyTypes.length > 1 && <Group label="Body type">{fac.bodyTypes.map((b) => <Chip key={b} on={f.bodyType === b} onClick={() => set({ bodyType: f.bodyType === b ? null : b })}>{b}</Chip>)}</Group>}
        <Group label="Status">{(["all", "available", "sold"] as const).map((s) => <Chip key={s} on={f.status === s} onClick={() => set({ status: s })}>{s === "all" ? "All" : s === "available" ? "Available" : "Sold out"}</Chip>)}</Group>
        <Group label="Budget">
          <Chip on={f.by === "down"} onClick={() => set({ by: "down" })}>Down payment</Chip>
          <Chip on={f.by === "price"} onClick={() => set({ by: "price" })}>Full price</Chip>
          <span className="basis-full" />
          <Chip on={f.band === null} onClick={() => set({ band: null })}>Any</Chip>
          {downBands.map((b) => <Chip key={b.id} on={f.band === b.id} onClick={() => set({ band: f.band === b.id ? null : b.id })}>{b.label}</Chip>)}
        </Group>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2" >
        <p role="status" aria-live="polite" className="text-[14px] font-semibold">{results.length} {results.length === 1 ? "car" : "cars"}</p>
        {f.brands.map((b) => <button key={b} type="button" onClick={() => set({ brands: f.brands.filter((x) => x !== b) })} className="inline-flex items-center gap-1.5 rounded-full bg-paper px-3 py-1.5 text-[13px] font-semibold">{b}<IconClose className="h-3.5 w-3.5" /><span className="sr-only">remove</span></button>)}
        {bandLabel && <button type="button" onClick={() => set({ band: null })} className="inline-flex items-center gap-1.5 rounded-full bg-paper px-3 py-1.5 text-[13px] font-semibold">{bandLabel}<IconClose className="h-3.5 w-3.5" /><span className="sr-only">remove</span></button>}
        {dirty && <button type="button" onClick={() => setF(defaultFilters)} className="u40 text-[13px] font-bold">Clear all</button>}
      </div>
      {bandLabel && <p className="mt-2 text-[13px] text-mute">Cars without a stated {noun} are hidden while a range is set.</p>}

      {results.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-rule bg-paper p-8 md:p-12">
          <h2 className="t-display text-[2rem]">No cars match that.</h2>
          <p className="mt-3 max-w-[44ch] text-mute">Loosen a filter, or message us the car you want and we&apos;ll look for it.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={() => setF(defaultFilters)} className="btn btn-line">Clear filters</button>
            <EnquiryButton request={generalEnquiry("I'm looking for a car I couldn't find on the site.")} className="btn btn-red"><IconChat /> Message us</EnquiryButton>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((c, k) => <CarCard key={c.id} car={c} className="card-in h-full" style={{ animationDelay: `${(k % inventoryPageSize) * 55}ms` }} />)}
          </div>
          {shown < results.length && (
            <div className="mt-10 flex justify-center">
              <button type="button" onClick={() => setShown((s) => s + inventoryPageSize)} className="btn btn-line">Show more ({results.length - shown} left)</button>
            </div>
          )}
          <div ref={sentinel} aria-hidden="true" className="h-px" />
        </>
      )}
    </div>
  );
}
