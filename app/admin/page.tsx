import type { Metadata } from "next";

import AdminLoginForm from "@/components/admin/AdminLoginForm";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { adminReadClient } from "@/sanity/lib/adminReadClient";
import { getSiteSettingsQuery } from "@/sanity/lib/queries";
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
};

export default async function AdminPage() {
  const authed = await isAdminAuthenticated();

  if (!authed) {
    return <AdminLoginForm />;
  }

  const settings = await adminReadClient
    .fetch<SiteSettings | null>(getSiteSettingsQuery)
    .catch(() => null);

  return (
    <AdminDashboard
      initialSettings={settings}
      brandName={settings?.brandName || "Traveller's Diary"}
    />
  );
}
