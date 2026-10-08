import Reveal from "./Reveal";

/** Shared header for inner pages. */
export default function PageHead({ eyebrow, title, lead, narrow = true }: { eyebrow: string; title: string; lead?: string; narrow?: boolean }) {
  return (
    <section className="wrap pb-10 pt-12 md:pb-14 md:pt-20">
      <p className="t-eyebrow">{eyebrow}</p>
      <Reveal as="h1" text={title} className={`t-display t-d1 mt-3 ${narrow ? "max-w-[14ch]" : ""}`} />
      {lead && <p className="t-lead mt-6 text-mute">{lead}</p>}
    </section>
  );
}
