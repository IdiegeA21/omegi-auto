/** Tiny event-based toast. <Toaster/> in the site layout listens for it. */
export const toast = (message: string) => { if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("omegi:toast", { detail: message })); };
