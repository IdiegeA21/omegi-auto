import type { Metadata } from "next";
import ShortlistView from "@/components/pages/ShortlistView";
import PageHead from "@/components/ui/PageHead";
import { getPublicCars } from "@/lib/cars";

export const metadata: Metadata = { title: "Shortlist" };
export default function Shortlist() {
  return (<><PageHead eyebrow="Compare" title="Your shortlist" lead="Save up to three cars and compare them side by side." /><ShortlistView cars={getPublicCars()} /></>);
}
