import CarMedia from "@/components/car/CarMedia";
import StatusBadge from "@/components/car/StatusBadge";
import { IconArrow, IconChat } from "@/components/shell/Icons";
import EnquiryButton from "@/components/shell/EnquiryButton";
import { TransitionLink } from "@/components/shell/TransitionLink";
import Reveal from "@/components/ui/Reveal";
import Rise from "@/components/ui/Rise";
import { carTitle } from "@/lib/carTitle";
import { generalEnquiry } from "@/lib/enquiryRequests";
import type { PublicCar } from "@/types/car";

/** Recently sold: only cars marked "sold" in cars.json, with the handover details from their own posts. */
export default function SoldWall({ cars, compact = false }: { cars: PublicCar[]; compact?: boolean }) {
  if (cars.length === 0) return null;
  return (
    <section className={compact ? "border-t border-rule bg-paper py-section" : "pb-section"}>
      <div className="wrap">
        {compact && (
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div><p className="t-eyebrow">Handed over</p><Reveal as="h2" text="Recently sold" className="t-display t-d2 mt-3" /></div>
            <TransitionLink href="/sold" className="btn btn-line">See all <IconArrow /></TransitionLink>
          </div>
        )}
        {!compact && <h2 className="sr-only">Sold cars</h2>}
        <Rise className={`${compact ? "mt-10" : ""} grid gap-5 md:grid-cols-2`}>
          {cars.map((c) => (
            <article key={c.id} data-rise className="overflow-hidden rounded-3xl border border-rule bg-showroom">
              <div className="relative"><CarMedia car={c} ratio="aspect-[16/10]" zoom={false} /><StatusBadge car={c} className="absolute left-4 top-4" /></div>
              <div className="p-6 md:p-8">
                <h3 className="t-display text-[2rem]">{carTitle(c)}</h3>
                {c.handover && <p className="mt-2 text-[16px] font-semibold">Handed over to {c.handover.customer}</p>}
                {c.handover?.note && <p className="mt-1 text-[14px] text-mute">{c.handover.note}</p>}
              </div>
            </article>
          ))}
        </Rise>
        {!compact && (
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <p className="text-[1.1rem] font-bold">Your car could be next.</p>
            <EnquiryButton request={generalEnquiry("I'd like to buy a car like the ones you've delivered.")} className="btn btn-red"><IconChat /> Start on WhatsApp</EnquiryButton>
          </div>
        )}
      </div>
    </section>
  );
}
