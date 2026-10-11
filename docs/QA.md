# QA record (Stage 4)

## How this was tested, and the limits
There was no network in the build environment, so `npm install` and `next build` were **never run**. Instead the real code was checked like this:

- **Server rendering.** The project was compiled and every page was rendered to HTML with the real React 19, stubbing only `next/*`, GSAP and Lenis. This proves the pages produce real content and don't crash.
- **Responsive layout.** That HTML was styled with a small Tailwind translator written for this project (the real Tailwind was not available) and measured in headless Chromium at **360, 390, 768 and 1280 px**. It is an approximation: fonts differ (Archivo was not installed; wider stand-ins were used, which makes overflow checks conservative), and scripts were off, so entrance animations did not run.
- **Behaviour in a real browser.** Geometry of every custom animation, the menu-scroll fix and the ticker loop were tested in headless Chromium.
- **Logic.** 75 automated checks on money, payment, filters, finder, messages and data.

## Results (final code)
| Check | Result |
|---|---|
| Pages server-rendered without error | 19 of 19 (home 1,156 words, 143 KB HTML) |
| Horizontal overflow at 360 / 390 / 768 / 1280 px | 0 of 76 page-width combinations |
| Accessibility scan (alt text, names, labels, headings, ids, landmarks, dialogs, link safety) | 19 of 19 clean |
| WhatsApp links in pages | 107 valid, 23 distinct messages, 0 problems |
| WhatsApp messages the browser can build (all cars, sheet, shortlist, forms, special characters) | 37 checked, 0 problems |
| Logic tests | 75 pass |
| Type check | clean, apart from missing React and Next type packages |
| Client code reaching server-only data (cars.json, logo trace, silhouette, `fs`) | none, across 33 client entry points |
| `/pay-40` JavaScript | 5 small client modules (4 KB source), no GSAP, no Lenis |
| Repo search for the previous client | no matches (text, images, file names) |

## Colour contrast (computed)
| Pair | Ratio | Use |
|---|---|---|
| Tarmac on white | 20.4:1 | body text |
| Graphite on white / paper | 6.7 / 6.1:1 | muted text |
| Omegi Red on white | 7.4:1 | links, figures |
| White on Omegi Red | 7.4:1 | buttons |
| White on tarmac | 20.4:1 | footer, dark bands |
| Muted on tarmac / pit | 7.2 / 6.4:1 | footer text |
| Campaign Red on tarmac | 4.7:1 | 13 px label and large type only |
| Availability green on white / tarmac | 4.4 / 4.7:1 | dot (a fix made in Stage 4: it was 2.4:1) |

Not used for text, by design: Campaign Red on white (4.3:1) and Omegi Red on tarmac (2.8:1).

## Fixed during this round
Menu scrolling frozen by a stopped Lenis; stale placeholder answering `/` (see the doctor); wheel icon inlined 28 times (home HTML 269 KB to 143 KB); header overflowing on tablets; tap targets under 44 px (footer, offer bar, slide selectors); hero rows stretching; Deposit Bar showing 100% without JavaScript; heading-level jumps; duplicate ids; unnamed dialog; low-contrast availability dot.

## Not tested: please check on real devices
- A real `npm run dev`, then `npm run build`, with the final Archivo font and Tailwind.
- Lighthouse mobile (target 85+) on a throttled connection. The font file size has not been measured.
- **360, 390, 768 and desktop, on at least one real iPhone and one mid-range Android.**
- Every animation actually running: preloader exit, page transition, hero slides and badge, Deposit Bar, tracker, delivery route, cursor, magnetic buttons.
- Menu, enquiry sheet and shortlist drawer scrolling on desktop (Lenis) and on touch.
- The photo fallback (a path set but the file missing falls back to the silhouette via an error handler that needs a browser).
- Dock behaviour with the on-screen keyboard open.
- Screen reader pass (VoiceOver, TalkBack) on the menu, sheet and drawer.
