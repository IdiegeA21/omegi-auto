/**
 * The "stage is lit" gate. Closed while the preloader or a page wipe covers the screen,
 * opens as the curtain lifts. Entrance animations wait on it so they play where the user can see them.
 */
let open = false;
const queue = new Set<() => void>();

export const gate = {
  isOpen: () => open,
  open() { open = true; if (typeof document !== "undefined") document.documentElement.classList.add("stage-lit"); const fns = [...queue]; queue.clear(); fns.forEach((f) => f()); },
  close() { open = false; },
  /** Runs cb when the gate is open (immediately if already open). Returns a cancel fn for cleanup. */
  whenOpen(cb: () => void) {
    if (open) { cb(); return () => {}; }
    queue.add(cb);
    return () => { queue.delete(cb); };
  },
};
