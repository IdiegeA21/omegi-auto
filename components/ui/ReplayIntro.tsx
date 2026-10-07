"use client";
/** Review helper: clears the "seen" flag and reloads so the intro plays again. Removed before handoff. */
export default function ReplayIntro() {
  return (
    <button type="button" className="btn btn-line" onClick={() => { try { sessionStorage.removeItem("omegi-seen"); } catch {} window.location.reload(); }}>
      Replay intro
    </button>
  );
}
