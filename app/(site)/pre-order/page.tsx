import type { Metadata } from "next";
import { PreOrderForm } from "@/components/forms/BusinessForms";
import SampleFlow from "@/components/pages/SampleFlow";
import PageHead from "@/components/ui/PageHead";

export const metadata: Metadata = { title: "Pre-order", description: "Request the car you want." };
export default function PreOrder() {
  return (<><PageHead eyebrow="Pre-order" title="Request a car" lead="Don't see the car you want? Tell us what you're after." />
    <section className="wrap grid gap-12 pb-section lg:grid-cols-2 lg:gap-16"><div className="max-w-[40rem]"><PreOrderForm /></div><div><SampleFlow /></div></section></>);
}
