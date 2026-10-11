"use client";
import { useEffect, useState } from "react";
import type { ToastAction } from "@/lib/toast";

/** Short messages (e.g. "Saved to your shortlist"), with an optional action button. Announced politely to screen readers. */
export default function Toaster() {
  const [t, setT] = useState<{ message: string; action?: ToastAction } | null>(null);
  useEffect(() => {
    let timer = 0;
    const h = (e: Event) => { setT((e as CustomEvent<{ message: string; action?: ToastAction }>).detail); window.clearTimeout(timer); timer = window.setTimeout(() => setT(null), 4200); };
    window.addEventListener("omegi:toast", h);
    return () => { window.removeEventListener("omegi:toast", h); window.clearTimeout(timer); };
  }, []);
  return (
    <div role="status" aria-live="polite" className="toast-wrap pointer-events-none fixed inset-x-0 z-[60] flex justify-center px-4">
      {t && (
        <p className="toast pointer-events-auto flex items-center gap-4 rounded-full bg-tarmac py-2.5 pl-5 pr-2.5 text-[14px] font-semibold text-white shadow-lg">
          <span>{t.message}</span>
          {t.action && <button type="button" onClick={() => { window.dispatchEvent(new Event(t.action!.event)); setT(null); }} className="rounded-full bg-white px-4 py-2 text-[13px] font-bold text-tarmac hover:bg-paper">{t.action.label}</button>}
        </p>
      )}
    </div>
  );
}
