import type { Metadata } from "next";

const DEFAULT_SITE_URL = "http://localhost:3000";

export function getSiteUrl() {
  const rawUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");

  if (!rawUrl) {
    return DEFAULT_SITE_URL;
  }

  try {
    return new URL(rawUrl).toString().replace(/\/$/, "");
  } catch {
    return DEFAULT_SITE_URL;
  }
}

type BuildMetadataInput = {
  title: string;
  description: string;
  path?: string;
  image?: string | null;
  imageAlt?: string;
  siteName?: string;
  type?: "website" | "article";
};

export function buildMetadata({
  title,
  description,
  path,
  image,
  imageAlt,
  siteName = "Traveller's Diary",
  type = "website",
}: BuildMetadataInput): Metadata {
  const baseUrl = getSiteUrl();
  const url = path ? new URL(path, baseUrl).toString() : baseUrl;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName,
      type,
      images: image
        ? [
            {
              url: image,
              alt: imageAlt || title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}
