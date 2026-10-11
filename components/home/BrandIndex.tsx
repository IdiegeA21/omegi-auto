import { IconArrow } from "@/components/shell/Icons";
import { TransitionLink } from "@/components/shell/TransitionLink";
import Reveal from "@/components/ui/Reveal";
import Rise from "@/components/ui/Rise";
import type { PublicCar } from "@/types/car";

/** Shop by brand: every brand in the data with how many cars are available. Counts come straight from cars.json. */
export default function BrandIndex({ cars }: { cars: PublicCar[] }) {
  const avail = cars.filter((c) => c.status === "available");
  const brands = [...new Set(avail.map((c) => c.brand))].map((b) => ({ b, n: avail.filter((c) => c.brand === b).length })).sort((x, y) => y.n - x.n || x.b.localeCompare(y.b));
  return (
    <section className="border-t border-rule py-section">
      <div className="wrap">
        <p className="t-eyebrow">{brands.length} brands in the showroom</p>
        <Reveal as="h2" text="Shop by brand" className="t-display t-d2 mt-3" />
        <Rise className="mt-10 border-t border-rule">
          {brands.map(({ b, n }) => (
            <div key={b} data-rise>
              <TransitionLink href={`/inventory?brand=${encodeURIComponent(b)}`} className="group flex items-center justify-between gap-6 border-b border-rule py-4 transition-[padding,background-color,color] duration-500 hover:bg-tarmac hover:px-5 hover:text-white md:py-5">
                <span className="t-display text-[2.2rem] md:text-[4rem]">{b}</span>
                <span className="flex items-center gap-4 text-[14px] font-semibold text-mute group-hover:text-white/80">{n} {n === 1 ? "car" : "cars"}<span className="grid h-10 w-10 place-items-center rounded-full border border-current transition-transform duration-500 group-hover:translate-x-1"><IconArrow /></span></span>
              </TransitionLink>
            </div>
          ))}
        </Rise>
      </div>
    </section>
  );
}
