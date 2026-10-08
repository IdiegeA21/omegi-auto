# Assets: which folder collects which image

Everything works with placeholders today. A car with no photo shows the logo's own car silhouette on black; an Instagram tile with no image shows the same. To replace a placeholder, **drop the file in the folder below. No code or JSON edit is needed** (the site picks up `hero.*` and `<id>.*` automatically). Run `npm run assets:check` to see what is in place and what is still missing.

## 1. Car photos: `public/cars/<car-id>/`

One folder per car. The main photo is `hero.webp` (`.jpg`, `.jpeg`, `.png` and `.avif` also work).

| Folder | File | Car | Status |
|---|---|---|---|
| `public/cars/g63-2024/` | `hero.webp` | 2024 Mercedes-Benz AMG G63 | placeholder |
| `public/cars/g63-2022/` | `hero.webp` | 2022 Mercedes-Benz AMG G63 | placeholder |
| `public/cars/gle63s-2022/` | `hero.webp` | 2022 Mercedes-Benz GLE63 S | placeholder |
| `public/cars/gle53-2022/` | `hero.webp` | 2022 Mercedes-Benz GLE53 | placeholder |
| `public/cars/gle350-2020/` | `hero.webp` | 2020 Mercedes-Benz GLE350 | placeholder |
| `public/cars/glc63s-2020/` | `hero.webp` | 2020 Mercedes-Benz AMG GLC63 S | placeholder |
| `public/cars/lx600-2022/` | `hero.webp` | 2022 Lexus LX600 | placeholder |
| `public/cars/rx350-2017/` | `hero.webp` | 2017 Lexus RX350 Luxury Edition | placeholder |
| `public/cars/tx350/` | `hero.webp` | Lexus TX350 | placeholder |
| `public/cars/audi-q8-2020/` | `hero.webp` | 2020 Audi Q8 | placeholder |
| `public/cars/macan-turbo-2015/` | `hero.webp` | 2015 Porsche Macan Turbo | placeholder |
| `public/cars/velar-p250s/` | `hero.webp` | Range Rover Velar P250 S | placeholder |
| `public/cars/cullinan-2024/` | `hero.webp` | 2024 Rolls-Royce Cullinan | placeholder |
| `public/cars/bmw-x6/` | `hero.webp` | BMW X6 | in place |
| `public/cars/gle43-2019-sold/` | `hero.webp` | 2019 Mercedes-Benz AMG GLE43 (sold: handover photo) | placeholder |
| `public/cars/gle350-2021-sold/` | `hero.webp` | 2021 Mercedes-Benz GLE350 (sold: handover photo) | placeholder |

**Used where:** home hero, featured cars, every car card, the car page, the compare table, the Car Finder results, and (for sold cars) the Recently sold wall.

**Spec:** landscape **4:3**, about **1600 x 1200 px**, WebP or JPG, **under 300 KB**. The photo is cropped to 4:3 on cards and 5:4 in the home hero, so keep the car centred with a little room on every side. If you only have a vertical reel frame, crop it to 4:3 around the front of the car (as was done for the BMW).

**Override in JSON:** set `media.hero` in `data/cars.json` (for example `"/cars/lx600-2022/front.jpg"`) if a file has a different name. A value in the JSON wins over the folder convention.

## 2. Instagram strip: `public/instagram/`

| File | Used for |
|---|---|
| `ig-1.webp` to `ig-6.webp` | The six thumbnails in "Latest on Instagram" (home page). |

**Spec:** **square, 1080 x 1080 px** (shown at about 200 to 640 px), WebP or JPG, under 150 KB. Edit the captions in `data/instagram.json`. Tiles link to the profile, never to embedded posts.

## 3. Brand and social: already generated

| Location | File | Notes |
|---|---|---|
| `public/brand/` | `omegi-logo.svg`, `omegi-logo-on-dark.svg` | Traced from the supplied JPEG. Replace with the designer's vector when available. |
| `docs/source/` | `omegi-logo-source.jpg` | The original 600 x 600 file. Not shipped to visitors. |
| `app/` | `icon.svg`, `favicon.ico`, `apple-icon.png` (180 x 180) | Generated from the wheel. |
| `app/` | `opengraph-image.png`, `twitter-image.png` (1200 x 630) | Link-preview image. Re-render in the brand font, ideally with a real car photo, before launch. |

## 4. Changing information without code

| What | File | Field |
|---|---|---|
| A car's price, or a stated down payment | `data/cars.json` | `payment.price`, `payment.downPayment` (and `downPaymentBy`) |
| Whether financing is open on a car (shows the red Installment tag and the 40% treatment) | `data/cars.json` | `payment.installment` |
| Mark a car sold (moves it to the Sold wall) | `data/cars.json` | `status: "sold"`, plus `handover` |
| Feature a car on the home page | `data/cars.json` | `featured: true` |
| Which cars appear in the home hero | `config/ui.ts` | `heroSlideIds` |
| FAQ answers (blank = "Message us on WhatsApp and we'll confirm.") | `data/faq.json` | `a` |
| Instagram captions | `data/instagram.json` | `caption` |
| Interest rate and tenor (turns on monthly figures) | `config/brand.ts` | `finance.interestRatePercent`, `finance.tenorMonths` |
| Phone number, address, hours | `config/brand.ts` | `contacts`, `address`, `hours` |

## 5. Still needed from the owner

- Real photos for the 16 cars and the 6 Instagram tiles (sections 1 and 2).
- A vector or high-resolution logo.
- Real FAQ answers: interest rate, approval time, how long the balance can be spread over (`data/faq.json`).
- Whether "1 to 4 years", "Flexible repayment" and "Fast approval" may be shown (held back in `config/brand.ts`).
- Showroom address and map pin; opening hours.
- Permission to show sold-car customers (initials only today) and their handover photos.
- Confirmation of which cars really have installment financing open. Today it is deduced from captions; change `payment.installment` per car.
