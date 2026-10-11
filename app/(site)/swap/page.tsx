import type { Metadata } from "next";
import CarCard from "@/components/car/CarCard";
import { SwapForm } from "@/components/forms/BusinessForms";
import PageHead from "@/components/ui/PageHead";
import Steps from "@/components/ui/Steps";
import { featuredCars, getPublicCars } from "@/lib/cars";

export const metadata: Metadata = { title: "Swap your car", description: "Car swap is available. Tell us your car and the one you want." };

export default function Swap() {
  const picks = featuredCars().slice(0, 2);
  return (
    <>
      <PageHead art="silhouette" eyebrow="Swap" title="Swap your car" lead="Car swap is available. Tell us your car and the one you want." />
      <section className="wrap pb-section"><Steps steps={[
        { t: "Tell us your car", d: "Make, model, year and condition. Whatever you know." },
        { t: "Pick the one you want", d: "Choose from the showroom, or tell us what you are after." },
        { t: "Continue on WhatsApp", d: "Our team takes it from there. We don't give a valuation on this site." },
      ]} /></section>
      <section className="border-t border-rule bg-paper py-section">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7"><h2 className="t-display t-d3">Start your swap</h2><div className="mt-8 max-w-[44rem]"><SwapForm cars={getPublicCars()} /></div></div>
          <aside className="lg:col-span-5"><h2 className="t-display text-[1.75rem]">Cars to swap into</h2><div className="mt-6 grid gap-5">{picks.map((c) => <CarCard key={c.id} car={c} />)}</div></aside>
        </div>
      </section>
    </>
  );
}
