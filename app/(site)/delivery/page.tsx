import type { Metadata } from "next";
import SoldWall from "@/components/home/SoldWall";
import DeliveryMap from "@/components/pages/DeliveryMap";
import PageHead from "@/components/ui/PageHead";
import Steps from "@/components/ui/Steps";
import { carTitle } from "@/lib/carTitle";
import { getPublicCars, soldCars } from "@/lib/cars";
import { getMap } from "@/lib/geo";

export const metadata: Metadata = { title: "Nationwide delivery" };

export default function Delivery() {
  const map = getMap();
  const cars = getPublicCars().filter((c) => c.status === "available").map((c) => carTitle(c));
  return (
    <>
      <PageHead art="wheel" eyebrow="Delivery" title="Nationwide delivery" lead="We deliver across Nigeria. Pick where yours is going and message us." />
      <section className="wrap pb-section"><DeliveryMap {...map} cars={cars} /></section>
      <section className="border-t border-rule bg-paper py-section">
        <div className="wrap">
          <p className="t-eyebrow">How to start</p>
          <div className="mt-8"><Steps steps={[
            { t: "Pick your car", d: "Browse the showroom or tell us what you want." },
            { t: "Pick your destination", d: "Choose a city or state on the map, or type yours." },
            { t: "Confirm the details", d: "Timing and cost are confirmed with you on WhatsApp." },
          ]} /></div>
        </div>
      </section>
      <SoldWall cars={soldCars()} compact />
    </>
  );
}
