import type { Metadata } from "next";
import SoldWall from "@/components/home/SoldWall";
import PageHead from "@/components/ui/PageHead";
import { soldCars } from "@/lib/cars";

export const metadata: Metadata = { title: "Recently sold" };

export default function Sold() {
  const n = soldCars().length;
  return (
    <>
      <PageHead art="ghost" ghost="SOLD" eyebrow="Handed over" title="Recently sold" lead={`${n} ${n === 1 ? "car" : "cars"} that found their owners, from our own posts.`} />
      <SoldWall cars={soldCars()} />
    </>
  );
}
