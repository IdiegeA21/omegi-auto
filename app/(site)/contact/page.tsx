import type { Metadata } from "next";
import { IconArrow, IconChat, IconInstagram } from "@/components/shell/Icons";
import WhatsAppLink from "@/components/shell/WhatsAppLink";
import PageHead from "@/components/ui/PageHead";
import { brand } from "@/config/brand";

export const metadata: Metadata = { title: "Contact" };

export default function Contact() {
  const c = brand.contacts, a = brand.address;
  const card = "group flex min-h-[15rem] flex-col justify-between rounded-3xl border p-6 transition-colors duration-500 md:p-8";
  return (
    <>
      <PageHead art="wheel" eyebrow="Contact" title="Talk to us" lead="WhatsApp is the fastest way to reach the team." />
      <section className="wrap grid gap-4 pb-section md:grid-cols-3">
        <WhatsAppLink className={`${card} on-dark border-omegi bg-omegi text-white hover:bg-tarmac`}>
          <IconChat className="h-9 w-9" /><div><p className="t-display text-[2.4rem]">WhatsApp</p><p className="mt-1 text-[15px] text-white/80">{c.phoneDisplay}</p><span className="mt-4 inline-flex items-center gap-2 text-[14px] font-bold">Start a chat <IconArrow className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" /></span></div>
        </WhatsAppLink>
        <a href={`tel:+${c.callNumber}`} className={`${card} border-rule hover:border-tarmac`}>
          <span className="t-fig text-[3rem] text-omegi">☎</span><div><p className="t-display text-[2.4rem]">Call</p><p className="mt-1 text-[15px] text-mute">{c.phoneDisplay}</p></div>
        </a>
        <a href={c.instagram.url} target="_blank" rel="noopener noreferrer" className={`${card} border-rule hover:border-tarmac`}>
          <IconInstagram className="h-9 w-9 text-omegi" /><div><p className="t-display text-[2.4rem]">Instagram</p><p className="mt-1 text-[15px] text-mute">@{c.instagram.handle}</p><span className="sr-only"> (opens in a new tab)</span></div>
        </a>
      </section>
      <section className="border-t border-rule bg-paper py-section">
        <div className="wrap grid gap-8 md:grid-cols-2">
          <div><p className="t-eyebrow">Showroom</p><h2 className="t-display t-d2 mt-3">Visit us in {a.city}.</h2></div>
          <div><p className="t-lead text-mute">{a.showOnSite && a.line1 ? `${a.line1}, ${a.city}. ` : ""}Message us on WhatsApp to arrange an inspection or a visit. We&apos;ll share the showroom location with you.</p></div>
        </div>
      </section>
    </>
  );
}
