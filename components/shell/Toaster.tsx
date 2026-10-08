"use client";
import { useEffect, useState } from "react";

/** Short messages (e.g. "Your shortlist is full"). Announced politely to screen readers. */
export default function Toaster() {
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => {
    let t = 0;
    const h = (e: Event) => { setMsg((e as CustomEvent<string>).detail); window.clearTimeout(t); t = window.setTimeout(() => setMsg(null), 3400); };
    window.addEventListener("omegi:toast", h);
    return () => { window.removeEventListener("omegi:toast", h); window.clearTimeout(t); };
  }, []);
  return (
    <div role="status" aria-live="polite" className="toast-wrap pointer-events-none fixed inset-x-0 z-[60] flex justify-center px-4">
      {msg && <p className="toast pointer-events-auto rounded-full bg-tarmac px-5 py-3 text-[14px] font-semibold text-white shadow-lg">{msg}</p>}
    </div>
  );
}
