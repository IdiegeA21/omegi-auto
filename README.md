# Omegi Autos, concept preview

A concept website for Omegi Autos, a Lagos car-loan dealership. Built on Next.js (App Router), TypeScript, Tailwind, GSAP + ScrollTrigger and Lenis.

**Status: Stage 0 (foundation).** The shell, pages and features are built in later stages. See `docs/ASSETS.md` for what is still needed from the owner.

## Where things live
- `config/brand.ts`: every brand-specific value (name, colours, fonts, contacts, offer, finance settings, FAQ, flags).
- `lib/motion/*`: GSAP registration, Lenis control, scroll lock and the entrance gate.
- `components/shell/ContactModal.tsx`: the dialog pattern the enquiry sheet is rebuilt from.
- `data/cars.json`: the car list (filled in Stage 2).

This site is a concept preview. It stays `noindex`.
