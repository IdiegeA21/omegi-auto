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
- **Page transition:** red panel and rolling wheel, about 1.1s. Plain navigation under reduced motion.
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
