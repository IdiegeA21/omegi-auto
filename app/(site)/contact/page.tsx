import type { Metadata } from "next";
import { IconChat, IconInstagram } from "@/components/shell/Icons";
import WhatsAppLink from "@/components/shell/WhatsAppLink";
import PageHead from "@/components/ui/PageHead";
import { brand } from "@/config/brand";

export const metadata: Metadata = { title: "Contact" };
export default function Contact() {
  const c = brand.contacts, a = brand.address;
  return (<><PageHead eyebrow="Contact" title="Talk to us" lead="WhatsApp is the fastest way to reach the team." />
    <section className="wrap grid gap-8 pb-section md:grid-cols-2">
      <div className="rounded-3xl border border-rule p-6 md:p-8">
        <WhatsAppLink className="btn btn-red w-full sm:w-auto"><IconChat /> Chat on WhatsApp</WhatsAppLink>
        <dl className="mt-6">
          <div className="flex justify-between gap-4 border-b border-rule py-3"><dt className="text-mute">Call</dt><dd className="font-semibold"><a href={`tel:+${c.callNumber}`} className="u40">{c.phoneDisplay}</a></dd></div>
          <div className="flex justify-between gap-4 border-b border-rule py-3"><dt className="text-mute">Instagram</dt><dd className="font-semibold"><a href={c.instagram.url} target="_blank" rel="noopener noreferrer" className="u40 inline-flex items-center gap-2"><IconInstagram className="h-4 w-4" />@{c.instagram.handle}<span className="sr-only"> (opens in a new tab)</span></a></dd></div>
          <div className="flex justify-between gap-4 py-3"><dt className="text-mute">Location</dt><dd className="text-right font-semibold">{a.showOnSite && a.line1 ? `${a.line1}, ${a.city}` : `${a.city}, ${a.country}`}</dd></div>
        </dl>
      </div>
      <div className="rounded-3xl bg-paper p-6 md:p-8"><h2 className="t-display text-[2rem]">Visit the showroom</h2><p className="mt-3 text-mute">Message us on WhatsApp to arrange an inspection or a visit. We&apos;ll share the showroom location with you.</p></div>
    </section></>);
}
