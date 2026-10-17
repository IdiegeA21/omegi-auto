export type Zone = "North West" | "North East" | "North Central" | "South West" | "South East" | "South South";
export type Side = "l" | "r" | "t" | "b";
export type PlaceRaw = { id: string; state: string; city: string; lon: number; lat: number; zone: Zone; major: boolean; side: Side };
/** x, y are map units; px, py are the same position as percentages of the map box (for overlaying HTML on the SVG). */
export type Place = PlaceRaw & { x: number; y: number; px: number; py: number };
