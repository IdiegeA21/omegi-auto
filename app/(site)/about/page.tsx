import type { Metadata } from "next";
import { IconCheck, IconInstagram } from "@/components/shell/Icons";
import { TransitionLink } from "@/components/shell/TransitionLink";
import PageHead from "@/components/ui/PageHead";
import Rise from "@/components/ui/Rise";
import { brand } from "@/config/brand";
import { serviceLines } from "@/config/serviceLines";

export const metadata: Metadata = { title: "About" };

export default function About() {
  const r = brand.registration, ig = brand.contacts.instagram;
  return (
    <>
      <PageHead art="silhouette" eyebrow="About" title={brand.about.lead} narrow={false} />
      <section className="wrap pb-section">
        <div className="max-w-[40rem]">{brand.about.body.map((p) => <p key={p} className="t-lead">{p}</p>)}<p className="mt-6 text-mute">{brand.tagline}.</p></div>
        <h2 className="sr-only">What we do</h2>
        <Rise className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {brand.services.map((s, i) => (
            <div key={s.id} data-rise><TransitionLink href={s.href} className="group flex h-full flex-col justify-between rounded-3xl border border-rule p-6 transition-colors duration-500 hover:border-tarmac">
              <p className="t-fig text-[2.4rem] text-omegi">{String(i + 1).padStart(2, "0")}</p>
              <div className="mt-10"><h3 className="t-display text-[2rem]">{s.label}</h3><p className="mt-2 text-[14px] text-mute">{serviceLines[s.id]}</p></div>
            </TransitionLink></div>
          ))}
        </Rise>
      </section>
      <section className="on-dark bg-tarmac py-section text-white">
        <div className="wrap grid gap-10 md:grid-cols-3">
          <div><p className="t-eyebrow">Based in</p><p className="t-display mt-3 text-[3.4rem]">{brand.address.city}</p><p className="text-mute-dark">{brand.address.country}</p></div>
          {r.show && <div><p className="t-eyebrow">Registered</p><p className="mt-3 flex items-center gap-3 font-bold"><span className="grid h-7 w-7 place-items-center rounded-full bg-campaign text-tarmac"><IconCheck className="h-4 w-4" /></span>{r.statement}</p><p className="t-fig mt-2 text-[3rem]">{r.label} {r.number}</p></div>}
          <div><p className="t-eyebrow">Follow</p><a href={ig.url} target="_blank" rel="noopener noreferrer" className="u40 mt-3 inline-flex items-center gap-2 text-[1.5rem] font-bold"><IconInstagram />@{ig.handle}<span className="sr-only"> (opens in a new tab)</span></a>{brand.features.showFollowerCount && <p className="text-mute-dark">{ig.followers} followers</p>}</div>
        </div>
      </section>
    </>
  );
}
