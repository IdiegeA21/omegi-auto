/** UI thresholds (not business claims). Bands split the stock we have by down-payment size so the browser always has results. */
export const downBands = [
  { id: "u25", label: "Up to ₦25M", min: 0, max: 25_000_000 },
  { id: "25-60", label: "₦25M to ₦60M", min: 25_000_001, max: 60_000_000 },
  { id: "60p", label: "Above ₦60M", min: 60_000_001, max: Infinity },
] as const;
export type DownBandId = (typeof downBands)[number]["id"];

export const heroSlideMs = 6500;
export const inventoryPageSize = 9;

/** Cars shown in the home hero, in order. Only cars with installment open show the 40% tag. */
export const heroSlideIds = ["bmw-x6", "g63-2022", "lx600-2022", "cullinan-2024"] as const;
