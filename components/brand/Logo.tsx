import type { CSSProperties, Ref } from "react";
import { brand } from "@/config/brand";
import { BAR_ORIGIN, LOGO_PARTS, LOGO_VIEWBOX, WHEEL_CENTER, type LogoPart } from "./logoParts";

const part = (p: LogoPart) => <path key={p.id} data-part={p.id} data-role={p.role} d={p.d} fillRule="evenodd" />;
// With transform-box: view-box, CSS transform-origin is measured from the coordinate-system origin (0,0), not the viewBox corner.
const origin = (o: { x: number; y: number }) => `${o.x}px ${o.y}px`;
const originVars = { "--wheel-origin": origin(WHEEL_CENTER), "--bar-origin": origin(BAR_ORIGIN) } as CSSProperties;
const by = (g: LogoPart["group"]) => LOGO_PARTS.filter((p) => p.group === g);

/**
 * Inline logo with every part addressable (data-part / data-g) so GSAP can assemble it.
 * SERVER ONLY, and only the preloader needs it. Header and footer use <LogoImage/>, which the browser caches.
 */
export default function Logo({ tone = "light", className = "", ref }: { tone?: "light" | "dark"; className?: string; ref?: Ref<SVGSVGElement> }) {
  return (
    <svg ref={ref} viewBox={LOGO_VIEWBOX} role="img" aria-label={brand.logo.alt} className={`logo logo--${tone} ${className}`} style={originVars}>
      {by("body").map(part)}
      <g data-g="accent">{by("accent").map(part)}</g>
      {by("letters").map(part)}
      {by("bar").map(part)}
      <g data-g="autos">{by("autos").map(part)}</g>
      <g data-g="wheel">{by("wheel").map(part)}</g>
    </svg>
  );
}
