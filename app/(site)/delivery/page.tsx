import type { Metadata } from "next";
import { DeliveryForm } from "@/components/forms/BusinessForms";
import SoldWall from "@/components/home/SoldWall";
import PageHead from "@/components/ui/PageHead";
import { getPublicCars, soldCars } from "@/lib/cars";

export const metadata: Metadata = { title: "Nationwide delivery" };
export default function Delivery() {
  return (<><PageHead eyebrow="Delivery" title="Nationwide delivery" lead="We deliver across Nigeria. Message us for delivery to your city." />
    <section className="wrap pb-section"><div className="max-w-[44rem]"><DeliveryForm cars={getPublicCars()} /></div>
      <p className="mt-10 max-w-[56ch] text-[14px] text-mute">Delivery details such as timing and cost are confirmed with you on WhatsApp.</p></section>
    <SoldWall cars={soldCars()} compact /></>);
}
