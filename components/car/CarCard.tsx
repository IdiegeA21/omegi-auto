import { carTitle } from "@/lib/carTitle";
import { TransitionLink } from "@/components/shell/Transition";
import type { PublicCar } from "@/types/car";
import CarMedia from "./CarMedia";
import PaymentBlock from "./PaymentBlock";
import SaveButton from "./SaveButton";
import StatusBadge from "./StatusBadge";

/** The card is one big link (stretched), with the save button sitting above it. Down payment leads on installment cars. */
export default function CarCard({ car, priority = false, className = "", style }: { car: PublicCar; priority?: boolean; className?: string; style?: React.CSSProperties }) {
  const title = carTitle(car);
  const sold = car.status === "sold";
  const meta = [car.condition, car.mileage, car.interior ? `${car.interior} interior` : null].filter(Boolean).slice(0, 2).join(" · ") || car.categories[0] || "";
  return (
    <article className={`group relative flex flex-col overflow-hidden rounded-3xl border border-rule bg-showroom transition-shadow duration-500 hover:shadow-[0_18px_50px_-24px_rgba(5,5,5,.35)] ${className}`} style={style} data-cursor>
      <div className="relative">
        <CarMedia car={car} priority={priority} />
        <StatusBadge car={car} className="absolute left-3 top-3" />
        <SaveButton car={car} className="absolute right-3 top-3 z-20" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-[1.0625rem] font-bold leading-snug">
          <TransitionLink href={`/inventory/${car.slug}`} className="after:absolute after:inset-0 after:z-10">{title}</TransitionLink>
        </h3>
        {meta && <p className="mt-1 text-[13px] text-mute">{meta}</p>}
        <div className="mt-auto pt-5">
          {sold
            ? <p className="text-[15px] font-semibold text-mute">{car.handover ? `Handed over to ${car.handover.customer}` : "Sold out"}</p>
            : <PaymentBlock payment={car.payment} size="sm" />}
        </div>
      </div>
    </article>
  );
}
