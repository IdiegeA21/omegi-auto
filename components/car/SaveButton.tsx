"use client";
import { useShortlist, toggleSaved, MAX_SHORTLIST } from "@/lib/shortlist";
import { toast } from "@/lib/toast";
import { carTitle } from "@/lib/carTitle";
import { figureLabel } from "@/lib/enquiryRequests";
import type { PublicCar } from "@/types/car";
import { IconHeart } from "@/components/shell/Icons";

/** Adds or removes a car from the shortlist (stored on this device only). */
export default function SaveButton({ car, className = "", withLabel = false }: { car: PublicCar; className?: string; withLabel?: boolean }) {
  const title = carTitle(car);
  const saved = useShortlist().some((i) => i.id === car.id);
  return (
    <button type="button" aria-pressed={saved} aria-label={saved ? `Remove ${title} from shortlist` : `Save ${title} to shortlist`}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); const r = toggleSaved({ id: car.id, title, image: car.media.hero, slug: car.slug, figure: figureLabel(car) }); if (r === "full") toast(`Your shortlist is full. Remove a car to add another (up to ${MAX_SHORTLIST}).`); if (r === "added") toast("Saved to your shortlist.", { label: "View", event: "omegi:shortlist-open" }); }}
      className={`${withLabel ? "btn btn-line" : "grid h-11 w-11 place-items-center rounded-full bg-showroom/95 text-tarmac shadow-sm hover:text-omegi"} ${saved ? "!text-omegi" : ""} ${className}`}>
      <IconHeart filled={saved} />
      {withLabel && <span>{saved ? "Saved to shortlist" : "Save to shortlist"}</span>}
    </button>
  );
}
