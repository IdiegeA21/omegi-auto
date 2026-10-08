# Omegi Autos, concept preview

A concept website for Omegi Autos, a Lagos car-loan dealership. Next.js 15 (App Router), TypeScript, Tailwind 3, GSAP + ScrollTrigger, Lenis, next/image.

**Status: Stage 2 (data and core pages).** Home, Inventory and Car Detail are built. The finance tools and business pages arrive in Stage 3.

## Run it
```bash
npm install
npm run dev
```
`npm install` also refreshes `package-lock.json` for the renamed package.

## Where things live
| Path | What |
|---|---|
| `config/brand.ts` | Every brand-specific value: name, colours, fonts, contacts, offer, finance settings, FAQ, flags. Edit here, nowhere else. |
| `config/nav.ts` | Site structure and menus. |
| `lib/theme.ts` | Turns the colour tokens into CSS variables (read by Tailwind and `globals.css`). |
| `lib/payment.ts`, `lib/money.ts` | Installment vs outright logic and naira formatting. Never derives a price from a down payment. |
| `components/brand/` | Logo traced to vector and split into parts (`logoParts.ts`). |
| `components/home/`, `components/car/` | Home sections; car card, media, payment block, inventory filters. |
| `data/cars.json` | The car list. See `docs/DATA.md`. |
| `components/shell/` | Header, dock, menu sheet, footer, preloader, page transition, cursor. |
| `app/(site)/` | Pages with the full shell. |
| `app/(ad)/` | Minimal-chrome pages for paid-ad traffic (`/pay-40`). |
| `docs/` | `ASSETS.md` (what is still needed), `DESIGN.md`, `DATA.md`. |

This site is a concept preview. It stays `noindex` (meta robots and `robots.txt`).
