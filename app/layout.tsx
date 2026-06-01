import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import { client } from "@/sanity/lib/client";
import { getSiteSettingsQuery } from "@/sanity/lib/queries";
import { getSiteUrl } from "@/lib/seo";

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
  metadataBase: new URL(getSiteUrl()),
  openGraph: {
    title: "Traveller's Diary | Premium Nepal Travel Stories",
    description:
      "A cinematic travel creator platform from Far Western Nepal, sharing essays, photo journals, destination stories, and future video features.",
    url: "/",
    siteName: "Traveller's Diary",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Traveller's Diary | Premium Nepal Travel Stories",
    description:
      "A cinematic travel creator platform from Far Western Nepal, sharing essays, photo journals, destination stories, and future video features.",
  },
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
      <body className="font-sans min-h-full flex flex-col bg-stone-950 text-stone-100">
        <SiteChrome
          brandName={brandName}
          tagline={siteSettings?.tagline || null}
          shortDescription={siteSettings?.shortDescription || null}
          socialLinks={{
            facebookUrl: siteSettings?.facebookUrl || null,
            instagramUrl: siteSettings?.instagramUrl || null,
            youtubeUrl: siteSettings?.youtubeUrl || null,
          }}
        >
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
