"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { gsap, prefersReducedMotion } from "@/lib/motion/gsap";
import { lockScroll, unlockScroll } from "@/lib/motion/scroll";
import { ease } from "@/lib/tokens";
import { buildMessage, type EnquiryRequest } from "@/lib/enquiry";
import { enquiryChannel } from "@/lib/whatsapp";
import { IconChat, IconClose } from "./Icons";
import { useIsolateScroll } from "./useIsolateScroll";

const Ctx = createContext<{ open: (r: EnquiryRequest) => void } | null>(null);
/** null when rendered outside the provider; callers fall back to a plain WhatsApp link. */
export const useEnquiry = () => useContext(Ctx);

/**
 * The one enquiry sheet, used by every car, form and finance action. It collects only what the team needs
 * (an optional name, one-tap questions, an optional note), shows exactly what will be sent, and opens WhatsApp
 * on the single number set in config. Nothing is sent until the customer presses send inside WhatsApp.
 */
export function EnquiryProvider({ children }: { children: ReactNode }) {
  const [req, setReq] = useState<EnquiryRequest | null>(null);
  const [isOpen, setOpen] = useState(false);
  const [chips, setChips] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [name, setName] = useState("");
  const dlg = useRef<HTMLDialogElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const scrim = useRef<HTMLDivElement>(null);
  useIsolateScroll(dlg);

  const open = useCallback((r: EnquiryRequest) => { setReq(r); setChips(r.preselect ?? []); setNote(""); setOpen(true); }, []);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const d = dlg.current;
    if (!d) return;
    const onCancel = (e: Event) => { e.preventDefault(); setOpen(false); };
    const onClose = () => setOpen(false);
    d.addEventListener("cancel", onCancel); d.addEventListener("close", onClose);
    return () => { d.removeEventListener("cancel", onCancel); d.removeEventListener("close", onClose); };
  }, []);

  useEffect(() => {
    const d = dlg.current, p = panel.current, s = scrim.current;
    if (!d || !p || !s) return;
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const off = mobile ? { yPercent: 100, opacity: 1 } : { y: 28, scale: 0.97, opacity: 0 };
    const on = { yPercent: 0, y: 0, scale: 1, opacity: 1 };
    gsap.killTweensOf([p, s]);
    if (isOpen && req) {
      if (!d.open) d.showModal();
      window.dispatchEvent(new Event("omegi:toplayer"));
      lockScroll();
      if (!prefersReducedMotion()) {
        gsap.fromTo(s, { opacity: 0 }, { opacity: 1, duration: 0.35 });
        gsap.fromTo(p, off, { ...on, duration: 0.6, ease: ease.out });
      }
      return () => { unlockScroll(); };
    }
    if (d.open) {
      if (prefersReducedMotion()) { d.close(); return; }
      gsap.to(s, { opacity: 0, duration: 0.3 });
      gsap.to(p, { ...off, duration: 0.35, ease: ease.inOut, onComplete: () => d.close() });
    }
  }, [isOpen, req]);

  const message = useMemo(() => (req ? buildMessage(req, { chips, note, name }) : ""), [req, chips, note, name]);
  const { href } = enquiryChannel(message);
  const toggle = (c: string) => setChips((p) => (p.includes(c) ? p.filter((x) => x !== c) : [...p, c]));

  return (
    <Ctx.Provider value={{ open }}>
      {children}
      <dialog ref={dlg} data-lenis-prevent aria-label="Message us on WhatsApp" aria-labelledby={req ? "enq-title" : undefined} className="fixed inset-0 m-0 h-full max-h-none w-full max-w-none overflow-hidden border-0 bg-transparent p-0 backdrop:bg-transparent">
        <div ref={scrim} className="absolute inset-0 bg-tarmac/60" onClick={close} />
        <div className="pointer-events-none relative flex h-full items-end justify-center md:items-center md:p-6">
          <div ref={panel} data-lenis-prevent className="pointer-events-auto max-h-[94dvh] w-full overflow-y-auto overscroll-contain rounded-t-[1.75rem] bg-showroom md:max-w-[560px] md:rounded-[1.75rem]">
            {req && (
              <div className="p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] md:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="t-eyebrow">Message us on WhatsApp</p>
                    <h2 id="enq-title" className="t-display mt-2 text-[2rem] md:text-[2.4rem]">{req.title}</h2>
                  </div>
                  <button type="button" onClick={close} aria-label="Close" className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-rule hover:bg-paper"><IconClose /></button>
                </div>

                <p className="mt-4 text-[15px]">{req.intro}</p>
                {req.details && req.details.length > 0 && (
                  <dl className="mt-3 rounded-2xl bg-paper px-4 py-1">
                    {req.details.map((d) => (
                      <div key={d.label} className="flex items-baseline justify-between gap-4 border-b border-rule py-2.5 last:border-0"><dt className="text-[13px] text-mute">{d.label}</dt><dd className="text-right text-[14px] font-semibold">{d.value}</dd></div>
                    ))}
                  </dl>
                )}
                {req.reassurance && <p className="mt-3 text-[13px] text-mute">{req.reassurance}</p>}

                {req.chips && req.chips.length > 0 && (
                  <fieldset className="mt-6">
                    <legend className="t-eyebrow mb-2.5">Quick questions</legend>
                    <div className="flex flex-wrap gap-2">
                      {req.chips.map((c) => (
                        <button key={c} type="button" aria-pressed={chips.includes(c)} onClick={() => toggle(c)}
                          className={`min-h-[44px] rounded-full border px-4 text-[14px] font-semibold transition-colors duration-300 ${chips.includes(c) ? "border-tarmac bg-tarmac text-white" : "border-rule hover:border-tarmac"}`}>{c}</button>
                      ))}
                    </div>
                  </fieldset>
                )}

                <div className="mt-6 grid gap-3">
                  <label className="block"><span className="mb-1.5 block text-[13px] font-semibold">Your name <span className="font-normal text-mute">(optional)</span></span>
                    <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className="h-[52px] w-full rounded-2xl border border-rule px-4 text-[16px] outline-none focus:border-tarmac" /></label>
                  <label className="block"><span className="mb-1.5 block text-[13px] font-semibold">Anything else? <span className="font-normal text-mute">(optional)</span></span>
                    <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder={req.notePlaceholder ?? "Add a note"} className="w-full resize-none rounded-2xl border border-rule px-4 py-3 text-[16px] outline-none placeholder:text-mute focus:border-tarmac" /></label>
                </div>

                <details className="mt-5 rounded-2xl border border-rule px-4 py-3 text-[14px]">
                  <summary className="cursor-pointer font-semibold">Preview your message</summary>
                  <pre className="mt-3 whitespace-pre-wrap break-words font-sans text-[13px] text-mute">{message}</pre>
                </details>

                <a href={href} target="_blank" rel="noopener noreferrer" onClick={() => window.setTimeout(close, 200)} className="btn btn-red mt-6 w-full">
                  <IconChat /> Continue on WhatsApp<span className="sr-only"> (opens in a new tab)</span>
                </a>
                <p className="mt-3 text-center text-[12px] text-mute">WhatsApp opens with this message ready. Nothing is sent until you press send there.</p>
              </div>
            )}
          </div>
        </div>
      </dialog>
    </Ctx.Provider>
  );
}
