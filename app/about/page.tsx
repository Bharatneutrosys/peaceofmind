import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AuthorProfile from "@/components/AuthorProfile";
import PageHeader from "@/components/PageHeader";
import { client } from "@/sanity/lib/client";
import { resolveImageUrl } from "@/sanity/lib/media";
import { getSiteSettingsQuery } from "@/sanity/lib/queries";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 60;

type ImageField = {
  asset?: {
    _ref?: string;
    _id?: string;
    url?: string | null;
  } | null;
  alt?: string | null;
  caption?: string | null;
};

type SiteSettings = {
  brandName?: string | null;
  tagline?: string | null;
  shortDescription?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  youtubeUrl?: string | null;
  authorBio?: string | null;
  authorImageZoom?: number | null;
  authorImagePositionX?: number | null;
  authorImagePositionY?: number | null;
  authorImage?: ImageField | null;
};

async function getSiteSettings() {
  return client
    .fetch<SiteSettings | null>(getSiteSettingsQuery)
    .catch(() => null);
}

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await getSiteSettings();
  const brandName = siteSettings?.brandName || "Traveller's Diary";
  return buildMetadata({
    title: `About | ${brandName}`,
    description:
      siteSettings?.shortDescription ||
      siteSettings?.tagline ||
      "Learn about Traveller's Diary and its calm travel philosophy.",
    path: "/about",
    image: siteSettings?.authorImage?.asset?.url || undefined,
    imageAlt: siteSettings?.authorImage?.alt || "Traveller's Diary author portrait",
    siteName: brandName,
  });
}

export default async function AboutPage() {
  const siteSettings = await getSiteSettings();
  const brandName = siteSettings?.brandName || "Traveller's Diary";

  return (
    <main className="min-h-screen">
      <PageHeader
        eyebrow="About"
        title={brandName}
        description="Travel notes, photos, and videos from a traveler collecting places worth remembering."
        action={
          <Link
            href="/journal"
            className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-5 py-3 text-sm font-medium text-stone-50 backdrop-blur-md transition-colors duration-300 hover:bg-white/12"
          >
            Read the Journal
            <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />

      <AuthorProfile
        authorBio={siteSettings?.authorBio || null}
        authorImage={
          siteSettings?.authorImage?.asset
            ? {
                src: resolveImageUrl(siteSettings.authorImage, 1200),
                alt: "Traveller's Diary author portrait",
              }
            : null
        }
        authorImageCrop={{
          zoom: siteSettings?.authorImageZoom,
          positionX: siteSettings?.authorImagePositionX,
          positionY: siteSettings?.authorImagePositionY,
        }}
        socialLinks={{
          facebookUrl: siteSettings?.facebookUrl || null,
          instagramUrl: siteSettings?.instagramUrl || null,
          youtubeUrl: siteSettings?.youtubeUrl || null,
        }}
      />
    </main>
  );
}
