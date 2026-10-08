import fs from "node:fs";
import path from "node:path";
import raw from "@/data/cars.json";
import { carTitle } from "@/lib/carTitle";
import type { Car, PublicCar } from "@/types/car";

/** SERVER ONLY. Client components must import carTitle from "@/lib/carTitle", never from here, or the whole data file ships to the browser. */
export { carTitle };

/** Drop-in photos: if media.hero is null, use public/cars/<id>/hero.(webp|avif|jpg|jpeg|png) when that file exists. */
const EXT = ["webp", "avif", "jpg", "jpeg", "png"];
const autoHero = (id: string) => { for (const e of EXT) if (fs.existsSync(path.join(process.cwd(), "public", "cars", id, `hero.${e}`))) return `/cars/${id}/hero.${e}`; return null; };
const cars = (raw as unknown as Car[]).map((c) => (c.media.hero ? c : { ...c, media: { ...c.media, hero: autoHero(c.id) } }));

export const getCars = (): Car[] => cars;
/** Strips internal source notes before data crosses to client components. */
export const getPublicCars = (): PublicCar[] => cars.map(({ src: _s, inferred: _i, ...c }) => c);
export const getCar = (slug: string): Car | undefined => cars.find((c) => c.slug === slug);
export const featuredCars = (): PublicCar[] => getPublicCars().filter((c) => c.featured && c.status === "available");
export const soldCars = (): PublicCar[] => getPublicCars().filter((c) => c.status === "sold");

/** Same brand first, then same category, never the car itself or sold cars. */
export function relatedCars(car: PublicCar, n = 3): PublicCar[] {
  const pool = getPublicCars().filter((c) => c.id !== car.id && c.status === "available");
  const score = (c: PublicCar) => (c.brand === car.brand ? 2 : 0) + (c.categories.some((x) => car.categories.includes(x)) ? 1 : 0);
  return [...pool].sort((a, b) => score(b) - score(a)).slice(0, n);
}
