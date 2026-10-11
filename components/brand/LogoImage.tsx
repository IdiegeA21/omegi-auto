import { brand } from "@/config/brand";

/** Cached static logo for header and footer. No path data ships with it. */
export function LogoImage({ tone = "light", height = 40, className = "", priority = false }: { tone?: "light" | "dark"; height?: number; className?: string; priority?: boolean }) {
  const src = tone === "light" ? brand.logo.light : brand.logo.dark;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={brand.logo.alt} width={Math.round(height * brand.logo.ratio)} height={height} decoding="async" fetchPriority={priority ? "high" : "auto"} className={`block w-auto ${className}`} style={{ height }} />
  );
}
