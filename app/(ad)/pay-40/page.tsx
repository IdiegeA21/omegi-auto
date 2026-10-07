import type { Metadata } from "next";
import Reveal from "@/components/ui/Reveal";
import WhatsAppLink from "@/components/shell/WhatsAppLink";
import { IconChat } from "@/components/shell/Icons";
import { brand } from "@/config/brand";

export const metadata: Metadata = { title: "Pay 40% and drive" };

/** Placeholder: shows the minimal ad-landing chrome. The full page is built in Stage 3. */
export default function Pay40Preview() {
  return (
    <section className="wrap py-16 md:py-28">
      <p className="t-eyebrow">{brand.tagline}</p>
      <Reveal as="h1" text={brand.offer.headline} className="t-display t-d1 mt-5 max-w-[12ch]" />
      <WhatsAppLink className="btn btn-red mt-10"><IconChat /> Chat on WhatsApp</WhatsAppLink>
    </section>
  );
}
