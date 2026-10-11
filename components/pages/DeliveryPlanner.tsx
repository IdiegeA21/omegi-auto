"use client";
import { useEffect, useRef, useState } from "react";
import { WheelMark } from "@/components/brand/WheelMark";
import { Field, FormShell, SelectField } from "@/components/forms/Fields";
import { useEnquiry } from "@/components/shell/EnquirySheet";
import { brand } from "@/config/brand";
import { carTitle } from "@/lib/carTitle";
import { buildMessage, type EnquiryRequest } from "@/lib/enquiry";
import { collect } from "@/lib/forms";
import { gsap, prefersReducedMotion } from "@/lib/motion/gsap";
import { enquiryChannel } from "@/lib/whatsapp";
import type { PublicCar } from "@/types/car";

/**
 * Lagos to your city. Type a city and the wheel rolls the whole route (its spin is computed from the distance);
 * clear it and the wheel returns. Illustrative only: it shows no distance, time or cost, because none has been supplied.
 */
export default function DeliveryPlanner({ cars }: { cars: PublicCar[] }) {
  const [city, setCity] = useState("");
  const root = useRef<HTMLDivElement>(null);
  const open = useEnquiry()?.open ?? ((r: EnquiryRequest) => { window.open(enquiryChannel(buildMessage(r)).href, "_blank", "noopener"); });
  const named = city.trim().length >= 2;

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const rail = el.querySelector<HTMLElement>(".route__rail")!, wheel = el.querySelector<HTMLElement>(".route__wheel")!;
    const R = wheel.offsetWidth / 2;
    const target = () => (named ? { x: rail.offsetWidth, rotation: (rail.offsetWidth / R) * (180 / Math.PI) } : { x: 0, rotation: 0 });
    if (prefersReducedMotion()) { gsap.set(wheel, target()); return; }
    const t = window.setTimeout(() => gsap.to(wheel, { ...target(), duration: named ? 1.7 : 0.7, ease: "power2.inOut", overwrite: true }), 350);
    return () => { window.clearTimeout(t); };
  }, [named]);

  useEffect(() => () => { if (root.current) gsap.killTweensOf(root.current.querySelector(".route__wheel")); }, []);

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      <div ref={root} className="rounded-3xl border border-rule p-6 md:p-10" aria-label="Delivery route, illustration only" role="group">
        <p className="t-eyebrow">Illustration</p>
        <div className="route mt-8">
          <div className="route__rail"><div className="route__line" /><div className="route__node route__node--a" /><div className="route__node route__node--b" /><div className="route__wheel" aria-hidden="true"><WheelMark className="h-full w-full" /></div></div>
          <div className="route__labels"><span>{brand.address.city}</span><span className={named ? "" : "text-mute"}>{named ? city.trim() : "Your city"}</span></div>
        </div>
        <p className="mt-8 max-w-[44ch] text-[14px] text-mute">This is only a picture of the route. It shows no distance, time or cost. Those are confirmed with you on WhatsApp.</p>
      </div>
      <div>
        <FormShell submit="Message us for delivery" onSubmit={(f) => open({
          kind: "delivery", title: "Delivery to your city", intro: "I'd like delivery to my city.",
          details: collect(f, [["city", "City"], ["car", "Car"]]), chips: ["How does delivery work?"],
        })}>
          <Field label="Your city" name="city" required placeholder="e.g. Abuja" autoComplete="address-level2" value={city} onChange={setCity} />
          <SelectField label="Car (if you have one in mind)" name="car" options={cars.filter((c) => c.status === "available").map((c) => carTitle(c))} />
        </FormShell>
      </div>
    </div>
  );
}
