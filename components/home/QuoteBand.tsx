import { WheelMark } from "@/components/brand/WheelMark";
import Reveal from "@/components/ui/Reveal";
import { brand } from "@/config/brand";

/** The dealership's own words from its Instagram caption, set large. Not a testimonial and not paraphrased. */
export default function QuoteBand() {
  return (
    <section className="on-dark relative overflow-hidden bg-tarmac py-section text-white">
      <WheelMark className="pointer-events-none absolute -right-[10vw] top-1/2 h-[min(70vw,560px)] w-[min(70vw,560px)] -translate-y-1/2 text-white/[.05]" />
      <div className="wrap relative">
        <p className="t-eyebrow">{brand.signOff}</p>
        <Reveal as="blockquote" text={brand.about.body[0]} className="t-display t-d2 mt-4 max-w-[18ch] !leading-[.95]" />
        <p className="mt-8 text-[14px] text-mute-dark">{brand.name}, on Instagram</p>
      </div>
    </section>
  );
}
