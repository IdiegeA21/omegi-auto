import type { Metadata } from "next";
import { SwapForm } from "@/components/forms/BusinessForms";
import PageHead from "@/components/ui/PageHead";
import { getPublicCars } from "@/lib/cars";

export const metadata: Metadata = { title: "Swap your car", description: "Car swap is available. Tell us your car and the one you want." };
export default function Swap() {
  return (<><PageHead eyebrow="Swap" title="Swap your car" lead="Car swap is available. Tell us your car and the one you want." />
    <section className="wrap pb-section"><div className="max-w-[44rem]"><SwapForm cars={getPublicCars()} /></div></section></>);
}
