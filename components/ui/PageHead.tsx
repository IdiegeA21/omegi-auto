import { CarSilhouette } from "@/components/brand/CarSilhouette";
import Reveal from "./Reveal";
import ScrollWheel from "./ScrollWheel";

/** Header for inner pages. `art` gives each page its own decorative backdrop: a silhouette, a wheel that turns as you scroll, or outlined ghost type. */
export default function PageHead({ eyebrow, title, lead, narrow = true, art, ghost }: { eyebrow: string; title: string; lead?: string; narrow?: boolean; art?: "silhouette" | "wheel" | "ghost"; ghost?: string }) {
  return (
    <section className="relative overflow-hidden">
      {art === "silhouette" && <CarSilhouette className="pointer-events-none absolute -right-6 top-1/2 w-[min(78vw,720px)] -translate-y-1/2 text-tarmac/[.07]" />}
      {art === "wheel" && <ScrollWheel className="pointer-events-none absolute -right-[12vw] top-1/2 h-[min(80vw,520px)] w-[min(80vw,520px)] -translate-y-1/2 text-omegi/[.13] md:-right-[4vw]" />}
      {art === "ghost" && ghost && <span aria-hidden="true" className="pghost">{ghost}</span>}
      <div className="wrap relative pb-10 pt-12 md:pb-14 md:pt-20">
        <p className="t-eyebrow">{eyebrow}</p>
        <Reveal as="h1" text={title} className={`t-display t-d1 mt-3 ${narrow ? "max-w-[14ch]" : ""}`} />
        {lead && <p className="t-lead mt-6 text-mute">{lead}</p>}
      </div>
    </section>
  );
}
