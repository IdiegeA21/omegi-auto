/** Tiny event-based toast. <Toaster/> in the site layout listens for it. An optional action fires a window event. */
export type ToastAction = { label: string; event: string };
export const toast = (message: string, action?: ToastAction) => {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("omegi:toast", { detail: { message, action } }));
};
