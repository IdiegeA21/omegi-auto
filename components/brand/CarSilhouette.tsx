import { SILHOUETTE_PATHS, SILHOUETTE_VIEWBOX } from "./silhouette";

/** Rendered once per page (in the site layout). Every placeholder then references it with <use>, so the path data is not repeated per card. */
export function CarSilhouetteDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
      <symbol id="car-silhouette" viewBox={SILHOUETTE_VIEWBOX}>
        {SILHOUETTE_PATHS.map((d, i) => <path key={i} d={d} fillRule="evenodd" />)}
      </symbol>
    </svg>
  );
}

// The <symbol> maps its own viewBox into whatever box <use> gives it, so the outer viewBox starts at 0,0.
const [, , VB_W, VB_H] = SILHOUETTE_VIEWBOX.split(" ").map(Number);

export function CarSilhouette({ className = "" }: { className?: string }) {
  return (
    <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className={className} fill="currentColor" aria-hidden="true" focusable="false">
      <use href="#car-silhouette" width={VB_W} height={VB_H} />
    </svg>
  );
}
