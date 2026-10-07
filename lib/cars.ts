import fs from "node:fs";
import path from "node:path";
import raw from "@/data/cars.json";
import type { Car, CarCardData } from "@/types/car";
import { carTitle } from "@/lib/format";
export { carTitle };

/**
 * Server-side loader. Reads data/cars.json (missing values are null or omitted), and auto-discovers images
 * dropped into public/cars/<id>/ so no code or JSON edit is needed to show new photos:
 *   hero.(jpg|jpeg|png|webp|avif)   cutout.(webp|png|avif)
 *   gallery/*   interior/*   spin/* (sorted by filename)   video/hero.mp4 (+ hero.webm, poster.jpg)
 * Explicit arrays in the JSON win over folder discovery.
 */
const PUBLIC = path.join(process.cwd(), "public");
const IMG = /\.(jpe?g|png|webp|avif)$/i;
const SPEC_LABELS: Record<string, string> = {
  engine: "Engine", power: "Power", drivetrain: "Drivetrain", range: "Range", armor_level: "Armour level",
  torque: "Torque", transmission: "Transmission", battery: "Battery", acceleration: "Acceleration", seats: "Seats",
  topSpeed: "Top speed", economy: "Fuel economy", charging: "Fast charging",
};
const SPEC_ORDER = ["engine", "battery", "range", "power", "torque", "transmission", "drivetrain", "acceleration", "topSpeed", "charging", "economy", "seats", "armor_level"];
const specRank = (k: string) => { const i = SPEC_ORDER.indexOf(k); return i < 0 ? 99 : i; };

const clean = (v: unknown): string | null => {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t || null;
};
const exists = (rel: string) => fs.existsSync(path.join(PUBLIC, rel));
const list = (rel: string): string[] => {
  try {
    return fs.readdirSync(path.join(PUBLIC, rel)).filter((f) => IMG.test(f))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).map((f) => `/${rel}/${f}`);
  } catch { return []; }
};
const first = (dir: string, base: string, exts = ["jpg", "jpeg", "png", "webp", "avif"]) => {
  for (const e of exts) if (exists(`${dir}/${base}.${e}`)) return `/${dir}/${base}.${e}`;
  return null;
};
const prettyLabel = (k: string) => SPEC_LABELS[k] ?? k.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase());

type RawCar = (typeof raw)[number] & Record<string, any>;

function normalise(r: RawCar): Car {
  const dir = `cars/${r.id}`;
  const m = (r.media ?? {}) as Record<string, any>;
  const arr = (v: unknown, fallback: string[]) => (Array.isArray(v) && v.length ? (v as string[]).filter((s) => exists(s.replace(/^\//, ""))) : fallback);

  const heroRaw = clean(m.heroImage ?? r.heroImage);
  const heroImage = heroRaw && exists(heroRaw.replace(/^\//, "")) ? heroRaw : first(dir, "hero");

  let heroVideo = null as Car["media"]["heroVideo"];
  if (m.heroVideo?.mp4 && exists(String(m.heroVideo.mp4).replace(/^\//, ""))) heroVideo = m.heroVideo;
  else if (exists(`${dir}/video/hero.mp4`)) {
    heroVideo = {
      mp4: `/${dir}/video/hero.mp4`,
      webm: exists(`${dir}/video/hero.webm`) ? `/${dir}/video/hero.webm` : undefined,
      poster: first(`${dir}/video`, "poster") ?? heroImage ?? "",
    };
  }

  return {
    id: r.id, brand: r.brand, model: r.model, year: typeof r.year === "number" ? r.year : null,
    bodyType: r.bodyType, tags: r.tags ?? [], status: clean(r.status) ?? "Available", featured: !!r.featured, heroSlide: !!r.heroSlide, order: typeof r.order === "number" ? r.order : 99,
    exterior: clean(r.exterior), interior: clean(r.interior), tagline: clean(r.tagline),
    price: clean(r.price) ?? "Price on request",
    specs: Object.entries(r.specs ?? {}).sort(([a], [b]) => specRank(a) - specRank(b)).flatMap(([k, v]) => { const val = clean(v); return val ? [{ key: k, label: prettyLabel(k), value: val }] : []; }),
    specsNote: clean(r.specsNote),
    features: (r.features ?? []).map(clean).filter(Boolean) as string[],
    media: {
      heroImage,
      heroCutout: first(dir, "cutout", ["webp", "png", "avif"]),
      heroVideo,
      walkaround: m.walkaround ?? null,
      gallery: arr(m.gallery, list(`${dir}/gallery`)),
      interiorImages: arr(m.interior_images ?? m.interiorImages, list(`${dir}/interior`)),
      spin: arr(m.spin, list(`${dir}/spin`)),
      hotspots: m.hotspots ?? [],
    },
    colors: r.colors ?? [], interiors: r.interiors ?? [], options: r.options ?? [], stock: r.stock ?? null,
  };
}

let cache: Car[] | null = null;
export function getCars(): Car[] {
  return (cache ??= (raw as RawCar[]).map(normalise).sort((a, b) => a.order - b.order));
}
export const getCar = (id: string) => getCars().find((c) => c.id === id) ?? null;

export const toCardData = (c: Car): CarCardData => ({
  id: c.id, brand: c.brand, model: c.model, year: c.year, bodyType: c.bodyType, tags: c.tags,
  status: c.status, price: c.price, tagline: c.tagline, heroImage: c.media.heroImage,
});

/** "You may also like": same brand and body type score highest, then shared tags. Cars with photos are preferred. */
export function getRelated(id: string, n = 4): Car[] {
  const me = getCar(id);
  if (!me) return [];
  return getCars().filter((c) => c.id !== id)
    .map((c) => ({ c, score: (c.brand === me.brand ? 3 : 0) + (c.bodyType === me.bodyType ? 2 : 0) + c.tags.filter((t) => me.tags.includes(t)).length + (c.media.heroImage ? 2 : 0) }))
    .sort((a, b) => b.score - a.score).slice(0, n).map((x) => x.c);
}
