import { WheelMark } from "@/components/brand/WheelMark";

/** A slow ticker of words separated by the wheel. Decorative (the same words appear elsewhere), so it is hidden from screen readers. Pauses on hover; static under reduced motion. */
export default function Marquee({ items, className = "" }: { items: string[]; className?: string }) {
  const row = () => (
    <ul className="mq__row">
      {items.map((t, i) => <li key={i} className="mq__item"><span>{t}</span><WheelMark className="mq__dot" /></li>)}
    </ul>
  );
  return <div className={`mq ${className}`} aria-hidden="true"><div className="mq__track">{row()}{row()}</div></div>;
}
