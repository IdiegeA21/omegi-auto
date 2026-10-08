import { downBands } from "@/config/ui";
import { carTitle } from "@/lib/carTitle";
import { resolvePayment } from "@/lib/payment";
import type { PublicCar as Car } from "@/types/car";

export type SortKey = "featured" | "down-asc" | "down-desc" | "year-desc" | "name";
export type BudgetBy = "down" | "price";
export type Filters = {
  q: string;
  brands: string[];
  category: string | null;
  bodyType: string | null;
  status: "all" | "available" | "sold";
  by: BudgetBy;
  band: string | null; // a downBands id
  sort: SortKey;
};
export const defaultFilters: Filters = { q: "", brands: [], category: null, bodyType: null, status: "all", by: "down", band: null, sort: "featured" };

/** The figure a customer compares: the down payment (stated or by the 40% rule) or the full price. */
export function figureOf(car: Car, by: BudgetBy): number | null {
  const v = resolvePayment(car.payment);
  return by === "down" ? (v.downPayment?.amount ?? null) : v.price;
}

const haystack = (c: Car) =>
  [carTitle(c), c.brand, c.model, c.bodyType, ...c.categories, ...c.features, c.condition, c.interior, c.exterior].filter(Boolean).join(" ").toLowerCase();

export function applyFilters(cars: Car[], f: Filters): Car[] {
  const tokens = f.q.toLowerCase().split(/\s+/).filter(Boolean);
  const band = downBands.find((b) => b.id === f.band);
  const out = cars.filter((c) => {
    if (f.status !== "all" && c.status !== f.status) return false;
    if (f.brands.length && !f.brands.includes(c.brand)) return false;
    if (f.category && !c.categories.includes(f.category)) return false;
    if (f.bodyType && c.bodyType !== f.bodyType) return false;
    if (tokens.length) { const h = haystack(c); if (!tokens.every((t) => h.includes(t))) return false; }
    if (band) { const n = figureOf(c, f.by); if (n == null || n < band.min || n > band.max) return false; }
    return true;
  });
  return sortCars(out, f);
}

/** Sold cars always sink to the end. Unknown figures sink within their group. */
export function sortCars(cars: Car[], f: Pick<Filters, "sort" | "by">): Car[] {
  const num = (c: Car) => figureOf(c, "down") ?? figureOf(c, "price");
  const cmp: Record<SortKey, (a: Car, b: Car) => number> = {
    featured: (a, b) => Number(b.featured) - Number(a.featured),
    "down-asc": (a, b) => (num(a) ?? Infinity) - (num(b) ?? Infinity),
    "down-desc": (a, b) => (num(b) ?? -Infinity) - (num(a) ?? -Infinity),
    "year-desc": (a, b) => (b.year ?? 0) - (a.year ?? 0),
    name: (a, b) => carTitle({ ...a, year: null }).localeCompare(carTitle({ ...b, year: null })),
  };
  const rank = (c: Car) => (c.status === "sold" ? 1 : 0);
  return [...cars].sort((a, b) => rank(a) - rank(b) || cmp[f.sort](a, b));
}

/** Facet values present in the data. A facet with fewer than two values is not worth showing. */
export function facets(cars: Car[]) {
  const uniq = (xs: string[]) => [...new Set(xs)].sort();
  return { brands: uniq(cars.map((c) => c.brand)), categories: uniq(cars.flatMap((c) => c.categories)), bodyTypes: uniq(cars.map((c) => c.bodyType)) };
}

/** Cars whose down payment falls in a band, for the home page browser. Only cars with a known figure qualify. */
export function inBand(cars: Car[], bandId: string): Car[] {
  const band = downBands.find((b) => b.id === bandId);
  if (!band) return [];
  return sortCars(cars.filter((c) => { if (c.status !== "available") return false; const n = figureOf(c, "down"); return n != null && n >= band.min && n <= band.max; }), { sort: "down-asc", by: "down" });
}

export const filtersToParams = (f: Filters): URLSearchParams => {
  const p = new URLSearchParams();
  if (f.q) p.set("q", f.q);
  if (f.brands.length) p.set("brand", f.brands.join(","));
  if (f.category) p.set("cat", f.category);
  if (f.bodyType) p.set("body", f.bodyType);
  if (f.status !== "all") p.set("status", f.status);
  if (f.band) { p.set("band", f.band); if (f.by !== "down") p.set("by", f.by); }
  if (f.sort !== "featured") p.set("sort", f.sort);
  return p;
};
export const paramsToFilters = (p: URLSearchParams): Filters => ({
  q: p.get("q") ?? "",
  brands: (p.get("brand") ?? "").split(",").filter(Boolean),
  category: p.get("cat"),
  bodyType: p.get("body"),
  status: (["available", "sold"].includes(p.get("status") ?? "") ? p.get("status") : "all") as Filters["status"],
  by: p.get("by") === "price" ? "price" : "down",
  band: downBands.some((b) => b.id === p.get("band")) ? p.get("band") : null,
  sort: (["down-asc", "down-desc", "year-desc", "name"].includes(p.get("sort") ?? "") ? p.get("sort") : "featured") as SortKey,
});
