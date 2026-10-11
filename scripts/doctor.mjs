// Removes files left behind by earlier stages. Extracting a newer tarball over an older folder ADDS and OVERWRITES
// files but never deletes them, so a stale placeholder can keep answering a route (for example an old app/page.tsx
// that renders only the brand name). Runs automatically before `npm run dev` and `npm run build`.
// Only the exact files below are touched, and every removal is printed.
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const at = (p) => path.join(root, p);
const exists = (p) => fs.existsSync(at(p));
const removed = [];
const rm = (p, why) => { if (exists(p)) { fs.rmSync(at(p), { recursive: true, force: true }); removed.push(`${p}  (${why})`); } };

// The real home lives in app/(site)/page.tsx. A second app/page.tsx either conflicts with it or hides it.
if (exists("app/(site)/page.tsx") && exists("app/page.tsx")) {
  const src = fs.readFileSync(at("app/page.tsx"), "utf8");
  if (src.length < 600) rm("app/page.tsx", "old placeholder that rendered only the brand name");
  else console.warn("doctor: app/page.tsx exists next to app/(site)/page.tsx. Two pages cannot both answer '/'. Delete one.");
}
rm("app/(site)/[...slug]", "old 'built in a later stage' placeholder");
rm("components/shell/ContactModal.tsx", "replaced by EnquirySheet");
rm("components/ui/EnquiryAction.tsx", "replaced by EnquiryButton");
rm("components/ui/Placeholder.tsx", "replaced by the car placeholder in CarMedia");
rm("components/ui/SmartImage.tsx", "replaced by CarMedia");
rm("components/ui/ReplayIntro.tsx", "review helper, no longer used");
rm("lib/format.ts", "no longer used");
rm("lib/motion/sticky.ts", "no longer used");
if (exists("docs/source/omegi-logo-source.jpg")) rm("public/brand/omegi-logo-source.jpg", "moved to docs/source");

if (removed.length) {
  rm(".next", "build cache may still contain the old routes");
  console.log("\ndoctor: removed leftovers from earlier stages:\n" + removed.map((r) => "  - " + r).join("\n") + "\n");
}
