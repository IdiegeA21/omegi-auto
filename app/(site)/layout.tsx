import { CarSilhouetteDefs } from "@/components/brand/CarSilhouette";
import Cursor from "@/components/shell/Cursor";
import { EnquiryProvider } from "@/components/shell/EnquirySheet";
import Toaster from "@/components/shell/Toaster";
import Dock from "@/components/shell/Dock";
import Footer from "@/components/shell/Footer";
import Header from "@/components/shell/Header";
import { MenuProvider } from "@/components/shell/MenuSheet";
import Preloader from "@/components/shell/Preloader";
import SmoothScroll from "@/components/shell/SmoothScroll";
import { TransitionProvider } from "@/components/shell/Transition";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <TransitionProvider>
      <MenuProvider>
       <EnquiryProvider>
        <CarSilhouetteDefs />
        <SmoothScroll />
        <Cursor />
        <a href="#main" className="skip">Skip to content</a>
        <Preloader />
        {/* .site-pad reserves the dock's height on phones so the dock never covers content */}
        <div className="site-pad">
          <Header />
          <main id="main" tabIndex={-1} className="outline-none">{children}</main>
          <Footer />
        </div>
        <Dock />
        <Toaster />
       </EnquiryProvider>
      </MenuProvider>
    </TransitionProvider>
  );
}
