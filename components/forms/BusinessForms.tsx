"use client";
import { Field, FormShell, SelectField, TextArea } from "@/components/forms/Fields";
import { useEnquiry } from "@/components/shell/EnquirySheet";
import { carTitle } from "@/lib/carTitle";
import { collect } from "@/lib/forms";
import type { PublicCar } from "@/types/car";

const CONDITIONS = ["Foreign used", "Nigerian used", "Not sure"];
const carOptions = (cars: PublicCar[]) => cars.filter((c) => c.status === "available").map((c) => carTitle(c));

/** Swap: customer's current car and the car they want. No valuation, no price promise. */
export function SwapForm({ cars }: { cars: PublicCar[] }) {
  const { open } = useEnquiry();
  return (
    <FormShell submit="Review and send" onSubmit={(f) => open({
      kind: "swap", title: "Swap request", intro: "I'd like to swap my car.",
      details: collect(f, [["make", "My car, make"], ["model", "My car, model"], ["year", "Year"], ["mileage", "Mileage"], ["condition", "Condition"], ["want", "Car I want"], ["notes", "Notes"]]),
      chips: ["How does the swap work?", "Is the car I want available?"], reassurance: "We don't give a valuation here. Your details go to our team on WhatsApp.",
    })}>
      <p className="t-eyebrow">Your current car</p>
      <div className="grid gap-4 sm:grid-cols-2"><Field label="Make" name="make" required placeholder="e.g. Toyota" /><Field label="Model" name="model" required placeholder="e.g. Camry" /></div>
      <div className="grid gap-4 sm:grid-cols-3"><Field label="Year" name="year" inputMode="numeric" placeholder="e.g. 2018" /><Field label="Mileage" name="mileage" placeholder="e.g. 80,000 km" /><SelectField label="Condition" name="condition" options={CONDITIONS} /></div>
      <p className="t-eyebrow mt-2">The car you want</p>
      <SelectField label="Car you want" name="want" required options={[...carOptions(cars), "Another car (tell us below)"]} />
      <TextArea label="Notes" name="notes" placeholder="Anything we should know about your car" />
    </FormShell>
  );
}

/** Sell: tell us about the car. No valuation, no price promise. */
export function SellForm() {
  const { open } = useEnquiry();
  return (
    <FormShell submit="Review and send" onSubmit={(f) => open({
      kind: "sell", title: "Sell my car", intro: "I'd like to sell my car.",
      details: collect(f, [["make", "Make"], ["model", "Model"], ["year", "Year"], ["mileage", "Mileage"], ["condition", "Condition"], ["city", "City"], ["asking", "Asking price"], ["notes", "Notes"]]),
      chips: ["What do you need from me?"], reassurance: "We don't give a valuation here. Your details go to our team on WhatsApp.",
    })}>
      <div className="grid gap-4 sm:grid-cols-2"><Field label="Make" name="make" required placeholder="e.g. Lexus" /><Field label="Model" name="model" required placeholder="e.g. RX350" /></div>
      <div className="grid gap-4 sm:grid-cols-3"><Field label="Year" name="year" inputMode="numeric" /><Field label="Mileage" name="mileage" placeholder="e.g. 60,000 km" /><SelectField label="Condition" name="condition" options={CONDITIONS} /></div>
      <div className="grid gap-4 sm:grid-cols-2"><Field label="City" name="city" autoComplete="address-level2" /><Field label="Your asking price" name="asking" placeholder="e.g. ₦25m" /></div>
      <TextArea label="Notes" name="notes" placeholder="Condition, service history, anything else" />
    </FormShell>
  );
}

/** Pre-order: request a car that is not in stock. */
export function PreOrderForm() {
  const { open } = useEnquiry();
  return (
    <FormShell submit="Review and send" onSubmit={(f) => open({
      kind: "preorder", title: "Pre-order request", intro: "I'd like to request a car.",
      details: collect(f, [["car", "Car wanted"], ["years", "Year range"], ["prefs", "Colour and options"], ["budget", "Budget"]]),
      chips: ["How does pre-order work?"], reassurance: "This is a request, not an order. Your details go to our team on WhatsApp.",
    })}>
      <Field label="Car you want" name="car" required placeholder="e.g. Range Rover Sport" />
      <div className="grid gap-4 sm:grid-cols-2"><Field label="Year range" name="years" placeholder="e.g. 2022 to 2024" /><Field label="Budget" name="budget" placeholder="e.g. ₦90m" /></div>
      <TextArea label="Colour and options" name="prefs" placeholder="Colour, interior, must-have options" />
    </FormShell>
  );
}

/** Delivery: where should it go? */
export function DeliveryForm({ cars }: { cars: PublicCar[] }) {
  const { open } = useEnquiry();
  return (
    <FormShell submit="Message us for delivery" onSubmit={(f) => open({
      kind: "delivery", title: "Delivery to your city", intro: "I'd like delivery to my city.",
      details: collect(f, [["city", "City"], ["car", "Car"]]), chips: ["How does delivery work?"],
    })}>
      <Field label="Your city" name="city" required placeholder="e.g. Port Harcourt" autoComplete="address-level2" />
      <SelectField label="Car (if you have one in mind)" name="car" options={carOptions(cars)} />
    </FormShell>
  );
}
