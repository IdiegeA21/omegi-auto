import Rise from "./Rise";

/** Numbered steps with big figures. Used where a page explains a sequence. */
export default function Steps({ steps, dark = false, cols = 3, level = 2 }: { steps: { t: string; d: string }[]; dark?: boolean; cols?: 2 | 3 | 4; level?: 2 | 3 }) {
  const H = `h${level}` as "h2" | "h3";
  const grid = cols === 4 ? "md:grid-cols-4" : cols === 2 ? "md:grid-cols-2" : "md:grid-cols-3";
  return (
    <Rise className={`grid gap-8 ${grid}`}>
      {steps.map((s, i) => (
        <div key={s.t} data-rise className={`border-t pt-6 ${dark ? "border-kerb" : "border-tarmac"}`}>
          <p className={`t-fig text-[4.5rem] ${dark ? "text-campaign" : "text-omegi"}`} aria-hidden="true">{i + 1}</p>
          <H className="t-display mt-3 text-[1.9rem]">{s.t}</H>
          <p className={`mt-2 max-w-[36ch] text-[15px] ${dark ? "text-mute-dark" : "text-mute"}`}>{s.d}</p>
        </div>
      ))}
    </Rise>
  );
}
