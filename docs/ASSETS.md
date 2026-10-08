# Omegi Autos: details and images still needed

## Done
- Stage 2: 16 cars in `data/cars.json`, Home, Inventory and Car Detail.
- Primary number: 0903 154 3638 (WhatsApp and call). Set once in `config/brand.ts`.
- Logo traced to vector from the supplied JPEG (`public/brand/*.svg`, `components/brand/logoParts.ts`).
- Business-name registration (BN 3418505) shown in the footer.
- Instagram followers shown as 106K (from the profile screenshot).

## Needed from the owner
- A vector or high-resolution original of the logo (the traced version is faithful but not the designer's file).
- Photos for each car (paths listed in `docs/DATA.md`). Only the BMW has one, and it is a 475 px Instagram frame, so it looks soft on large screens.
- Showroom address and map pin, if a showroom should be shown. Opening hours, if they should be shown.
- Real answers for the FAQ: interest rate, inspection, approval time.
- Whether "1 to 4 years" balance term applies to every car (held back until confirmed).
- Whether "Flexible repayment" and "Fast approval" may be shown (held back until confirmed).
- Permission to show the sold-car customers (currently initials only: Mr F, Mr A) and their handover photos.
- Which cars have installment financing open (set `installment` per car in `data/cars.json`).

## Placeholders in use
- Social image, app icon and favicon are generated from the traced logo; the social image uses a system font and should be re-rendered in the brand font before launch.
