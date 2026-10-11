import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CarCard from "@/components/car/CarCard";
import CarMedia from "@/components/car/CarMedia";
import CrossLinks from "@/components/car/CrossLinks";
import PaymentBlock from "@/components/car/PaymentBlock";
import PaymentOptions from "@/components/car/PaymentOptions";
import SaveButton from "@/components/car/SaveButton";
import StatusBadge from "@/components/car/StatusBadge";
import { IconArrow, IconChat } from "@/components/shell/Icons";
import { TransitionLink } from "@/components/shell/TransitionLink";
import EnquiryButton from "@/components/shell/EnquiryButton";
import { carEnquiry } from "@/lib/enquiryRequests";
import Money from "@/components/ui/Money";
import Reveal from "@/components/ui/Reveal";
import { brand } from "@/config/brand";
import { carTitle, getCar, getCars, getPublicCars, relatedCars } from "@/lib/cars";
import { balanceOf, resolvePayment } from "@/lib/payment";

export const dynamicParams = false;
export const generateStaticParams = () => getCars().map((c) => ({ slug: c.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const car = getCar((await params).slug);
  return car ? { title: carTitle(car), description: `${carTitle(car)} at ${brand.name}.` } : {};
}

const Row = ({ k, children }: { k: string; children: React.ReactNode }) => (
  <div className="flex items-baseline justify-between gap-6 border-b border-rule py-3.5"><dt className="text-[14px] text-mute">{k}</dt><dd className="text-right text-[15px] font-semibold">{children}</dd></div>
);

export default async function CarPage({ params }: { params: Promise<{ slug: string }> }) {
  const full = getCar((await params).slug);
  if (!full) notFound();
  const car = getPublicCars().find((c) => c.id === full.id)!; // internal source notes never reach the page
  const title = carTitle(car);
  const sold = car.status === "sold";
  const v = resolvePayment(car.payment);
  const balance = balanceOf(v.price, v.downPayment?.amount ?? null);
  const specs: [string, string][] = ([["Year", car.year ? String(car.year) : null], ["Condition", car.condition], ["Mileage", car.mileage], ["Exterior", car.exterior], ["Interior", car.interior], ["Location", car.location]] as [string, string | null][]).filter((r): r is [string, string] => !!r[1]);
  const related = relatedCars(car, 3);

  return (
    <>
      <div className="wrap pt-6 md:pt-10">
        <nav aria-label="Breadcrumb" className="text-[13px] text-mute">
          <TransitionLink href="/inventory" className="u40">Cars</TransitionLink><span aria-hidden="true"> / </span><span>{car.brand}</span>
        </nav>
      </div>

      <section className="wrap grid gap-8 pb-section pt-6 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <div className="overflow-hidden rounded-[1.75rem]">
            <CarMedia car={car} priority sizes="(min-width:1024px) 58vw, 94vw" ratio="aspect-[4/3]" zoom={false} />
          </div>
          {!sold && <PaymentOptions car={car} />}
          {car.features.length > 0 && (
            <div className="mt-10">
              <h2 className="t-eyebrow">Highlights</h2>
              <ul className="mt-4 grid gap-x-8 sm:grid-cols-2">
                {car.features.map((f) => <li key={f} className="border-b border-rule py-3 text-[15px]">{f}</li>)}
              </ul>
            </div>
          )}
        </div>

        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
            <StatusBadge car={car} />
            <Reveal as="h1" text={title} className="t-display t-d3 mt-4" />

            {sold ? (
              <div className="mt-8 rounded-3xl bg-paper p-6">
                <p className="text-lg font-bold">This car has been sold.</p>
                {car.handover && <p className="mt-1 text-[15px] text-mute">Handed over to {car.handover.customer}. {car.handover.note}</p>}
                <EnquiryButton request={carEnquiry(car)} className="btn btn-red mt-5"><IconChat /> Ask for a similar car</EnquiryButton>
              </div>
            ) : (
              <>
                <div className="mt-8 rounded-3xl border border-rule p-6"><PaymentBlock payment={car.payment} size="lg" /></div>

                {v.installment && (
                  <div className="mt-4 rounded-3xl bg-paper p-6">
                    <h2 className="text-[15px] font-bold">Pay {brand.finance.downPaymentPercent}% and drive</h2>
                    <dl className="mt-2">
                      {v.downPayment && <Row k={v.downPayment.basis === "rule" ? `Down payment (${brand.finance.downPaymentPercent}% of price)` : "Down payment"}><Money amount={v.downPayment.amount} compact={false} /></Row>}
                      {balance != null && <Row k="Balance"><Money amount={balance} compact={false} /></Row>}
                    </dl>
                    <p className="mt-3 text-[13px] text-mute">{v.downPayment ? "" : "Ask us for the down payment on this car. "}{brand.finance.termsNote}</p>
                    <TransitionLink href="/finance" className="u40 mt-3 text-[13px] font-bold">Open the finance estimator</TransitionLink>
                  </div>
                )}

                <div className="mt-6 grid gap-3">
                  <EnquiryButton request={carEnquiry(car)} className="btn btn-red w-full"><IconChat /> Chat about this car</EnquiryButton>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <SaveButton car={car} withLabel className="w-full" />
                    <TransitionLink href="/swap" className="btn btn-line w-full">Swap your car <IconArrow /></TransitionLink>
                  </div>
                </div>
              </>
            )}

            <div className="mt-10">
              <h2 className="t-eyebrow">Details</h2>
              {specs.length > 0 ? <dl className="mt-3">{specs.map(([k, val]) => <Row key={k} k={k}>{val}</Row>)}</dl>
                : <p className="mt-3 text-[15px] text-mute">Message us for the full specification of this car.</p>}
            </div>
          </div>
        </div>
      </section>

      <CrossLinks car={car} />

      {related.length > 0 && (
        <section className="border-t border-rule bg-paper py-section">
          <div className="wrap">
            <h2 className="t-display t-d3">More from the showroom</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{related.map((c) => <CarCard key={c.id} car={c} className="h-full" />)}</div>
          </div>
        </section>
      )}
    </>
  );
}
