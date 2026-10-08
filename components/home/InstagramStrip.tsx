import Image from "next/image";
import { CarSilhouette } from "@/components/brand/CarSilhouette";
import { IconArrow, IconInstagram } from "@/components/shell/Icons";
import Reveal from "@/components/ui/Reveal";
import Rise from "@/components/ui/Rise";
import { brand } from "@/config/brand";
import { getInstagram } from "@/lib/instagram";

/** Static thumbnails that link out to the profile. No embeds, no widgets, no third-party scripts. Edit data/instagram.json. */
export default function InstagramStrip() {
  const ig = brand.contacts.instagram;
  return (
    <section className="border-t border-rule py-section">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="t-eyebrow">@{ig.handle}{brand.features.showFollowerCount ? ` · ${ig.followers} followers` : ""}</p>
            <Reveal as="h2" text="Latest on Instagram" className="t-display t-d2 mt-3" />
          </div>
          <a href={ig.url} target="_blank" rel="noopener noreferrer" className="btn btn-ink"><IconInstagram /> Follow us <IconArrow /><span className="sr-only"> (opens Instagram in a new tab)</span></a>
        </div>
        <Rise className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-6">
          {getInstagram().map((t) => (
            <a key={t.id} data-rise href={ig.url} target="_blank" rel="noopener noreferrer" className="group relative block aspect-square overflow-hidden rounded-2xl bg-tarmac">
              {t.image
                ? <Image src={t.image} alt={t.caption} fill sizes="(min-width:1024px) 16vw, (min-width:768px) 30vw, 46vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                : <CarSilhouette className="absolute inset-x-[8%] top-[22%] w-[84%] text-white/[.12] transition-transform duration-700 group-hover:scale-105" />}
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-tarmac/90 to-transparent p-3 pt-10 text-[13px] font-semibold leading-snug text-white">{t.caption}<span className="sr-only"> on Instagram (opens in a new tab)</span></span>
            </a>
          ))}
        </Rise>
      </div>
    </section>
  );
}
