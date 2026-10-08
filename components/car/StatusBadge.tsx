import type { PublicCar } from "@/types/car";

/** Available (green dot), Sold out (ink), plus any caption tag such as "New arrival". */
export default function StatusBadge({ car, className = "" }: { car: PublicCar; className?: string }) {
  const pill = "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold leading-none";
  return (
    <span className={`flex flex-wrap gap-1.5 ${className}`}>
      {car.status === "sold"
        ? <span className={`${pill} bg-tarmac text-white`}>Sold out</span>
        : <span className={`${pill} bg-showroom text-tarmac shadow-sm`}><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-ok" />Available</span>}
      {car.status !== "sold" && car.tags.map((t) => <span key={t} className={`${pill} bg-omegi text-white`}>{t}</span>)}
    </span>
  );
}
