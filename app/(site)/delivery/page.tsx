import type { Metadata } from "next";
import SoldWall from "@/components/home/SoldWall";
import DeliveryPlanner from "@/components/pages/DeliveryPlanner";
import PageHead from "@/components/ui/PageHead";
import Steps from "@/components/ui/Steps";
import { getPublicCars, soldCars } from "@/lib/cars";

export const metadata: Metadata = { title: "Nationwide delivery" };

export default function Delivery() {
  return (
    <>
      <PageHead art="wheel" eyebrow="Delivery" title="Nationwide delivery" lead="We deliver across Nigeria. Message us for delivery to your city." />
      <section className="wrap pb-section"><DeliveryPlanner cars={getPublicCars()} /></section>
      <section className="border-t border-rule bg-paper py-section">
        <div className="wrap">
          <p className="t-eyebrow">How to start</p>
          <div className="mt-8"><Steps steps={[
            { t: "Pick your car", d: "Browse the showroom or tell us what you want." },
            { t: "Tell us your city", d: "Use the form above, or message us on WhatsApp." },
            { t: "Confirm the details", d: "Timing and cost are confirmed with you on WhatsApp." },
          ]} /></div>
        </div>
      </section>
      <SoldWall cars={soldCars()} compact />
    </>
  );
}
