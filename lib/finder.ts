import { downBands } from "@/config/ui";
import { figureOf } from "@/lib/inventory";
import type { PublicCar } from "@/types/car";

export type FinderAnswers = { band: string | null; body: string | null; category: string | null; brands: string[] };
export type FinderResult = {
  exact: PublicCar[]; // match everything and have a known figure in the band
  askPrice: PublicCar[]; // match everything but have no stated figure
  closest: PublicCar[]; // only when nothing matched: the nearest cars, with what was relaxed
  relaxed: "brand" | "type" | "budget" | null;
};

type Crit = { band: boolean; type: boolean; brand: boolean };
const matches = (c: PublicCar, a: FinderAnswers, use: Crit) =>
  (!use.type || ((!a.body || c.bodyType === a.body) && (!a.category || c.categories.includes(a.category)))) &&
  (!use.brand || a.brands.length === 0 || a.brands.includes(c.brand));
const inBand = (c: PublicCar, bandId: string | null) => {
  const b = downBands.find((x) => x.id === bandId);
  if (!b) return true;
  const n = figureOf(c, "down");
  return n != null && n >= b.min && n <= b.max;
};

/** Never invents a match: if nothing fits, it says what it loosened to find the closest cars. */
export function findMatches(cars: PublicCar[], a: FinderAnswers): FinderResult {
  const pool = cars.filter((c) => c.status === "available");
  const full: Crit = { band: true, type: true, brand: true };
  const exact = pool.filter((c) => matches(c, a, full) && inBand(c, a.band));
  const askPrice = a.band ? pool.filter((c) => matches(c, a, full) && figureOf(c, "down") == null) : [];
  if (exact.length || askPrice.length) return { exact, askPrice, closest: [], relaxed: null };
  const tiers: { relaxed: FinderResult["relaxed"]; use: Crit }[] = [
    { relaxed: "brand", use: { band: true, type: true, brand: false } },
    { relaxed: "type", use: { band: true, type: false, brand: false } },
    { relaxed: "budget", use: { band: false, type: false, brand: false } },
  ];
  for (const t of tiers) {
    const hit = pool.filter((c) => matches(c, a, t.use) && inBand(c, t.use.band ? a.band : null));
    if (hit.length) return { exact: [], askPrice: [], closest: hit.slice(0, 6), relaxed: t.relaxed };
  }
  return { exact: [], askPrice: [], closest: [], relaxed: null };
}
