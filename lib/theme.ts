import { brand } from "@/config/brand";

const toTriplet = (hex: string) => {
  const h = hex.replace("#", "");
  return `${parseInt(h.slice(0, 2), 16)} ${parseInt(h.slice(2, 4), 16)} ${parseInt(h.slice(4, 6), 16)}`;
};

/** CSS custom properties generated from config/brand.ts. Single source of truth for colour and type. */
export function themeCss() {
  const c = brand.colors;
  const f = brand.fonts;
  const vars: Record<string, string> = {
    "--c-tarmac": toTriplet(c.tarmac),
    "--c-pit": toTriplet(c.pit),
    "--c-kerb": toTriplet(c.kerb),
    "--c-showroom": toTriplet(c.showroom),
    "--c-paper": toTriplet(c.paper),
    "--c-rule": toTriplet(c.rule),
    "--c-omegi": toTriplet(c.omegiRed),
    "--c-campaign": toTriplet(c.campaignRed),
    "--c-mute": toTriplet(c.onLightMuted),
    "--c-mute-dark": toTriplet(c.onDarkMuted),
    "--c-ok": toTriplet(c.available),
    "--w-display": String(f.display.wdth),
    "--w-figure": String(f.figure.wdth),
  };
  return `:root{${Object.entries(vars).map(([k, v]) => `${k}:${v}`).join(";")}}`;
}
