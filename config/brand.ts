/**
 * config/brand.ts
 * ----------------------------------------------------------------------------
 * The ONE place that holds everything brand-specific. Components import from
 * here; nothing else in the repo may hard-code a name, number, colour, claim,
 * address or handle.
 *
 * Conventions
 *  - `null` or "" means "not supplied yet". The UI hides the element or shows a
 *    neutral placeholder ("Ask for price"). It never invents a value.
 *  - Public claims carry a `source` and a `show` flag. `show: false` means the
 *    claim was seen on the prospect's public posts but is held back until the
 *    owner approves it for the website.
 *  - Contact numbers are stored as digits in international format, no "+",
 *    e.g. "2348012345678". One primary number is set here, once.
 */

type Source =
  | "instagram-bio"
  | "instagram-caption"
  | "instagram-ad"
  | "logo-file"
  | "owner-supplied"
  | "concept-default";

export type Claim = { text: string; source: Source; show: boolean };

export const brand = {
  // ---- Identity ------------------------------------------------------------
  name: "Omegi Autos",
  shortName: "Omegi",
  tagline: "Nigeria's Trusted Car Loan Dealership", // their Instagram bio line
  signOff: "Making car ownership easier.", // their caption sign-off
  conceptLabel: "Concept preview",
  defaultMessage: "Hello Omegi Autos, I'd like to know more about your cars.",

  logo: {
    // Traced to vector from the supplied 600x600 JPEG (kept in docs/source, not shipped).
    light: "/brand/omegi-logo.svg", // for light surfaces: near-black ink, Omegi Red
    dark: "/brand/omegi-logo-on-dark.svg", // for dark surfaces: white ink, Campaign Red
    ratio: 600 / 272, // width / height of the lockup
    alt: "Omegi Autos",
  },

  // ---- Colour tokens (sampled from the logo file and the Nov 2025 ad) -------
  // Contrast ratios were computed, not eyeballed. See notes per token.
  colors: {
    // Surfaces
    tarmac: "#050505", // logo background. Dark surface.
    pit: "#161616", // raised dark surface (cards on tarmac)
    kerb: "#2A2A2A", // hairlines and borders on dark
    showroom: "#FFFFFF", // light surface, matches their ad creative
    paper: "#F4F4F4", // raised light surface
    rule: "#E2E2E2", // hairlines on light

    // Brand reds
    omegiRed: "#B00104", // sampled from the logo. White text on it: 7.36:1. On white: 7.36:1.
    campaignRed: "#F40308", // sampled from the "Pay 40%" ad. On tarmac: 4.72:1 (large type and graphics only). White on it is 4.32:1, so never small white text.

    // Text
    onDark: "#FFFFFF", // on tarmac 20.4:1
    onDarkMuted: "#9A9A9A", // on tarmac 7.2:1, on pit 6.4:1
    onLight: "#050505",
    onLightMuted: "#5C5C5C", // on white 6.7:1, on paper 6.1:1

    // Function only (availability dot). Never used as a brand colour.
    available: "#2FBF71", // dot on tarmac 8.6:1 (non-text, needs 3:1)
  },

  // ---- Type ----------------------------------------------------------------
  // Proposed. Confirmed in Stage 1 after checking the naira sign (U+20A6)
  // renders in the chosen face; a system fallback is wired for that glyph.
  // One variable family (Archivo, width + weight axes): ultra-condensed heavy for display, normal width for text.
  // The naira sign is drawn as an SVG glyph (components/ui/Money.tsx) because the font's Latin subset omits U+20A6.
  fonts: {
    family: "Archivo",
    cssVar: "--font-archivo",
    display: { wdth: 62, wght: 800 },
    figure: { wdth: 75, wght: 800 },
    body: { wdth: 100, wght: 450 },
  },

  // ---- Contacts ------------------------------------------------------------
  contacts: {
    whatsapp: "2349031543638", // PRIMARY route, digits only. Set once here, used everywhere.
    callNumber: "2349031543638", // tap-to-call
    phoneDisplay: "0903 154 3638",
    email: "",
    instagram: {
      handle: "omegiautos",
      url: "https://instagram.com/omegiautos",
      dm: "https://ig.me/m/omegiautos",
      followers: "106K", // read from the public profile screenshot; refresh before any real launch
    },
    // Other platforms appear as icons on their ad. Handles unverified, so not linked.
    tiktok: null as string | null,
    facebook: null as string | null,
    x: null as string | null,
    // Numbers seen on their public posts. NOT used by the site. For the owner
    // to choose from. Consolidating to one primary route is a Stage 3 feature.
    seenOnPosts: [
      { raw: "0913 688 8000", seenOn: "Nov 2025 'Pay 40%' ad caption" },
      { raw: "0903 154 3638", seenOn: "'Pay 40%' ad graphic, most car captions (CHOSEN as primary)" },
      { raw: "+234 813 168 7040", seenOn: "G63, Audi Q8, Macan captions" },
      { raw: "+234 901 584 8876", seenOn: "Rolls-Royce captions" },
    ],
  },

  // ---- Location ------------------------------------------------------------
  address: {
    line1: "", // not supplied
    area: "",
    city: "Lagos",
    state: "Lagos",
    country: "Nigeria",
    mapUrl: null as string | null,
    showOnSite: false, // hide address block until supplied
  },
  hours: null as string | null, // not supplied. Never assumed.

  registration: { label: "BN", number: "3418505", statement: "Registered business name", show: true }, // from their bio; shown in the footer

  // ---- Services (from their bio: Buy, Car Loan, Pre-Order, Sell, Swap, Nationwide Delivery)
  services: [
    { id: "buy", label: "Buy", href: "/inventory" },
    { id: "loan", label: "Car Loan", href: "/pay-40" },
    { id: "preorder", label: "Pre-Order", href: "/pre-order" },
    { id: "sell", label: "Sell", href: "/sell" },
    { id: "swap", label: "Swap", href: "/swap" },
    { id: "delivery", label: "Nationwide Delivery", href: "/delivery" },
  ] as const,

  // ---- The public offer ----------------------------------------------------
  offer: {
    headline: "Pay 40% and drive your dream car",
    downPaymentPercent: 40, // from their ad. Drives the estimator.
    claims: [
      { text: "Flexible repayment", source: "instagram-ad", show: false },
      { text: "Fast approval", source: "instagram-ad", show: false }, // no timeframe given. Hold back.
      { text: "Car loan and car swap available", source: "instagram-caption", show: true },
      { text: "Nationwide delivery", source: "instagram-bio", show: true },
    ] as Claim[],
  },

  // ---- Finance settings ----------------------------------------------------
  // Monthly figures are shown ONLY when both interestRatePercent and tenorMonths
  // are set. Both default to null, so the estimator shows the 40% split and the
  // balance, then "Final terms are confirmed on WhatsApp."
  finance: {
    downPaymentPercent: 40,
    interestRatePercent: null as number | null,
    tenorMonths: null as number[] | null, // e.g. [12, 24, 36, 48] once confirmed
    // Two captions say "spread the remaining balance over 1-4 years". Held back
    // until the owner confirms it applies to every car.
    publicBalanceTerm: { text: "1 to 4 years", source: "instagram-caption" as Source, show: false },
    termsNote: "Final terms are confirmed on WhatsApp.",
    unknownPrice: "Ask for price",
  },

  // ---- Copy ----------------------------------------------------------------
  // About copy uses only their own published phrases until the owner supplies more.
  about: {
    lead: "Making car ownership easier.",
    body: [
      "We don't just sell cars. We make sure you get exactly what you're paying for.", // their caption wording
    ],
    needsFromOwner: "Story, founding year, team, showroom details.",
  },

  // `answer: null` renders "Message us on WhatsApp and we'll confirm."
  faq: [
    { q: "What is the interest rate?", a: null as string | null },
    { q: "How much do I pay upfront?", a: "Our offer is 40% down. You pay that and drive. Final terms are confirmed on WhatsApp." },
    { q: "Can I inspect the car before paying?", a: null },
    { q: "Do you accept car swaps?", a: "Yes. Car swap is available. Message us your car's details and the car you want." },
    { q: "Do you deliver outside Lagos?", a: "Yes. Nationwide delivery is available. Message us for delivery to your city." },
    { q: "How long does approval take?", a: null },
  ],

  // ---- Feature flags -------------------------------------------------------
  features: {
    preloader: true,
    cursor: true, // desktop fine pointer only
    smoothScroll: true,
    instagramStrip: true,
    soldWall: true,
    preOrderTracker: true, // always labelled "Sample flow"
    showFollowerCount: true, // 106K from their public profile screenshot
  },

  // ---- Site / SEO ----------------------------------------------------------
  site: {
    robots: { index: false, follow: false }, // concept preview stays noindex
    themeColor: "#050505",
    title: "Omegi Autos | Pay 40% and drive",
    description: "Car loan dealership in Lagos. Pay 40% down, swap, pre-order, sell, and nationwide delivery.",
  },
} as const;

export type Brand = typeof brand;
