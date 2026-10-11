import { IconArrow } from "@/components/shell/Icons";
import { TransitionLink } from "@/components/shell/TransitionLink";
import { brand } from "@/config/brand";

/** One thin line that states the offer on every visit, whichever car the hero is showing. Only claims marked show:true appear. */
export default function AnnouncementBar() {
  const claims = brand.offer.claims.filter((c) => c.show).map((c) => c.text);
  return (
    <div className="on-dark bg-tarmac text-white">
      <div className="wrap flex items-center justify-between gap-4 text-[13px] font-semibold">
        <p className="min-w-0"><span className="text-campaign">{brand.offer.headline}.</span><span className="hidden text-mute-dark md:inline"> {claims.join(" · ")}</span></p>
        <TransitionLink href="/pay-40" className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 underline-offset-4 hover:underline">How it works <IconArrow className="h-3.5 w-3.5" /></TransitionLink>
      </div>
    </div>
  );
}
