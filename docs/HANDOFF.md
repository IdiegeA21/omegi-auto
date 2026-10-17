# Omegi Autos concept: handoff

## What was built
A financing-led concept site for Omegi Autos (Lagos), built on the earlier foundation but with a new structure, design and features.

- **Pages (19 routes):** Home, Cars (search, filters, sort, lazy results), Car detail, Pay 40% (ad landing page), Finance estimator and pre-qualification, Car Finder, Shortlist and compare, Swap, Sell, Pre-order (with a clearly labelled "Sample flow"), Nationwide delivery (an illustrated map of Nigeria: pick any of 12 major cities or all 37 states, a route draws from Lagos and the call to action names the destination), Recently sold, FAQ, About, Contact, Privacy.
- **Shell:** light-first design from the logo, mobile bottom bar with a WhatsApp action, menu sheet, shortlist drawer, one enquiry sheet used everywhere, footer with the registration number, and "Concept preview" label. Site stays `noindex`.
- **Motion:** the logo assembles itself and its wheel rolls in (preloader), a "drive-through" page transition, the Deposit Bar where a wheel rolls to 40%, a rotating "Pay 40%" badge on cars with financing open, a wheel that rolls the route on the delivery map.
- **Data:** 16 cars (14 stock, 2 sold), all editable in `data/cars.json`; FAQ in `data/faq.json`; Instagram tiles in `data/instagram.json`.

## Key decisions
1. **The down payment leads.** Installment cars show the red down payment first; outright cars show a plain price. A price is never derived from a down payment. The 40% figure is labelled "(40%)" where it comes from their rule.
2. **No invented terms.** No interest rate, tenor, monthly figure, approval time, delivery time, hours or statistics appear. Unknown values read "Ask for price" or "Message us on WhatsApp and we'll confirm." Claims not yet approved (1 to 4 years, Flexible repayment, Fast approval) are held back in `config/brand.ts`.
3. **One contact route.** 0903 154 3638, set once. The sheet previews the exact message and nothing is sent until the customer presses send in WhatsApp.
4. **Everything changeable without code.** Prices, down payments, financing flags, sold status, featured cars, FAQ answers, captions. Photos can simply be dropped into a folder (`docs/ASSETS.md`).
5. **The ad page is lean.** No animation library, preloader or cursor, but the same footer and a clear way home (its own slim "Back to main site" bar below 1024 px).
7. **One rule for motion code:** never put a CSS transform on an element GSAP also animates (GSAP reads it as pixels and the two stack), and keep animated elements inside a clipped wrapper so nothing can widen the page. Both are documented in `docs/DESIGN.md`.
6. **Stale-file safeguard.** Extracting a newer zip over an older folder does not delete old files, which is how a leftover placeholder kept showing only the brand name. `npm run dev` and `build` now remove those known leftovers automatically. Best practice: extract into a fresh folder.

## Still needed from the owner
Photos for 16 cars and 6 Instagram tiles; a vector logo; real FAQ answers (interest rate, approval time, how long the balance can be spread); approval of the held-back claims; showroom address and hours; permission to show sold-car customers; confirmation of which cars really have financing open (currently deduced from captions). Full list: `docs/ASSETS.md`.

## Honest caveats
- **Never built in Next.** There was no network, so `npm install` and `next build` have not been run, and Lighthouse was not run. Layout was checked with server rendering and an approximated stylesheet at four widths (`docs/QA.md`); nothing was tested on a real device.
- **Animations were verified by geometry and simulation, not by watching them run.** The page transition was previewed from simulated frames.
- **GSAP was not available here, so no GSAP animation has been run.** The transition and heading fixes remove a CSS/GSAP transform conflict that I verified structurally; the page transition, in particular, needs watching on a real device.
- **The menu-scroll fix is proven against a simulated stopped Lenis**, not Lenis itself.
- **The delivery map is an illustration** built from border and city coordinates (all 37 places verified inside the outline), not surveyed data.
- The logo is a faithful trace of a 600 px JPEG, not the designer's file. The social image uses a system font.
- The BMW photo is a soft 475 px Instagram frame, and its model is inferred from the photo. Categories (Performance, Luxury, Ultra-luxury) are my own classification.
- The naira sign is drawn as an SVG because the font's Latin subset lacks it.
- Follower count (106K) is from the profile screenshot and will go stale.
- The privacy page describes only what this preview does; the business must supply its real policy.
