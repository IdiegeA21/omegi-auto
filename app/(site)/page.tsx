import AnnouncementBar from "@/components/home/AnnouncementBar";
import QuoteBand from "@/components/home/QuoteBand";
import StatStrip from "@/components/ui/StatStrip";
import BrandIndex from "@/components/home/BrandIndex";
import DownPaymentBrowser from "@/components/home/DownPaymentBrowser";
import FaqTeaser from "@/components/home/FaqTeaser";
import FeaturedCars from "@/components/home/FeaturedCars";
import Hero from "@/components/home/Hero";
import InstagramStrip from "@/components/home/InstagramStrip";
import PayFortySection from "@/components/home/PayFortySection";
import ServicesIndex from "@/components/home/ServicesIndex";
import SoldWall from "@/components/home/SoldWall";
import ToolTiles from "@/components/home/ToolTiles";
import Marquee from "@/components/ui/Marquee";
import { brand } from "@/config/brand";
import { heroSlideIds } from "@/config/ui";
import { featuredCars, getPublicCars, soldCars } from "@/lib/cars";

export default function Home() {
  const all = getPublicCars();
  const slides = heroSlideIds.map((id) => all.find((c) => c.id === id)).filter((c): c is NonNullable<typeof c> => !!c);
  const available = all.filter((c) => c.status === "available");
  const ticker = [...brand.services.map((s) => s.label), ...new Set(available.map((c) => c.brand))];
  return (
    <>
      <AnnouncementBar />
      <Hero cars={slides} />
      <div className="wrap pb-10 md:pb-14"><StatStrip stats={[
        { value: available.length, label: "cars available" },
        { value: new Set(available.map((c) => c.brand)).size, label: "brands" },
        { value: available.filter((c) => c.payment.installment).length, label: "with an installment option" },
      ]} /></div>
      <Marquee items={ticker} />
      <FeaturedCars cars={featuredCars()} total={available.length} />
      <BrandIndex cars={all} />
      <DownPaymentBrowser cars={all} />
      <PayFortySection />
      <ToolTiles />
      <QuoteBand />
      <ServicesIndex />
      <SoldWall cars={soldCars()} compact />
      <InstagramStrip />
      <FaqTeaser />
    </>
  );
}
