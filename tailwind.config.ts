import type { Config } from "tailwindcss";
import { brand } from "./config/brand";

// Stage 1 upgrades these to channel-triplet CSS variables so opacity modifiers work.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: { colors: { ...brand.colors } } },
  plugins: [],
};
export default config;
