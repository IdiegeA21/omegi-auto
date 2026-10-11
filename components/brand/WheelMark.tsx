import { WHEEL_H, WHEEL_W } from "./wheel";

/** The wheel alone, one colour (currentColor). The outer viewBox starts at 0,0 because the <symbol> maps its own coordinates into it. */
export function WheelMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox={`0 0 ${WHEEL_W} ${WHEEL_H}`} aria-hidden="true" focusable="false" className={className} fill="currentColor">
      <use href="#wheel-mark" width={WHEEL_W} height={WHEEL_H} />
    </svg>
  );
}
