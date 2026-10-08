// Lists which images the site expects and which are still missing. Run: npm run assets:check
import fs from "node:fs";
import path from "node:path";
const root = process.cwd();
const read = (f) => JSON.parse(fs.readFileSync(path.join(root, f), "utf8"));
const has = (p) => fs.existsSync(path.join(root, "public", p.replace(/^\//, "")));
const EXT = ["webp", "avif", "jpg", "jpeg", "png"];
let missing = 0, found = 0;
const line = (ok, label, where) => { ok ? found++ : missing++; console.log(`${ok ? "  ok     " : "  MISSING"}  ${label.padEnd(34)} ${where}`); };

console.log("\nCars (public/cars/<id>/hero.webp, or set media.hero in data/cars.json)");
for (const c of read("data/cars.json")) {
  const viaJson = c.media?.hero && has(c.media.hero);
  const viaFolder = EXT.some((e) => has(`cars/${c.id}/hero.${e}`));
  line(viaJson || viaFolder, `${c.id}${c.status === "sold" ? " (sold)" : ""}`, `public/cars/${c.id}/hero.webp`);
}
console.log("\nInstagram strip (public/instagram/<id>.webp, or set image in data/instagram.json)");
for (const t of read("data/instagram.json")) line((!!t.image && has(t.image)) || EXT.some((e) => has(`instagram/${t.id}.${e}`)), t.id, t.image ?? `public/instagram/${t.id}.webp`);
console.log(`\n${found} in place, ${missing} still showing placeholders. Placeholders are fine for the demo.\n`);
