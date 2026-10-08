import raw from "@/data/cars.json";
import type { Car, PublicCar } from "@/types/car";

const cars = raw as unknown as Car[];

export const getCars = (): Car[] => cars;
/** Strips internal source notes before data crosses to client components. */
export const getPublicCars = (): PublicCar[] => cars.map(({ src: _s, inferred: _i, ...c }) => c);
export const getCar = (slug: string): Car | undefined => cars.find((c) => c.slug === slug);
export const carTitle = (c: Pick<Car, "year" | "brand" | "model">) => [c.year, c.brand, c.model].filter(Boolean).join(" ");
export const featuredCars = (): PublicCar[] => getPublicCars().filter((c) => c.featured && c.status === "available");
export const soldCars = (): PublicCar[] => getPublicCars().filter((c) => c.status === "sold");

/** Same brand first, then same category, never the car itself or sold cars. */
export function relatedCars(car: PublicCar, n = 3): PublicCar[] {
  const pool = getPublicCars().filter((c) => c.id !== car.id && c.status === "available");
  const score = (c: PublicCar) => (c.brand === car.brand ? 2 : 0) + (c.categories.some((x) => car.categories.includes(x)) ? 1 : 0);
  return [...pool].sort((a, b) => score(b) - score(a)).slice(0, n);
}
