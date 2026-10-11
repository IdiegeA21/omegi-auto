import Logo from "@/components/brand/Logo";
import PreloaderController from "./PreloaderController";

/**
 * Server-rendered first-visit intro. The logo assembles in pure CSS from first paint (app/preloader.css), so a slow
 * connection never sits on a blank screen; PreloaderController (client) then lifts the curtain with GSAP.
 */
export default function Preloader() {
  return (
    <div className="preloader" aria-hidden="true" data-preloader>
      <div className="pl-logo w-[min(78vw,540px)]"><Logo tone="light" className="w-full" /></div>
      <PreloaderController />
    </div>
  );
}
