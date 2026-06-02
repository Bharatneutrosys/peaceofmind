import type { Metadata } from "next";

import AdminLoginForm from "@/components/admin/AdminLoginForm";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { adminReadClient } from "@/sanity/lib/adminReadClient";
import {
  getAdminCategoriesQuery,
  getAdminDestinationsQuery,
  getAdminEssaysQuery,
  getAdminPhotoJournalsQuery,
  getAdminVideosQuery,
  getSiteSettingsQuery,
} from "@/sanity/lib/queries";
import { isAdminAuthenticated } from "@/lib/admin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin | Traveller's Diary",
  description: "Owner panel for updating Traveller's Diary website settings and links.",
  robots: {
    index: false,
    follow: false,
  },
};

type SiteSettings = {
  brandName?: string | null;
  tagline?: string | null;
  shortDescription?: string | null;
  heroHeadline?: string | null;
  heroSubheading?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  youtubeUrl?: string | null;
  authorDisplayName?: string | null;
  authorBio?: string | null;
  youtubeFeatureTitle?: string | null;
  youtubeFeatureDescription?: string | null;
  youtubeFeatureUrl?: string | null;
  heroImageUrl?: string | null;
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
  coverImageUrl?: string | null;
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
};

export default async function AdminPage() {
  const authed = await isAdminAuthenticated();

  if (!authed) {
    return <AdminLoginForm />;
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
    />
  );
}
