import { LogoImage } from "@/components/brand/LogoImage";
import { brand } from "@/config/brand";
import { footerNav } from "@/config/nav";
import { TransitionLink } from "./TransitionLink";
import WhatsAppLink from "./WhatsAppLink";
import { IconArrow, IconCheck, IconChat, IconInstagram } from "./Icons";

const Col = ({ title, items }: { title: string; items: { href: string; label: string }[] }) => (
  <div>
    <h2 className="t-eyebrow">{title}</h2>
    <ul className="mt-3 grid">
      {items.map((i) => (<li key={i.href}><TransitionLink href={i.href} className="u40 inline-flex min-h-[44px] items-center text-[15px] text-white/90">{i.label}</TransitionLink></li>))}
    </ul>
  </div>
);

export default function Footer() {
  const { registration: reg, address, contacts: c, features } = brand;
  return (
    <footer className="on-dark bg-tarmac text-white">
      <div className="wrap pb-10 pt-16 md:pt-24">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-end">
          <h2 className="t-display t-d2">Pay 40%.<br /><span className="text-campaign">Drive.</span></h2>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
            <WhatsAppLink className="btn btn-red"><IconChat /> Chat on WhatsApp</WhatsAppLink>
            <TransitionLink href="/inventory" className="btn btn-line">See the cars <IconArrow /></TransitionLink>
          </div>
        </div>

        <div className="mt-16 grid gap-12 border-t border-kerb pt-12 md:grid-cols-[1.3fr_repeat(3,1fr)]">
          <div>
            <LogoImage tone="dark" height={64} />
            <p className="mt-5 max-w-[30ch] text-[15px] text-mute-dark">{brand.tagline}.</p>
            <ul className="mt-5 grid text-[15px]">
              <li><a href={`tel:+${c.callNumber}`} className="u40 inline-flex min-h-[44px] items-center">{c.phoneDisplay}</a></li>
              <li><a href={c.instagram.url} target="_blank" rel="noopener noreferrer" className="u40 inline-flex min-h-[44px] items-center gap-2"><IconInstagram className="h-[18px] w-[18px]" />@{c.instagram.handle}{features.showFollowerCount && <span className="text-mute-dark"> · {c.instagram.followers} followers</span>}<span className="sr-only"> (opens in a new tab)</span></a></li>
              <li className="text-mute-dark">{address.showOnSite && address.line1 ? `${address.line1}, ${address.city}` : `${address.city}, ${address.country}`}</li>
            </ul>
          </div>
          <Col title="Shop" items={footerNav.shop} />
          <Col title="Ways to deal" items={footerNav.deal} />
          <Col title="Company" items={footerNav.company} />
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-kerb pt-6 text-[13px] text-mute-dark md:flex-row md:items-center md:justify-between">
          {reg.show && (
            <p className="inline-flex w-fit items-center gap-2 rounded-full border border-kerb px-3.5 py-2 text-white/90">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-campaign text-tarmac"><IconCheck className="h-3 w-3" /></span>
              {reg.statement} · {reg.label} {reg.number}
            </p>
          )}
          <p>{brand.conceptLabel}</p>
        </div>
      </div>
    </footer>
  );
}
