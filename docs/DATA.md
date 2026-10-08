# Car data (`data/cars.json`)

16 cars: 14 in stock and 2 sold (handovers). One entry per car. Edit this file to change anything about a car; no code changes needed.

```json
{
  "id": "g63-2022", "slug": "2022-mercedes-benz-amg-g63",
  "brand": "Mercedes-Benz", "model": "AMG G63", "year": 2022,
  "bodyType": "SUV", "categories": ["Performance"],
  "status": "available",           // "available" | "sold"
  "featured": false, "tags": [],   // tags come from captions, e.g. "New arrival"
  "condition": null, "mileage": null, "exterior": null, "interior": "Two-tone",
  "location": null,                // only when a caption states one
  "features": [],
  "payment": { "price": 268000000, "downPayment": null, "downPaymentBy": null, "installment": true, "outright": true },
  "media": { "hero": null, "width": null, "height": null, "gallery": [] },
  "handover": null,                // { "customer": "Mr F", "note": "..." } on sold cars
  "src": { "post": 13, "note": "..." },          // where it came from. Never shown on the site.
  "inferred": { "bodyType": true, "categories": true, "brandModel": false }
}
```

## Payment fields
| Field | Meaning |
|---|---|
| `price` | Full price in naira. `null` shows "Ask for price". |
| `downPayment` | A down payment the caption or owner **stated**. Shown as stated. |
| `downPaymentBy` | `"caption"` or `"owner"`. |
| `installment` | `true` only where the caption or owner says financing is open (or the caption prices the car as a down payment). Controls the red treatment, the Pay 40% hero tag and the 40% rule. |
| `outright` | Defaults to true. |

Rules (see `lib/payment.ts`): a price is never derived from a down payment. With no stated down payment, an installment car that has a price shows 40% of price, labelled "(40%)". Monthly figures never appear unless an interest rate and tenor are set in `config/brand.ts`.

## Photos
Put one image per car at the path below and set `media.hero` (and `width`/`height`). Only the home hero's first image loads eagerly. A car with no photo shows the logo's silhouette on tarmac.

| id | Car | Status | Installment | Photo path |
|---|---|---|---|---|
| `g63-2024` | 2024 Mercedes-Benz AMG G63 | available | yes | `public/cars/g63-2024/hero.webp` |
| `g63-2022` | 2022 Mercedes-Benz AMG G63 | available | yes | `public/cars/g63-2022/hero.webp` |
| `gle63s-2022` | 2022 Mercedes-Benz GLE63 S | available | yes | `public/cars/gle63s-2022/hero.webp` |
| `gle53-2022` | 2022 Mercedes-Benz GLE53 | available | yes | `public/cars/gle53-2022/hero.webp` |
| `gle350-2020` | 2020 Mercedes-Benz GLE350 | available | yes | `public/cars/gle350-2020/hero.webp` |
| `glc63s-2020` | 2020 Mercedes-Benz AMG GLC63 S | available | no | `public/cars/glc63s-2020/hero.webp` |
| `lx600-2022` | 2022 Lexus LX600 | available | yes | `public/cars/lx600-2022/hero.webp` |
| `rx350-2017` | 2017 Lexus RX350 Luxury Edition | available | yes | `public/cars/rx350-2017/hero.webp` |
| `tx350` |  Lexus TX350 | available | yes | `public/cars/tx350/hero.webp` |
| `audi-q8-2020` | 2020 Audi Q8 | available | yes | `public/cars/audi-q8-2020/hero.webp` |
| `macan-turbo-2015` | 2015 Porsche Macan Turbo | available | yes | `public/cars/macan-turbo-2015/hero.webp` |
| `velar-p250s` |  Range Rover Velar P250 S | available | no | `public/cars/velar-p250s/hero.webp` |
| `cullinan-2024` | 2024 Rolls-Royce Cullinan | available | yes | `public/cars/cullinan-2024/hero.webp` |
| `bmw-x6` |  BMW X6 | available | no | `public/cars/bmw-x6/hero.webp` |
| `gle43-2019-sold` | 2019 Mercedes-Benz AMG GLE43 | sold | yes | `public/cars/gle43-2019-sold/hero.webp` |
| `gle350-2021-sold` | 2021 Mercedes-Benz GLE350 | sold | yes | `public/cars/gle350-2021-sold/hero.webp` |

## What was inferred (not from a caption)
- **Body type and categories** (Performance, Luxury, Ultra-luxury) are classifications from general knowledge of the models.
- **BMW X6** is identified from a photo: model and body shape inferred, year unknown.
- Installment is marked on the RX350 and TX350 because their captions price them as a down payment.
- Installment is **not** marked on the GLC63 S, Velar and BMW because their captions do not mention financing.
