import { SILHOUETTE_H, SILHOUETTE_W } from "./silhouetteMeta";

/** A car-shaped stand-in drawn from the logo. The outer viewBox starts at 0,0: the <symbol> maps its own coordinates into it. */
export function CarSilhouette({ className = "" }: { className?: string }) {
  return (
    <svg viewBox={`0 0 ${SILHOUETTE_W} ${SILHOUETTE_H}`} className={className} fill="currentColor" aria-hidden="true" focusable="false">
      <use href="#car-silhouette" width={SILHOUETTE_W} height={SILHOUETTE_H} />
    </svg>
  );
}
