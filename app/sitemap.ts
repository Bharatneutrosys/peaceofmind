import type { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import {
  getDestinationsQuery,
  getEssaysQuery,
  getSiteSettingsQuery,
} from "@/sanity/lib/queries";
import { getSiteUrl } from "@/lib/seo";

type SlugRecord = {
  slug?: string | null;
  publishedAt?: string | null;
  date?: string | null;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  const [essays, destinations] = await Promise.all([
    client.fetch<SlugRecord[]>(getEssaysQuery).catch(() => []),
    client.fetch<SlugRecord[]>(getDestinationsQuery).catch(() => []),
  ]);

  const settings = await client
    .fetch<{ heroHeadline?: string | null } | null>(getSiteSettingsQuery)
    .catch(() => null);

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/journal",
    "/destinations",
    "/gallery",
    "/videos",
    "/about",
  ].map((pathname) => ({
    url: `${siteUrl}${pathname}`,
    lastModified: new Date(),
    changeFrequency: pathname === "" ? "weekly" : "monthly",
    priority: pathname === "" ? 1 : 0.8,
  }));

  const essayRoutes = essays
    .filter((item) => Boolean(item.slug))
    .map((item) => ({
      url: `${siteUrl}/journal/${item.slug}`,
      lastModified: item.publishedAt || item.date ? new Date(item.publishedAt || item.date || "") : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  const destinationRoutes = destinations
    .filter((item) => Boolean(item.slug))
    .map((item) => ({
      url: `${siteUrl}/destinations/${item.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  if (settings?.heroHeadline) {
    staticRoutes[0].lastModified = new Date();
  }

  return [...staticRoutes, ...essayRoutes, ...destinationRoutes];
}
