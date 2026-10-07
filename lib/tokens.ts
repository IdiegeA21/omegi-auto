import { brand } from "@/config/brand";

/** Mirrors the CSS custom properties in globals.css. GSAP can't read CSS cubic-béziers, so keep both in sync. */
export const ease = {
  out: "expo.out",        // --ease-out    cubic-bezier(.16,1,.3,1)
  inOut: "power4.inOut",  // --ease-inout  cubic-bezier(.76,0,.24,1)
  soft: "power3.out",     // --ease-soft   cubic-bezier(.33,1,.68,1)
} as const;

/** Durations in seconds. Nothing in the shell is slower than `slow`. */
export const dur = { fast: 0.3, base: 0.6, slow: 1.1, wipe: 0.55 } as const;

/** Read-through to config/brand.ts. Do not add data here. */
export const site = {
  name: brand.name,
  whatsapp: brand.contacts.whatsapp,
  instagram: brand.contacts.instagram.url,
  igDm: brand.contacts.instagram.dm,
} as const;
