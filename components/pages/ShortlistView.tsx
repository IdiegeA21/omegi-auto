"use client";
import { useEffect, useMemo, useState } from "react";
import CarMedia from "@/components/car/CarMedia";
import PaymentBlock from "@/components/car/PaymentBlock";
import StatusBadge from "@/components/car/StatusBadge";
import { IconChat } from "@/components/shell/Icons";
import EnquiryButton from "@/components/shell/EnquiryButton";
import { TransitionLink } from "@/components/shell/Transition";
import { carTitle } from "@/lib/carTitle";
import { shortlistEnquiry } from "@/lib/enquiryRequests";
import { MAX_SHORTLIST, toggleSaved, useShortlist } from "@/lib/shortlist";
import type { PublicCar } from "@/types/car";

/** Side-by-side compare of up to three saved cars. Saved on this device only. */
export default function ShortlistView({ cars }: { cars: PublicCar[] }) {
  const saved = useShortlist();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const list = useMemo(() => saved.map((s) => cars.find((c) => c.id === s.id)).filter((c): c is PublicCar => !!c), [saved, cars]);

  if (!mounted) return <div className="wrap py-20 text-mute">Loading your shortlist…</div>;
  if (list.length === 0)
    return (
      <div className="wrap pb-section">
        <div className="rounded-3xl border border-rule bg-paper p-8 md:p-12">
          <h2 className="t-display text-[2rem]">Nothing saved yet.</h2>
          <p className="mt-3 max-w-[46ch] text-mute">Tap the heart on any car to save it here. You can compare up to {MAX_SHORTLIST} cars side by side.</p>
          <TransitionLink href="/inventory" className="btn btn-red mt-6">Browse the cars</TransitionLink>
        </div>
      </div>
    );

  const rows: { label: string; get: (c: PublicCar) => string | null }[] = [
    { label: "Year", get: (c: PublicCar) => (c.year ? String(c.year) : null) }, { label: "Condition", get: (c: PublicCar) => c.condition }, { label: "Mileage", get: (c: PublicCar) => c.mileage },
    { label: "Exterior", get: (c: PublicCar) => c.exterior }, { label: "Interior", get: (c: PublicCar) => c.interior }, { label: "Highlights", get: (c: PublicCar) => (c.features.length ? c.features.join(", ") : null) },
  ].filter((r) => list.some((c) => r.get(c)));

  return (
    <div className="wrap pb-section">
      <div className="overflow-x-auto rounded-3xl border border-rule">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <caption className="sr-only">Comparison of your saved cars</caption>
          <thead>
            <tr>
              <td className="w-[8.5rem] border-b border-rule bg-paper" />
              {list.map((c) => (
                <th key={c.id} scope="col" className="min-w-[13rem] border-b border-l border-rule p-4 align-top font-normal">
                  <div className="overflow-hidden rounded-2xl"><CarMedia car={c} sizes="320px" zoom={false} /></div>
                  <div className="mt-3"><StatusBadge car={c} /></div>
                  <TransitionLink href={`/inventory/${c.slug}`} className="u40 mt-2 block text-[1.05rem] font-bold">{carTitle(c)}</TransitionLink>
                  <button type="button" onClick={() => toggleSaved({ id: c.id, title: carTitle(c), image: c.media.hero })} className="mt-2 text-[13px] font-semibold text-omegi underline underline-offset-4">Remove<span className="sr-only"> {carTitle(c)}</span></button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr><th scope="row" className="bg-paper p-4 align-top text-[13px] font-semibold text-mute">Payment</th>{list.map((c) => <td key={c.id} className="border-l border-t border-rule p-4 align-top">{c.status === "sold" ? <span className="font-semibold text-mute">Sold out</span> : <PaymentBlock payment={c.payment} size="sm" />}</td>)}</tr>
            {rows.map((r) => (
              <tr key={r.label}><th scope="row" className="bg-paper p-4 align-top text-[13px] font-semibold text-mute">{r.label}</th>{list.map((c) => <td key={c.id} className="border-l border-t border-rule p-4 align-top text-[14px]">{r.get(c) ?? <span className="text-mute">Ask us</span>}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <EnquiryButton request={shortlistEnquiry(list)} className="btn btn-red"><IconChat /> Send my shortlist on WhatsApp</EnquiryButton>
        <p className="text-[13px] text-mute">{list.length} of {MAX_SHORTLIST} saved. Stored on this device only.</p>
      </div>
    </div>
  );
}
