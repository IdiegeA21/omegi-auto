import raw from "@/data/nigeria.json";

/**
 * A stylised map of Nigeria built from border and city coordinates (longitude, latitude). It is an illustration, not a survey:
 * positions are approximate. Projection: equirectangular, scaled at the country's mean latitude so the shape is not stretched.
 * SERVER ONLY: the outline math runs on the server and only the finished path and positions are sent to the browser.
 */
import type { Place, PlaceRaw } from "@/types/geo";
export type { Place, PlaceRaw, Side, Zone } from "@/types/geo";

const LON0 = 2.1, LON1 = 15.2, LAT0 = 3.7, LAT1 = 14.5, K = 56, PAD = 36;
const KX = K * Math.cos((9 * Math.PI) / 180);
export const MAP_W = Math.round((LON1 - LON0) * KX + PAD * 2);
export const MAP_H = Math.round((LAT1 - LAT0) * K + PAD * 2);

export const project = (lon: number, lat: number) => ({ x: (lon - LON0) * KX + PAD, y: (LAT1 - lat) * K + PAD });

/** Chaikin corner-cutting: rounds the outline without overshooting like a spline can. */
export function smooth(pts: [number, number][], rounds = 2): [number, number][] {
  let p = pts;
  for (let r = 0; r < rounds; r++) {
    const out: [number, number][] = [];
    for (let i = 0; i < p.length; i++) {
      const a = p[i], b = p[(i + 1) % p.length];
      out.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25], [a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]);
    }
    p = out;
  }
  return p;
}

export const toPath = (pts: [number, number][]) => "M" + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join("L") + "Z";

/** Ray casting, on raw longitude/latitude. Used by the tests to check every place sits inside the border. */
export function inside(poly: number[][], lon: number, lat: number) {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}

export function getMap() {
  const outline = toPath(smooth(raw.outline.map(([lo, la]) => { const p = project(lo, la); return [p.x, p.y] as [number, number]; })));
  const places: Place[] = (raw.places as PlaceRaw[]).map((p) => { const { x, y } = project(p.lon, p.lat); return { ...p, x, y, px: (x / MAP_W) * 100, py: (y / MAP_H) * 100 }; });
  return { outline, places, w: MAP_W, h: MAP_H, originId: raw.origin };
}
export const rawOutline = raw.outline as number[][];
export const rawPlaces = raw.places as PlaceRaw[];
