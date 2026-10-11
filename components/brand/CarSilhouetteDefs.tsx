import { SILHOUETTE_PATHS } from "./silhouette";
import { SILHOUETTE_VIEWBOX } from "./silhouetteMeta";

/** SERVER ONLY. Rendered once per page in the site layout; every placeholder then references it with <use>. */
export function CarSilhouetteDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
      <symbol id="car-silhouette" viewBox={SILHOUETTE_VIEWBOX}>{SILHOUETTE_PATHS.map((d, i) => <path key={i} d={d} fillRule="evenodd" />)}</symbol>
    </svg>
  );
}
