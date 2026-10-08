import type { Metadata } from "next";
import FinanceTools from "@/components/forms/FinanceTools";
import PageHead from "@/components/ui/PageHead";
import { getPublicCars } from "@/lib/cars";

export const metadata: Metadata = { title: "Finance estimator", description: "See your 40% down payment and balance." };
export default function Finance() {
  return (<><PageHead eyebrow="Finance" title="Your 40%" lead="Pick a car or enter a price to see the down payment and the balance." /><section className="wrap pb-section"><FinanceTools cars={getPublicCars()} /></section></>);
}
