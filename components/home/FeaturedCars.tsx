import CarCard from "@/components/car/CarCard";
import { TransitionLink } from "@/components/shell/TransitionLink";
import { IconArrow } from "@/components/shell/Icons";
import Reveal from "@/components/ui/Reveal";
import Rise from "@/components/ui/Rise";
import type { PublicCar } from "@/types/car";

/** The showroom floor: the cars the dealership is putting forward. */
export default function FeaturedCars({ cars, total }: { cars: PublicCar[]; total: number }) {
  return (
    <section className="border-t border-rule py-section">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="t-eyebrow">The showroom</p>
            <Reveal as="h2" text="Featured cars" className="t-display t-d2 mt-3" />
          </div>
          <TransitionLink href="/inventory" className="btn btn-line">See all {total} cars <IconArrow /></TransitionLink>
        </div>
        <Rise className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cars.map((c) => <div key={c.id} data-rise><CarCard car={c} className="h-full" /></div>)}
        </Rise>
      </div>
    </section>
  );
}
