"use client";
import { useState } from "react";
import Image from "next/image";
import Placeholder from "./Placeholder";

// 8x5 neutral ash blur so lazy images never pop in as a flash of white
const BLUR = "data:image/svg+xml;base64," + "PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc4JyBoZWlnaHQ9JzUnPjxyZWN0IHdpZHRoPSc4JyBoZWlnaHQ9JzUnIGZpbGw9JyNkZWUwZTInLz48L3N2Zz4=";

type Props = {
  src?: string | null;
  alt: string;
  sizes?: string;
  priority?: boolean;       // only the hero image should ever set this
  className?: string;
  label?: string;           // shown on the placeholder
  tone?: "ink" | "ash";
};

/** next/image fill wrapper. Falls back to <Placeholder/> when src is empty or fails to load. */
export default function SmartImage({ src, alt, sizes = "100vw", priority = false, className = "object-cover", label, tone = "ink" }: Props) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return <Placeholder label={label ?? alt} tone={tone} />;
  return (
    <Image src={src} alt={alt} fill sizes={sizes} priority={priority} loading={priority ? "eager" : "lazy"}
      placeholder="blur" blurDataURL={BLUR} className={className} onError={() => setFailed(true)} />
  );
}
