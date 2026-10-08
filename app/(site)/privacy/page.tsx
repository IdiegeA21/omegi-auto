import type { Metadata } from "next";
import PageHead from "@/components/ui/PageHead";

export const metadata: Metadata = { title: "Privacy" };
export default function Privacy() {
  return (<><PageHead eyebrow="Privacy" title="Your data" narrow={false} />
    <section className="wrap pb-section"><div className="max-w-[46rem] space-y-5 text-[16px]">
      <p>This is a concept preview. The business will supply its own privacy policy before launch. This page describes what the preview itself does.</p>
      <h2 className="t-display text-[1.75rem]">What this site stores</h2>
      <p>Cars you save to your shortlist are kept in your browser on this device only. We note that you have seen the intro animation for the current browser session. There are no accounts, no advertising trackers and no embedded social widgets.</p>
      <h2 className="t-display text-[1.75rem]">What the forms do</h2>
      <p>The forms on this site do not send your details to any server. They prepare a message that opens in WhatsApp on your own device. Nothing is sent until you press send in WhatsApp, and then WhatsApp&apos;s own terms and privacy policy apply.</p>
    </div></section></>);
}
