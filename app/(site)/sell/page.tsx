import type { Metadata } from "next";
import { SellForm } from "@/components/forms/BusinessForms";
import PageHead from "@/components/ui/PageHead";

export const metadata: Metadata = { title: "Sell your car" };
export default function Sell() {
  return (<><PageHead eyebrow="Sell" title="Sell your car" lead="Tell us about your car and our team will take it from there on WhatsApp." />
    <section className="wrap pb-section"><div className="max-w-[44rem]"><SellForm /></div></section></>);
}
