import { brand } from "@/config/brand";

/** One line per service, using only what the business has said publicly (bio and captions). Shared by the home index and the About page. */
export const serviceLines: Record<string, string> = {
  buy: "Browse the showroom.",
  loan: `Pay ${brand.finance.downPaymentPercent}% and drive. ${brand.finance.termsNote}`,
  preorder: "Tell us the car you want.",
  sell: "Tell us about your car.",
  swap: "Car swap is available. Tell us your car and the one you want.",
  delivery: "Message us for delivery to your city.",
};
