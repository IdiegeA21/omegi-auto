# Design system (Stage 1)

## Principles
- **Light first.** White "showroom" surfaces carry the site, matching their ad creative. Tarmac black is used for the footer and dark bands.
- **Money is the hero.** Down payment figures are the biggest numbers on a card.
- **40% is the motif.** Link hovers draw a bar exactly 40% wide; the Deposit Bar (Stage 2) is the signature moment.

## Colour (sampled from the logo file and their "Pay 40%" ad)
| Token | Hex | Rule |
|---|---|---|
| Showroom | #FFFFFF | Primary background |
| Paper | #F4F4F4 | Raised light surface |
| Tarmac | #050505 | Ink, dark bands |
| Omegi Red | #B00104 | Logo red. Fills with white text (7.36:1). Text on white (7.36:1). Never text on black (2.77:1). |
| Campaign Red | #F40308 | Ad red. Large type and graphics on tarmac only (4.72:1). White on it is 4.32:1, so no small white text. |
| Graphite | #5C5C5C | Muted text. 6.7:1 on white. |

## Type
One variable family, Archivo (weight 100-900, width 62-125). Display and figures use width 62-75 at weight 800 (echoing their ads); text uses width 100. The naira sign is an SVG glyph (`components/ui/Money.tsx`) because the font's Latin subset has no U+20A6.

## Motion
- Transform and opacity only. Easing: `expo.out` (entrances), `power4.inOut` (curtains), `power3.out` (soft).
- **Preloader:** first visit per session. Logo assembles in pure CSS from first paint (no JS needed), wheel rolls in, then GSAP lifts the curtain. Skipped on repeat visits and on `/pay-40`.
- **Page transition ("drive-through"):** a black then a red panel sweep left to right in one continuous direction; the destination's name rises while you are covered ("Taking you to / Cars"); a wheel rolls along a rail with its spin computed from the distance, pausing halfway while the page arrives; then the panels drive on off the right edge. About 2 seconds. Plain navigation under reduced motion. The `/pay-40` ad page has no transition.
- **Cursor and magnetic buttons:** desktop fine pointers only. **Lenis:** desktop only; phones scroll natively.
- Reduced motion is respected everywhere. Every GSAP effect is created in an effect or `gsap.context` and cleaned up on unmount.

## Mobile shell
Slim header (logo, shortlist). Bottom dock: Cars, Pay 40%, More, and the WhatsApp action. The page reserves the dock's height (`.site-pad`), so it never covers content; it slides away while a form field is focused.

## Enquiry sheet (Stage 3)
Every car and form action opens one sheet: an optional name, one-tap questions, an optional note, and a preview of the exact message. It opens WhatsApp on the single number in `config/brand.ts`. The header, dock, menu and footer keep a direct WhatsApp link for one-tap access. `/pay-40` uses a direct link too, so it needs no JavaScript.

## Honesty rules in the UI
- Unknown figures show "Ask for price"; nothing is guessed. A price is never derived from a down payment.
- No monthly repayment appears unless an interest rate and tenor are set. Otherwise: "Final terms are confirmed on WhatsApp."
- The pre-qualification form only collects details. No approval or decision language anywhere.
- The pre-order tracker is labelled "Sample flow" and says it is not the business's real process.

## Shortlist drawer
The heart in the header (and the "View" action after saving a car) opens a side panel first: a preview of saved cars with their down payment or price, then three choices: send an enquiry, open the full compare page, or keep browsing. Up to three cars can be saved. Each saved car stores a small snapshot (title, link, figure, image), so the drawer needs no car data.

## Scrolling inside panels
While a panel (menu, enquiry sheet, shortlist drawer) is open the page scroll is locked by stopping Lenis, and a stopped Lenis cancels every wheel event on the page, which also froze scrolling inside the panel. Each panel therefore carries `data-lenis-prevent` and `useIsolateScroll`, which keeps wheel and touch events inside the panel. This was reproduced and fixed in a real browser test (blocked without it, scrolls with it).

## Visible by default
Content is never hidden by CSS alone. Headings that rise word by word are hidden only after the page has booted and only until the stage lights, with a 4.5 second failsafe that reveals everything if the page never comes alive. Below-the-fold sections are marked pending by JavaScript and released by an IntersectionObserver.

## The /pay-40 ad page
Same header idea (logo and a "Main site" link), same footer as the rest of the site, no preloader, transition, smooth scroll or cursor. It shows real down payments from the listings, the registration number, the Instagram link and recent handovers.

## Landing page
Offer bar, then a one-car-at-a-time hero. The "Pay 40% and drive" badge (a ring of text turning around the wheel) appears only on cars with installment open; other slides show their plain price and "Financing on this car: ask us." Slide heights are balanced by design (two-line title, fixed payment area) so the page does not jump. Below: stats from real data, the services ticker, featured cars, shop by brand, a down-payment browser, the Deposit Bar band, tool tiles, a quote band in the dealership's own words, services, recently sold, Instagram, and FAQ.

## Motion rules (learned the hard way)
1. **Never put a CSS transform on an element that GSAP also animates.** GSAP reads a stylesheet transform as pixels, then adds its own `xPercent` or `yPercent` on top, so the element ends up in the wrong place. Pre-hide with `opacity` and let GSAP set the starting offset itself (it also zeroes `x` and `y` explicitly). This was the cause of the page transition's panels never covering the screen and of headings popping in late.
2. **Nothing may make the page wider than the screen.** `html` and `body` use `overflow-x: clip`; fixed overlays (preloader, transition, dialogs) use `overflow: hidden`; the hero image is scaled inside a static, clipped wrapper. A transient overflow widens the mobile layout viewport (390 px became 408 px in testing), which misplaces fixed elements such as the dock.
3. The dock sits on its own compositing layer (`translate3d`, `will-change`, `contain`).

## Page transition, as built
Black then red panels sweep left to right; the destination name rises; the wheel and its rail are children of the red panel (so they can never appear before it) and the wheel rolls with its spin computed from distance; everything drives off to the right. About 2 seconds.

## Delivery map
`data/nigeria.json` holds the outline and all 36 state capitals plus Abuja (12 flagged `major`). `lib/geo.ts` projects them on the server; `components/pages/DeliveryMap.tsx` draws the dot-matrix map, the route (a dotted arc from Lagos) and the rolling wheel. Region chips, a state selector and a free-text field all drive the same selection, and the button and message name the destination. It shows no distance, time or cost. To make a city labelled, set `"major": true` in the JSON.
