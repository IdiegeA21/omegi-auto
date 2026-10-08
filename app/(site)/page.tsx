import Hero from "@/components/home/Hero";
import FeaturedCars from "@/components/home/FeaturedCars";
import DownPaymentBrowser from "@/components/home/DownPaymentBrowser";
import PayFortySection from "@/components/home/PayFortySection";
import ServicesIndex from "@/components/home/ServicesIndex";
import { heroSlideIds } from "@/config/ui";
import { featuredCars, getPublicCars } from "@/lib/cars";

export default function Home() {
  const all = getPublicCars();
  const slides = heroSlideIds.map((id) => all.find((c) => c.id === id)).filter((c): c is NonNullable<typeof c> => !!c);
  const available = all.filter((c) => c.status === "available");
  return (
    <>
      <Hero cars={slides} />
      <FeaturedCars cars={featuredCars()} total={available.length} />
      <DownPaymentBrowser cars={all} />
      <PayFortySection />
      <ServicesIndex />
    </>
  );
}
