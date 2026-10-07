"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { gsap, prefersReducedMotion } from "@/lib/motion/gsap";
import { lockScroll, unlockScroll } from "@/lib/motion/scroll";
import { ease, site } from "@/lib/tokens";

type Payload = { text: string; heading?: string };
const Ctx = createContext<(p: Payload) => void>(() => {});
export const useContact = () => useContext(Ctx);

/**
 * "How would you like to reach us?" Every Enquire button and form opens this instead of sending the
 * visitor away. Built on native <dialog>: it sits in the browser's top layer (no stacking or transform
 * surprises), scrolls internally, is a bottom sheet on phones, and traps focus for us.
 */
export function ContactProvider({ children }: { children: ReactNode }) {
  const [payload, setPayload] = useState<Payload | null>(null);
  const open = useCallback((p: Payload) => setPayload(p), []);
  return (
    <Ctx.Provider value={open}>
      {children}
      {payload && <Sheet key={payload.text} payload={payload} onClose={() => setPayload(null)} />}
    </Ctx.Provider>
  );
}

const WaIcon = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M3.5 20.5 5 16A8.5 8.5 0 1 1 8 19l-4.5 1.5Z" /><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8c-.8-.4-1.600-1.200-2-2l.8-1-1-2L9 9.500Z" /></svg>);
const IgIcon = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r=".8" fill="currentColor" /></svg>);

function Sheet({ payload, onClose }: { payload: Payload; onClose: () => void }) {
  const dlg = useRef<HTMLDialogElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const [text, setText] = useState(payload.text);
  const [editing, setEditing] = useState(false);
  const [note, setNote] = useState("");
  const hasWhatsApp = !!site.whatsapp;

  useEffect(() => {
    const d = dlg.current!;
    const opener = document.activeElement as HTMLElement | null;
    if (!d.open) d.showModal();
    window.dispatchEvent(new Event("omegi:toplayer")); // lift the custom cursor above the dialog
    lockScroll();
    if (!prefersReducedMotion()) gsap.fromTo(panel.current, { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: ease.out });
    return () => { unlockScroll(); if (d.open) d.close(); opener?.focus?.({ preventScroll: true }); };
  }, []);

  const whatsapp = () => {
    window.open(`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
    onClose();
  };
  const instagram = async () => {
    let copied = false;
    try { await navigator.clipboard.writeText(text); copied = true; } catch {}
    window.open(site.igDm, "_blank", "noopener,noreferrer");
    setNote(copied ? "Message copied. Paste it into the chat that just opened." : "Instagram opened. Copy your message from here and paste it into the chat.");
  };

  return (
    <dialog ref={dlg} className="sheet" aria-labelledby="contact-h"
      onCancel={(e) => { e.preventDefault(); onClose(); }}
      onClick={(e) => { if (e.target === dlg.current) onClose(); }}>
      <div ref={panel} className="sheet-panel tile-bg shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="contact-h" className="font-display text-[clamp(1.6rem,6vw,2.3rem)] leading-[1.05]">{payload.heading ?? "How would you like to reach us?"}</h2>
            <p className="mt-2 text-sm text-onLightMuted">Pick a channel. Your message is ready to go.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/80 text-2xl leading-none transition-transform duration-300 active:scale-90">×</button>
        </div>

        <div className="mt-5 grid gap-3">
          {hasWhatsApp ? (
            <button type="button" className="chan btn-red btn" onClick={whatsapp}>
              <span className="chan__ico"><WaIcon /></span>
              <span className="flex-1"><span className="block text-base font-medium">WhatsApp</span><span className="block text-sm opacity-80">Opens WhatsApp with your message</span></span>
              <span aria-hidden="true">↗</span>
            </button>
          ) : (
            <div className="chan border border-ink-900/10 bg-white/50" aria-disabled="true">
              <span className="chan__ico bg-ink-900/10 text-ink-900"><WaIcon /></span>
              <span className="flex-1"><span className="block text-base font-medium">WhatsApp</span><span className="block text-sm text-onLightMuted">Coming soon</span></span>
            </div>
          )}
          <button type="button" className={`chan btn ${hasWhatsApp ? "btn-ink" : "btn-red"}`} onClick={instagram}>
            <span className="chan__ico"><IgIcon /></span>
            <span className="flex-1"><span className="block text-base font-medium">Instagram</span><span className="block text-sm opacity-80">Copies your message, then opens the chat</span></span>
            <span aria-hidden="true">↗</span>
          </button>
        </div>
        <p role="status" aria-live="polite" className={`text-sm text-onLightMuted ${note ? "mt-3" : ""}`}>{note}</p>

        <div className="mt-4 rounded-2xl bg-white/70 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium" id="msg-label">Your message</p>
            <button type="button" className="min-h-[44px] px-1 text-sm text-red-600 underline underline-offset-4" onClick={() => setEditing((v) => !v)} aria-expanded={editing}>{editing ? "Done" : "Edit"}</button>
          </div>
          {editing
            ? <textarea aria-labelledby="msg-label" value={text} onChange={(e) => setText(e.target.value)} rows={5} className="input mt-2 resize-y" autoFocus />
            : <p className="mt-1 line-clamp-4 whitespace-pre-line text-sm text-onLightMuted">{text}</p>}
        </div>
      </div>
    </dialog>
  );
}
