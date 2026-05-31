import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { client } from "@/sanity/lib/client";
import { getSiteSettingsQuery } from "@/sanity/lib/queries";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Traveller's Diary | Premium Nepal Travel Stories",
  description:
    "A cinematic travel creator platform from Far Western Nepal, sharing essays, photo journals, destination stories, and future video features.",
};

type SiteSettings = {
  brandName?: string | null;
  subtitle?: string | null;
  tagline?: string | null;
  shortDescription?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  youtubeUrl?: string | null;
  youtubeFeatureTitle?: string | null;
  youtubeFeatureDescription?: string | null;
  youtubeFeatureUrl?: string | null;
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteSettings = await client
    .fetch<SiteSettings | null>(getSiteSettingsQuery)
    .catch(() => null);

  const brandName = siteSettings?.brandName || "Traveller's Diary";

  return (
    <html
      lang="en"
      className={inter.variable + " " + playfair.variable + " h-full antialiased"}
    >
      <body className="font-sans min-h-full flex flex-col bg-transparent text-stone-100">
        <SmoothScrollProvider>
          <Navbar
            brandName={brandName}
            socialLinks={{
              facebookUrl: siteSettings?.facebookUrl || null,
              instagramUrl: siteSettings?.instagramUrl || null,
              youtubeUrl: siteSettings?.youtubeUrl || null,
            }}
          />
          <div className="flex-grow flex flex-col">{children}</div>
          <Footer
            brandName={brandName}
            tagline={siteSettings?.tagline || null}
            shortDescription={siteSettings?.shortDescription || null}
            socialLinks={{
              facebookUrl: siteSettings?.facebookUrl || null,
              instagramUrl: siteSettings?.instagramUrl || null,
              youtubeUrl: siteSettings?.youtubeUrl || null,
            }}
          />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
