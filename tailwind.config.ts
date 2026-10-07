import type { Config } from "tailwindcss";

const rgb = (name: string) => `rgb(var(--c-${name}) / <alpha-value>)`;

// Colour values live in config/brand.ts and reach CSS through lib/theme.ts.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        tarmac: rgb("tarmac"), pit: rgb("pit"), kerb: rgb("kerb"),
        showroom: rgb("showroom"), paper: rgb("paper"), rule: rgb("rule"),
        omegi: rgb("omegi"), campaign: rgb("campaign"),
        mute: rgb("mute"), "mute-dark": rgb("mute-dark"), ok: rgb("ok"),
      },
      fontFamily: { sans: ["var(--font-archivo)", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"] },
      transitionTimingFunction: { out: "cubic-bezier(.16,1,.3,1)", inout: "cubic-bezier(.76,0,.24,1)", soft: "cubic-bezier(.33,1,.68,1)" },
      spacing: { gutter: "var(--gutter)", section: "var(--section)", header: "var(--header-h)", dock: "var(--dock-h)" },
    },
  },
  plugins: [],
};
export default config;
