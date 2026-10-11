import type { Metadata } from "next";
import { Suspense } from "react";
import InventoryClient from "@/components/car/InventoryClient";
import { IconArrow } from "@/components/shell/Icons";
import EnquiryButton from "@/components/shell/EnquiryButton";
import { IconChat } from "@/components/shell/Icons";
import { TransitionLink } from "@/components/shell/TransitionLink";
import PageHead from "@/components/ui/PageHead";
import StatStrip from "@/components/ui/StatStrip";
import { getPublicCars } from "@/lib/cars";
import { generalEnquiry } from "@/lib/enquiryRequests";

export const metadata: Metadata = { title: "Cars", description: "Browse the Omegi Autos showroom. Down payment shown first on installment cars." };

export default function InventoryPage() {
  const cars = getPublicCars();
  const avail = cars.filter((c) => c.status === "available");
  return (
    <>
      <PageHead art="silhouette" eyebrow="The showroom" title="Cars" lead="On installment cars the down payment comes first, because that is what you pay to drive." />
      <div className="wrap pb-8 md:pb-10">
        <StatStrip stats={[
          { value: avail.length, label: "cars available" },
          { value: new Set(avail.map((c) => c.brand)).size, label: "brands" },
          { value: avail.filter((c) => c.payment.installment).length, label: "with an installment option" },
        ]} />
      </div>
      <Suspense fallback={<div className="wrap py-20 text-mute">Loading cars…</div>}>
        <InventoryClient cars={cars} />
      </Suspense>
      <section className="on-dark bg-tarmac py-section text-white">
        <div className="wrap grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-end">
          <div><p className="t-eyebrow">Don&apos;t see it?</p><h2 className="t-display t-d2 mt-3 max-w-[14ch]">Ask for the car you want.</h2></div>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-1">
            <TransitionLink href="/pre-order" className="btn btn-red">Pre-order a car <IconArrow /></TransitionLink>
            <EnquiryButton request={generalEnquiry("I'm looking for a car I couldn't find on the site.")} className="btn btn-line"><IconChat /> Message us</EnquiryButton>
          </div>
        </div>
      </section>
    </>
  );
}
