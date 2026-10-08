import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
import "./preloader.css";
import "./deposit.css";
import "./sflow.css";
import "./adbar.css";
import { brand } from "@/config/brand";
import { themeCss } from "@/lib/theme";

// One variable file: weight 100-900 plus the width axis (62-125), so headlines are condensed and text is normal width.
const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], display: "swap", variable: "--font-archivo" });

const base = process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(base),
  title: { default: brand.site.title, template: `%s | ${brand.name}` },
  description: brand.site.description,
  applicationName: brand.name,
  openGraph: { type: "website", siteName: brand.name, title: brand.site.title, description: brand.site.description, locale: "en_NG" },
  twitter: { card: "summary_large_image", title: brand.site.title, description: brand.site.description },
  robots: brand.site.robots, // concept preview: noindex, nofollow
};
export const viewport: Viewport = { themeColor: brand.site.themeColor, width: "device-width", initialScale: 1 };

// Runs before first paint: marks JS as available and skips the intro on repeat visits this session.
const boot = `(function(){var d=document.documentElement;d.classList.add('js');try{if(sessionStorage.getItem('omegi-seen')==='1')d.dataset.seen='1'}catch(e){}setTimeout(function(){d.classList.add('rv-failsafe')},7000)})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NG" suppressHydrationWarning className={archivo.variable}>
      <head>
        <style id="brand-theme" dangerouslySetInnerHTML={{ __html: themeCss() }} />
        <script dangerouslySetInnerHTML={{ __html: boot }} />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
