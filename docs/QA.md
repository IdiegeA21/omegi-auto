# QA record (Stage 4)

## How this was tested, and the limits
There was no network in the build environment, so `npm install` and `next build` were **never run**. Instead the real code was checked like this:

- **Server rendering.** The project was compiled and every page was rendered to HTML with the real React 19, stubbing only `next/*`, GSAP and Lenis. This proves the pages produce real content and don't crash.
- **Responsive layout.** That HTML was styled with a small Tailwind translator written for this project (the real Tailwind was not available) and measured in headless Chromium at **360, 390, 768, 1024 and 1280 px**. It is an approximation: fonts differ (Archivo was not installed; wider stand-ins were used, which makes overflow checks conservative), and scripts were off, so entrance animations did not run.
- **Behaviour in a real browser.** Geometry of every custom animation, the menu-scroll fix and the ticker loop were tested in headless Chromium.
- **Logic.** 75 automated checks on money, payment, filters, finder, messages and data.

## Results (final code)
| Check | Result |
|---|---|
| Pages server-rendered without error | 19 of 19 |
| Horizontal overflow at 360 / 390 / 768 / 1024 / 1280 px | 0 of 95 page-width combinations |
| Accessibility scan (alt text, names, labels, headings, ids, landmarks, dialogs, link safety) | 19 of 19 clean |
| WhatsApp links in pages | 108 valid, 24 distinct messages, 0 problems |
| WhatsApp messages the browser can build (all cars, sheet, shortlist, forms, delivery, special characters) | 37 checked, 0 problems |
| Logic tests (money, payment, filters, finder, messages, data, geography, delivery) | 97 pass |
| Type check | clean, apart from missing React and Next type packages |
| Client code reaching server-only data (cars, faq, instagram, map data, logo trace, `fs`) | none, across 33 client entry points |
| `/pay-40` JavaScript | 5 small client modules (4 KB source), no GSAP, no Lenis |
| Delivery map: all 36 states and the FCT inside the drawn outline | 37 of 37, checked in a real browser against the final drawn path |
| Repo search for the previous client (their name, handle, street address, map pin, palette, fonts, stock) | no matches (text, 9 images, file names). The bare city name "Port Harcourt" is deliberately not searched for: it is a Nigerian state capital and appears on the delivery map. |

## Feedback round 2: what was found and how it was proven
| Reported | Cause | Evidence |
|---|---|---|
| Dock distorted while animations run; page briefly wider than the screen | The hero's image wrapper itself was scaled and shifted, pushing the page past the screen edge; the root only had `overflow-x: hidden`. | Reproduced in mobile emulation: the layout viewport grew from **390 to 408 px** in the old state and stayed at 390 px with each fix. |
| Page transition: wheel appears before the background, page appears before the animation | The transition panels carried a CSS `translateX(-101%)` while GSAP animated `xPercent`. GSAP reads a CSS transform as pixels, so the two stack and the panels never reached the screen. | Structural: every GSAP-managed element is now checked to have `transform: none` before animating. GSAP itself was not available to run (see below). |
| Headings seemed to appear late or pop in | Same conflict: a CSS `translateY(105%)` plus GSAP `yPercent`. | Same check. Pre-hide now uses opacity only. |
| Menu not scrolling | A stopped Lenis cancels every wheel event, including those meant for the menu. | Reproduced (blocked) and fixed (scrolls) at phone and desktop widths. |
| `/pay-40` nav buttons joined to the logo | Logo, link pill and button were squeezed into one row. | The way back is now its own bar below 1024 px; measured 83 to 113 px of space on phones. |
| Delivery page was placeholder-like | Replaced by an illustrated map of Nigeria. | 37 of 37 places inside the outline; all calls to action name the destination. |

## Fixed earlier this round
Stale placeholder answering `/` (see the doctor); wheel icon inlined 28 times (home HTML 269 KB to 143 KB); header overflowing on tablets; tap targets under 44 px; hero rows stretching; Deposit Bar showing 100% without JavaScript; heading-level jumps; duplicate ids; unnamed dialog; low-contrast availability dot.

## Not tested: please check on real devices
- A real `npm run dev`, then `npm run build`, with the final Archivo font and Tailwind.
- Lighthouse mobile (target 85+) on a throttled connection. The font file size has not been measured.
- **360, 390, 768 and desktop, on at least one real iPhone and one mid-range Android.**
- **GSAP was not installed here, so no GSAP animation has ever been run.** The transition and heading diagnoses rely on GSAP's documented behaviour (it reads an existing CSS transform as pixels) and on checking that the conflicting CSS is gone, not on watching it. Please watch the page transition closely and tell me if anything is still off.
- The fixed dock on a real iPhone (Safari's toolbar behaviour cannot be reproduced in a desktop browser).
- Every animation actually running: preloader exit, page transition, hero slides and badge, Deposit Bar, tracker, delivery route, cursor, magnetic buttons.
- Menu, enquiry sheet and shortlist drawer scrolling on desktop (Lenis) and on touch.
- The photo fallback (a path set but the file missing falls back to the silhouette via an error handler that needs a browser).
- Dock behaviour with the on-screen keyboard open.
- Screen reader pass (VoiceOver, TalkBack) on the menu, sheet and drawer.

- The delivery map is an illustration: the outline is built from border and city coordinates, not surveyed data, so shapes and positions are approximate (and labelled as such on the page).
