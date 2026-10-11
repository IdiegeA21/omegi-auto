import { IconArrow, IconChat } from "@/components/shell/Icons";
import EnquiryButton from "@/components/shell/EnquiryButton";
import { TransitionLink } from "@/components/shell/TransitionLink";
import { carEnquiry } from "@/lib/enquiryRequests";
import type { PublicCar } from "@/types/car";

/** What else you can do with this car. Every line restates something the business has said publicly. */
export default function CrossLinks({ car }: { car: PublicCar }) {
  const inspect = { ...carEnquiry(car), preselect: ["Can I inspect it?"] };
  const card = "group flex h-full flex-col justify-between rounded-3xl border border-rule p-6 transition-colors duration-500 hover:border-tarmac";
  return (
    <section className="border-t border-rule py-section">
      <div className="wrap grid gap-4 md:grid-cols-3">
        {car.status !== "sold" && (
          <EnquiryButton request={inspect} className={card}>
            <div><p className="t-eyebrow">Before you pay</p><h3 className="t-display mt-3 text-[2rem]">Inspect it</h3><p className="mt-2 text-[14px] text-mute">Message us to arrange an inspection.</p></div>
            <span className="mt-6 inline-flex items-center gap-2 text-[14px] font-bold"><IconChat className="h-4 w-4" /> Ask on WhatsApp</span>
          </EnquiryButton>
        )}
        <TransitionLink href="/swap" className={card}>
          <div><p className="t-eyebrow">Have a car already?</p><h3 className="t-display mt-3 text-[2rem]">Swap it</h3><p className="mt-2 text-[14px] text-mute">Car swap is available. Tell us your car and the one you want.</p></div>
          <span className="mt-6 inline-flex items-center gap-2 text-[14px] font-bold">Start a swap <IconArrow className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" /></span>
        </TransitionLink>
        <TransitionLink href="/delivery" className={card}>
          <div><p className="t-eyebrow">Not in Lagos?</p><h3 className="t-display mt-3 text-[2rem]">Get it delivered</h3><p className="mt-2 text-[14px] text-mute">Nationwide delivery. Message us for delivery to your city.</p></div>
          <span className="mt-6 inline-flex items-center gap-2 text-[14px] font-bold">Plan delivery <IconArrow className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" /></span>
        </TransitionLink>
      </div>
    </section>
  );
}
