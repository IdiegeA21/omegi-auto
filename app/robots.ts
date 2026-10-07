import type { MetadataRoute } from "next";
// Concept preview: keep every crawler out.
export default function robots(): MetadataRoute.Robots { return { rules: { userAgent: "*", disallow: "/" } }; }
