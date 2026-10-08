import type { Metadata } from "next";
import CarFinder from "@/components/pages/CarFinder";
import PageHead from "@/components/ui/PageHead";
import { getPublicCars } from "@/lib/cars";

export const metadata: Metadata = { title: "Car Finder", description: "Three questions to find the right car." };
export default function Finder() {
  return (<><PageHead eyebrow="Car Finder" title="Find your car" lead="Three quick questions. We'll show what fits." /><CarFinder cars={getPublicCars()} /></>);
}
