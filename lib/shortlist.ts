"use client";
import { useSyncExternalStore } from "react";

export type SavedCar = { id: string; title: string; image: string | null };
const KEY = "omegi-shortlist";
const EMPTY: SavedCar[] = [];
let items: SavedCar[] = EMPTY;
let loaded = false;
const subs = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try { const v = JSON.parse(localStorage.getItem(KEY) || "[]"); if (Array.isArray(v)) items = v; } catch {}
}
function commit(next: SavedCar[]) {
  items = next;
  try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {}
  subs.forEach((f) => f());
}
/** Up to three cars can be compared. */
export const MAX_SHORTLIST = 3;
export const toggleSaved = (car: SavedCar): "added" | "removed" | "full" => {
  load();
  if (items.some((i) => i.id === car.id)) { commit(items.filter((i) => i.id !== car.id)); return "removed"; }
  if (items.length >= MAX_SHORTLIST) return "full";
  commit([...items, car]);
  return "added";
};
export const removeSaved = (id: string) => { load(); commit(items.filter((i) => i.id !== id)); };
export const clearSaved = () => { load(); commit([]); };

const subscribe = (f: () => void) => { load(); subs.add(f); return () => { subs.delete(f); }; };
export const useShortlist = () => useSyncExternalStore(subscribe, () => { load(); return items; }, () => EMPTY);
