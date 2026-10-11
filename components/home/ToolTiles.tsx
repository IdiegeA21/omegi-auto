import { IconArrow, IconHeart } from "@/components/shell/Icons";
import { TransitionLink } from "@/components/shell/TransitionLink";
import Reveal from "@/components/ui/Reveal";
import Rise from "@/components/ui/Rise";
import { brand } from "@/config/brand";

const tiles = [
  { href: "/finder", big: "3", unit: "questions", title: "Car Finder", text: "Tell us what you can put down, the kind of car and the brand. We show what fits.", dark: false },
  { href: "/finance", big: `${brand.finance.downPaymentPercent}%`, unit: "and the balance", title: "Finance estimator", text: "Pick a car or enter a price and see your down payment and what is left.", dark: true },
  { href: "/shortlist", big: "", unit: "compare up to three", title: "Shortlist", text: "Save the cars you like and put them side by side before you decide.", dark: false, heart: true },
  { href: "/swap", big: "⇄", unit: "your car for theirs", title: "Swap", text: "Car swap is available. Tell us your car and the one you want.", dark: false },
] as const;

/** The site's own tools, each with a big visual cue. Real features only. */
export default function ToolTiles() {
  return (
    <section className="border-t border-rule py-section">
      <div className="wrap">
        <p className="t-eyebrow">Make it easier</p>
        <Reveal as="h2" text="Four ways to decide faster." className="t-display t-d2 mt-3 max-w-[14ch]" />
        <Rise className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tiles.map((t) => (
            <div key={t.href} data-rise>
              <TransitionLink href={t.href} className={`group relative flex h-full min-h-[22rem] flex-col justify-between overflow-hidden rounded-3xl border p-6 transition-colors duration-500 ${t.dark ? "on-dark border-tarmac bg-tarmac text-white" : "border-rule bg-showroom hover:border-tarmac"}`}>
                <div>
                  <p className={`t-fig text-[6.5rem] leading-none transition-transform duration-700 group-hover:-translate-y-1 ${t.dark ? "text-campaign" : "text-omegi"}`}>{"heart" in t && t.heart ? <IconHeart className="h-[6rem] w-[6rem]" filled /> : t.big}</p>
                  <p className={`mt-2 text-[13px] font-semibold ${t.dark ? "text-mute-dark" : "text-mute"}`}>{t.unit}</p>
                </div>
                <div>
                  <h3 className="t-display text-[2rem]">{t.title}</h3>
                  <p className={`mt-2 text-[14px] ${t.dark ? "text-mute-dark" : "text-mute"}`}>{t.text}</p>
                  <span className={`mt-5 grid h-11 w-11 place-items-center rounded-full border transition-all duration-500 group-hover:translate-x-1 ${t.dark ? "border-kerb group-hover:bg-white group-hover:text-tarmac" : "border-rule group-hover:border-omegi group-hover:bg-omegi group-hover:text-white"}`}><IconArrow /></span>
                </div>
              </TransitionLink>
            </div>
          ))}
        </Rise>
      </div>
    </section>
  );
}
