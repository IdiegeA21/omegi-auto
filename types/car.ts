export type Hotspot = { x: number; y: number; label: string; note?: string };
export type VideoSrc = { mp4: string; webm?: string; poster: string };

export type ColorVariant = { id: string; name: string; hex: string; heroImage: string; gallery?: string[]; spin?: string[] };
export type InteriorVariant = { id: string; name: string; swatch: string; image: string };
export type Stock = { state: "in-stock" | "incoming" | "reserved" | "sold"; units?: number; eta?: string };

/** Normalised car as the UI sees it. Missing values are null; no placeholder strings reach components. */
export type Car = {
  id: string;
  brand: string;
  model: string;
  year: number | null;
  bodyType: string;
  tags: string[];
  status: string;
  featured: boolean;
  heroSlide: boolean;
  order: number;
  exterior: string | null;
  interior: string | null;
  tagline: string | null;
  price: string;
  /** Only specs that have a real value, in display order. */
  specs: { key: string; label: string; value: string }[];
  specsNote: string | null;
  features: string[];
  media: {
    heroImage: string | null;
    heroCutout: string | null;
    heroVideo: VideoSrc | null;
    walkaround: { mp4: string; poster: string } | null;
    gallery: string[];
    interiorImages: string[];
    spin: string[];
    hotspots: Hotspot[];
  };
  colors: ColorVariant[];
  interiors: InteriorVariant[];
  options: { name: string; note?: string }[];
  stock: Stock | null;
};

/** Small, serialisable subset for list views. */
export type CarCardData = Pick<Car, "id" | "brand" | "model" | "year" | "bodyType" | "tags" | "status" | "price" | "tagline"> & {
  heroImage: string | null;
};
