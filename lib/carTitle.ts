/** Pure helper. Safe for client components because it imports no data. */
export const carTitle = (c: { year: number | null; brand: string; model: string }) => [c.year, c.brand, c.model].filter(Boolean).join(" ");
