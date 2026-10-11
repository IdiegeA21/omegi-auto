import { WHEEL_PATHS, WHEEL_VIEWBOX } from "./wheel";

/** Rendered once in the root layout. Every wheel on the page then references it with <use>, instead of repeating the path data. */
export default function WheelDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
      <symbol id="wheel-mark" viewBox={WHEEL_VIEWBOX}>{WHEEL_PATHS.map((d, i) => <path key={i} d={d} fillRule="evenodd" />)}</symbol>
    </svg>
  );
}
