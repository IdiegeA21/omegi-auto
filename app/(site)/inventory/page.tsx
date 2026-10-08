import type { Metadata } from "next";
import { Suspense } from "react";
import InventoryClient from "@/components/car/InventoryClient";
import Reveal from "@/components/ui/Reveal";
import { getPublicCars } from "@/lib/cars";

export const metadata: Metadata = { title: "Cars", description: "Browse the Omegi Autos showroom. Down payment shown first on installment cars." };

export default function InventoryPage() {
  const cars = getPublicCars();
  return (
    <>
      <section className="wrap pb-8 pt-12 md:pb-10 md:pt-20">
        <p className="t-eyebrow">The showroom</p>
        <Reveal as="h1" text="Cars" className="t-display t-d1 mt-3" />
        <p className="t-lead mt-5 text-mute">On installment cars the down payment comes first, because that is what you pay to drive.</p>
      </section>
      <Suspense fallback={<div className="wrap py-20 text-mute">Loading cars…</div>}>
        <InventoryClient cars={cars} />
      </Suspense>
    </>
  );
}
