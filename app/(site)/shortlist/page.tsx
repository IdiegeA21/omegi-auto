import type { Metadata } from "next";
import ShortlistView from "@/components/pages/ShortlistView";
import PageHead from "@/components/ui/PageHead";
import { featuredCars, getPublicCars } from "@/lib/cars";

export const metadata: Metadata = { title: "Shortlist" };

export default function Shortlist() {
  return (<><PageHead art="wheel" eyebrow="Compare" title="Your shortlist" lead="Save up to three cars and compare them side by side." /><ShortlistView cars={getPublicCars()} suggestions={featuredCars().slice(0, 3)} /></>);
}
