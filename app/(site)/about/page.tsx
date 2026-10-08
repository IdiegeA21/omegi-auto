import type { Metadata } from "next";
import { IconCheck } from "@/components/shell/Icons";
import PageHead from "@/components/ui/PageHead";
import { brand } from "@/config/brand";

export const metadata: Metadata = { title: "About" };
export default function About() {
  const r = brand.registration;
  return (<><PageHead eyebrow="About" title={brand.about.lead} narrow={false} />
    <section className="wrap grid gap-10 pb-section lg:grid-cols-12">
      <div className="lg:col-span-7">{brand.about.body.map((p) => <p key={p} className="t-lead">{p}</p>)}
        <p className="mt-6 max-w-[52ch] text-mute">{brand.tagline}. {brand.services.map((s) => s.label).join(", ")}.</p>
        {r.show && <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-rule px-4 py-2.5 text-[14px] font-semibold"><span className="grid h-5 w-5 place-items-center rounded-full bg-omegi text-white"><IconCheck className="h-3 w-3" /></span>{r.statement} · {r.label} {r.number}</p>}</div>
    </section></>);
}
