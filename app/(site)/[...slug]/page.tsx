import { notFound } from "next/navigation";
import Reveal from "@/components/ui/Reveal";
import { TransitionLink } from "@/components/shell/Transition";
import { knownRoutes, menuGroups, footerNav } from "@/config/nav";

/** Stage scaffolding: routes the shell links to that are built in later stages. Removed once each real page exists. */
export default async function Placeholder({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const href = "/" + slug.join("/");
  if (!knownRoutes.has(href)) notFound();
  const all = [...menuGroups.flatMap((g) => g.items), ...Object.values(footerNav).flat()];
  const label = all.find((i) => i.href === href)?.label ?? "Page";
  return (
    <section className="wrap py-24 md:py-36">
      <p className="t-eyebrow">Built in a later stage</p>
      <Reveal as="h1" text={label} className="t-display t-d1 mt-4" />
      <TransitionLink href="/" className="btn btn-line mt-10">Back to home</TransitionLink>
    </section>
  );
}
