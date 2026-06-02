import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import AdminDashboard from "@/components/admin/AdminDashboard";
import { isAdminAuthenticated } from "@/lib/admin";
import { adminReadClient } from "@/sanity/lib/adminReadClient";
import {
  getAdminCategoriesQuery,
  getAdminDestinationsQuery,
  getAdminEssaysQuery,
  getAdminPhotoJournalsQuery,
  getAdminVideosQuery,
  getSiteSettingsQuery,
} from "@/sanity/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin | Traveller's Diary",
  description: "Focused owner editing page for Traveller's Diary.",
  robots: {
    index: false,
    follow: false,
  },
};

const validSections = [
  "settings",
  "hero",
  "author",
  "social",
  "categories",
  "destinations",
  "journal",
  "photo-journals",
  "videos",
] as const;

type AdminView = (typeof validSections)[number];

type SiteSettings = {
  brandName?: string | null;
  tagline?: string | null;
  shortDescription?: string | null;
  heroHeadline?: string | null;
  heroSubheading?: string | null;
  heroQuote?: string | null;
  heroIntroShort?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  youtubeUrl?: string | null;
  authorDisplayName?: string | null;
  authorBio?: string | null;
  authorImageZoom?: number | null;
  authorImagePositionX?: number | null;
  authorImagePositionY?: number | null;
  youtubeFeatureTitle?: string | null;
  youtubeFeatureDescription?: string | null;
  youtubeFeatureUrl?: string | null;
  heroImageUrl?: string | null;
  heroAuthorImageUrl?: string | null;
  authorImageUrl?: string | null;
};

type CategoryRecord = {
  _id: string;
  title?: string | null;
  slug?: string | null;
  description?: string | null;
  regionLabel?: string | null;
  featured?: boolean | null;
  order?: number | null;
  coverImageUrl?: string | null;
  isArchived?: boolean | null;
};

type DestinationRecord = {
  _id: string;
  title?: string | null;
  slug?: string | null;
  country?: string | null;
  shortIntro?: string | null;
  description?: string | null;
  featured?: boolean | null;
  order?: number | null;
  categoryId?: string | null;
  parentDestinationId?: string | null;
  coverImageUrl?: string | null;
  isArchived?: boolean | null;
};

type EssayRecord = {
  _id: string;
  title?: string | null;
  slug?: string | null;
  excerpt?: string | null;
  destinationId?: string | null;
  categoryId?: string | null;
  publishedAt?: string | null;
  featured?: boolean | null;
  estimatedReadTime?: string | null;
  bodyText?: string | null;
  coverImageUrl?: string | null;
  isArchived?: boolean | null;
};

type GalleryImageRecord = {
  _key?: string;
  url?: string | null;
  alt?: string | null;
  caption?: string | null;
};

type PhotoJournalRecord = {
  _id: string;
  title?: string | null;
  slug?: string | null;
  excerpt?: string | null;
  destinationId?: string | null;
  categoryId?: string | null;
  publishedAt?: string | null;
  featured?: boolean | null;
  coverImageUrl?: string | null;
  gallery?: GalleryImageRecord[] | null;
  isArchived?: boolean | null;
};

type VideoRecord = {
  _id: string;
  title?: string | null;
  slug?: string | null;
  description?: string | null;
  youtubeUrl?: string | null;
  publishedAt?: string | null;
  featured?: boolean | null;
  destinationId?: string | null;
  categoryId?: string | null;
  thumbnailUrl?: string | null;
  isArchived?: boolean | null;
};

export default async function AdminSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin");
  }

  const { section } = await params;

  if (!validSections.includes(section as AdminView)) {
    notFound();
  }

  const [settings, categories, destinations, essays, photoJournals, videos] =
    await Promise.all([
      adminReadClient.fetch<SiteSettings | null>(getSiteSettingsQuery).catch(() => null),
      adminReadClient.fetch<CategoryRecord[]>(getAdminCategoriesQuery).catch(() => []),
      adminReadClient.fetch<DestinationRecord[]>(getAdminDestinationsQuery).catch(() => []),
      adminReadClient.fetch<EssayRecord[]>(getAdminEssaysQuery).catch(() => []),
      adminReadClient.fetch<PhotoJournalRecord[]>(getAdminPhotoJournalsQuery).catch(() => []),
      adminReadClient.fetch<VideoRecord[]>(getAdminVideosQuery).catch(() => []),
    ]);

  return (
    <AdminDashboard
      initialSettings={settings}
      brandName={settings?.brandName || "Traveller's Diary"}
      categories={categories}
      destinations={destinations}
      essays={essays}
      photoJournals={photoJournals}
      videos={videos}
      view={section as AdminView}
    />
  );
}
