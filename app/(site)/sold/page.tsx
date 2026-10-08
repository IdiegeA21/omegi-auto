import type { Metadata } from "next";
import SoldWall from "@/components/home/SoldWall";
import PageHead from "@/components/ui/PageHead";
import { soldCars } from "@/lib/cars";

export const metadata: Metadata = { title: "Recently sold" };
export default function Sold() {
  return (<><PageHead eyebrow="Handed over" title="Recently sold" lead="Cars that have found their owners." /><SoldWall cars={soldCars()} /></>);
}
