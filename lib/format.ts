/** "2025 Range Rover Sport", "Mercedes-Benz S 500". Avoids repeating the brand when the model already starts with it. */
export function carTitle(c: { year: number | null; brand: string; model: string }) {
  const model = c.model.toLowerCase().startsWith(c.brand.toLowerCase()) ? c.model : `${c.brand} ${c.model}`;
  return [c.year, model].filter(Boolean).join(" ");
}
