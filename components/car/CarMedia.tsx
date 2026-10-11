"use client";
import Image from "next/image";
import { useState } from "react";
import { CarSilhouette } from "@/components/brand/CarSilhouette";
import { carTitle } from "@/lib/carTitle";
import type { PublicCar } from "@/types/car";

const BLUR = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc4JyBoZWlnaHQ9JzUnPjxyZWN0IHdpZHRoPSc4JyBoZWlnaHQ9JzUnIGZpbGw9JyMxNjE2MTYnLz48L3N2Zz4=";

/**
 * Car photo, or (when there is none, or it fails to load) the logo's own silhouette on tarmac.
 * Only a hero image may pass priority. Everything else lazy-loads.
 */
export default function CarMedia({ car, priority = false, sizes = "(min-width:1024px) 30vw, (min-width:640px) 45vw, 92vw", ratio = "aspect-[4/3]", className = "", zoom = true }: {
  car: PublicCar; priority?: boolean; sizes?: string; ratio?: string; className?: string; zoom?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const { hero } = car.media;
  const title = carTitle(car);
  const zoomCls = zoom ? "transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]" : "";

  if (!hero || failed) {
    // The most distinctive token of the model (the one with a number, e.g. G63, LX600), drawn as outlined ghost type.
    const toks = car.model.split(" ");
    const ghost = toks.find((t) => /\d/.test(t)) ?? toks[0];
    return (
      <div role="img" aria-label={`${title}, photo to come`} className={`ph relative overflow-hidden bg-tarmac ${ratio} ${className}`}>
        <span className="ph__ghost" aria-hidden="true" style={{ fontSize: `clamp(2rem, ${Math.min(27, Math.floor(150 / ghost.length))}cqw, 10rem)` }}>{ghost}</span>
        <CarSilhouette className={`absolute inset-x-[7%] bottom-[17%] w-[86%] text-white/[.17] ${zoomCls}`} />
        <span className="absolute bottom-4 left-4 text-[12px] font-semibold text-mute-dark">{car.brand}</span>
        <span className="absolute bottom-3.5 right-3.5 rounded-full border border-white/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white/60">Photo coming soon</span>
      </div>
    );
  }
  return (
    <div className={`relative overflow-hidden bg-pit ${ratio} ${className}`}>
      <Image src={hero} alt={title} fill sizes={sizes} priority={priority} loading={priority ? "eager" : "lazy"}
        placeholder="blur" blurDataURL={BLUR} className={`object-cover ${zoomCls}`} style={{ objectPosition: "50% 55%" }}
        onError={() => setFailed(true)} />
    </div>
  );
}
