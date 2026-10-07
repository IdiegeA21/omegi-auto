import Reveal from "@/components/ui/Reveal";
import { TransitionLink } from "@/components/shell/Transition";

export default function NotFound() {
  return (
    <section className="wrap py-24 md:py-36">
      <p className="t-eyebrow">Error 404</p>
      <Reveal as="h1" text="That page isn't here." className="t-display t-d1 mt-4 max-w-[10ch]" />
      <TransitionLink href="/" className="btn btn-red mt-10">Back to home</TransitionLink>
    </section>
  );
}
