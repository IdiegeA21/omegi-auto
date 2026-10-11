import { IconArrow } from "@/components/shell/Icons";
import { TransitionLink } from "@/components/shell/TransitionLink";
import Reveal from "@/components/ui/Reveal";
import Rise from "@/components/ui/Rise";
import { brand } from "@/config/brand";
import { serviceLines as lines } from "@/config/serviceLines";

export default function ServicesIndex() {
  return (
    <section className="py-section">
      <div className="wrap">
        <p className="t-eyebrow">Six ways to deal</p>
        <Reveal as="h2" text="Buy, loan, pre-order, sell, swap, deliver." className="t-display t-d2 mt-3 max-w-[16ch]" />
        <Rise className="mt-10 border-t border-rule">
          {brand.services.map((s, k) => (
            <div key={s.id} data-rise>
              <TransitionLink href={s.href} className="group grid grid-cols-[2.5rem_1fr_auto] items-center gap-x-4 gap-y-1 border-b border-rule py-5 md:grid-cols-[4rem_minmax(0,1.1fr)_1.4fr_auto] md:py-7">
                <span className="t-fig text-[1.1rem] text-mute">{String(k + 1).padStart(2, "0")}</span>
                <span className="t-display text-[2rem] transition-colors duration-300 group-hover:text-omegi md:text-[3rem]">{s.label}</span>
                <span className="col-start-2 text-[14px] text-mute md:col-start-auto md:text-[15px]">{lines[s.id]}</span>
                <span className="row-span-2 grid h-11 w-11 place-items-center rounded-full border border-rule transition-all duration-500 group-hover:translate-x-1 group-hover:border-omegi group-hover:bg-omegi group-hover:text-white md:row-span-1"><IconArrow /></span>
              </TransitionLink>
            </div>
          ))}
        </Rise>
      </div>
    </section>
  );
}
