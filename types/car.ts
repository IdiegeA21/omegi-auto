import type { PaymentInput } from "@/types/payment";

export type CarStatus = "available" | "sold";

/** One car in data/cars.json. Unknown values are null. Nothing here is guessed at render time. */
export type Car = {
  id: string;
  slug: string;
  brand: string;
  model: string;
  year: number | null;
  bodyType: string;
  categories: string[];
  status: CarStatus;
  featured: boolean;
  /** Short badges taken from captions, e.g. "New arrival". */
  tags: string[];
  condition: string | null;
  mileage: string | null;
  exterior: string | null;
  interior: string | null;
  /** Only when a caption states one. */
  location: string | null;
  features: string[];
  payment: PaymentInput;
  media: { hero: string | null; width: number | null; height: number | null; gallery: string[] };
  handover: { customer: string; note: string } | null;
  /** Traceability: which post this came from and what was inferred. Never rendered. */
  src: { post: number; note: string };
  inferred: { bodyType: boolean; categories: boolean; brandModel: boolean };
};

/** What the browser receives: internal source notes and inference flags stay server-side. */
export type PublicCar = Omit<Car, "src" | "inferred">;
