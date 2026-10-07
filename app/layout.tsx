import type { Metadata, Viewport } from "next";
import "./globals.css";
import { brand } from "@/config/brand";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(base),
  title: brand.site.title,
  description: brand.site.description,
  openGraph: { type: "website", siteName: brand.name, title: brand.site.title, description: brand.site.description },
  twitter: { card: "summary_large_image" },
  robots: brand.site.robots, // concept preview: noindex
};
export const viewport: Viewport = { themeColor: brand.site.themeColor };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ background: brand.colors.tarmac, color: brand.colors.onDark }}>
        <main id="main">{children}</main>
        <p style={{ padding: "1rem", color: brand.colors.onDarkMuted }}>{brand.conceptLabel}</p>
      </body>
    </html>
  );
}
