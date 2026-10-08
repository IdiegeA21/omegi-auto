import { brand } from "@/config/brand";

/** Neutral stand-in for any missing photo. Never a broken image. */
export default function Placeholder({ label, tone = "dark", className = "" }: { label?: string; tone?: "dark" | "light"; className?: string }) {
  const c = brand.colors;
  const dark = tone === "dark";
  return (
    <div
      className={`relative h-full w-full overflow-hidden ${className}`}
      style={{ background: dark ? `radial-gradient(120% 90% at 50% 38%, ${c.kerb} 0%, ${c.pit} 55%, ${c.tarmac} 100%)` : `linear-gradient(${c.paper}, ${c.rule})` }}
    >
      <div className="absolute inset-x-0 bottom-[28%] h-px" style={{ background: dark ? c.kerb : c.rule }} />
      {label && (
        <span className="absolute bottom-4 left-4 text-xs" style={{ color: dark ? c.onDarkMuted : c.onLightMuted }}>{label}</span>
      )}
    </div>
  );
}
