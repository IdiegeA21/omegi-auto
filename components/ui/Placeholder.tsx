/** Tasteful stand-in for any missing photo. Never a broken image. */
export default function Placeholder({ label, tone = "ink", className = "" }: { label?: string; tone?: "ink" | "ash"; className?: string }) {
  const dark = tone === "ink";
  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`}
      style={{ background: dark
        ? "radial-gradient(120% 90% at 50% 38%, #3a3c40 0%, #1b1c1f 55%, #0b0b0c 100%)"
        : "radial-gradient(120% 90% at 50% 38%, #f6f6f7 0%, #dcdee0 60%, #c6c9cc 100%)" }}>
      <div className="absolute inset-0 opacity-70" style={{ backgroundImage: "var(--tile)", backgroundSize: "72px 72px", filter: dark ? "invert(1)" : "none" }} />
      <div className="absolute inset-x-0 bottom-[28%] h-px" style={{ background: dark ? "rgba(255,255,255,.14)" : "rgba(20,21,23,.12)" }} />
      <div className="absolute inset-x-0 bottom-0 h-[28%]" style={{ background: dark ? "linear-gradient(to bottom, rgba(255,255,255,.04), transparent)" : "linear-gradient(to bottom, rgba(0,0,0,.05), transparent)" }} />
      {label && (
        <span className={`absolute bottom-4 left-4 text-xs ${dark ? "text-ash-300" : "text-ash-700"}`}>{label}</span>
      )}
    </div>
  );
}
