import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import PageHeader from "@/components/PageHeader";
import { client } from "@/sanity/lib/client";
import { getAllVideosQuery, getSiteSettingsQuery } from "@/sanity/lib/queries";
import { resolveImageUrl } from "@/sanity/lib/media";
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
  shortDescription?: string | null;
  tagline?: string | null;
  heroImage?: ImageField | null;
  heroHeadline?: string | null;
};

type VideoRecord = {
  _id: string;
  title: string;
  description?: string | null;
  youtubeUrl?: string | null;
  slug?: string | null;
  thumbnail?: ImageField | null;
  destination?: { _id: string; title?: string | null; slug?: string | null } | null;
  category?: { _id: string; title?: string | null; slug?: string | null } | null;
  publishedAt?: string | null;
};

async function getSiteSettings() {
  return client
    .fetch<SiteSettings | null>(getSiteSettingsQuery)
    .catch(() => null);
}

function toYoutubeEmbedUrl(raw?: string | null) {
  if (!raw) return null;

  try {
    const url = new URL(raw);

    if (url.hostname.includes("youtu.be")) {
      const id = url.pathname.replace("/", "");
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }

    const videoId = url.searchParams.get("v");
    if (videoId) {
      return `https://www.youtube-nocookie.com/embed/${videoId}`;
    }

    const embedMatch = url.pathname.match(/\/embed\/([^/?]+)/);
    if (embedMatch?.[1]) {
      return `https://www.youtube-nocookie.com/embed/${embedMatch[1]}`;
    }

    const shortsMatch = url.pathname.match(/\/shorts\/([^/?]+)/);
    if (shortsMatch?.[1]) {
      return `https://www.youtube-nocookie.com/embed/${shortsMatch[1]}`;
    }
  } catch {
    return null;
  }

  return null;
}

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await getSiteSettings();
  const brandName = siteSettings?.brandName || "Traveller's Diary";
  return buildMetadata({
    title: `Videos | ${brandName}`,
    description:
      siteSettings?.shortDescription ||
      siteSettings?.tagline ||
      "Watch travel videos and future channel stories from Traveller's Diary.",
    path: "/videos",
    image: siteSettings?.heroImage?.asset?.url || undefined,
    imageAlt: siteSettings?.heroHeadline || brandName,
    siteName: brandName,
  });
}

export default async function VideosPage() {
  const [videos, siteSettings] = await Promise.all([
    client.fetch<VideoRecord[]>(getAllVideosQuery).catch(() => []),
    getSiteSettings(),
  ]);
  const visibleVideos =
    videos.length > 0
      ? videos
      : [
          {
            _id: "sample-nepal-video",
            title: "Sample Nepal travel video",
            description:
              "Sample content for testing the video section. Replace it from the admin panel when the first real video is ready.",
            youtubeUrl: "https://www.youtube.com/watch?v=ZZIwr_gUvc0",
            slug: "sample-nepal-video",
            thumbnail:
              siteSettings?.heroImage || {
                asset: { url: "/images/hero-panorama.png" },
                alt: "A long Himalayan mountain panorama",
              },
            destination: null,
            category: null,
            publishedAt: null,
          },
        ];

  return (
    <main className="min-h-screen">
      <PageHeader
        eyebrow="Videos"
        title="Travel videos and road notes."
        description="A simple place for journey clips, YouTube links, and quiet video moments from the road."
        action={
          <Link
            href="/about"
            className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-5 py-3 text-sm font-medium text-stone-50 backdrop-blur-md transition-colors duration-300 hover:bg-white/12"
          >
            About the Creator
            <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />

      <section className="mx-auto max-w-7xl px-6 pb-24 sm:px-8 lg:px-12">
        {visibleVideos.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleVideos.map((video) => {
              const embedUrl = toYoutubeEmbedUrl(video.youtubeUrl);
              const watchUrl = video.youtubeUrl || embedUrl;

              return (
                <article
                  key={video._id}
                  className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.04] shadow-[0_16px_40px_rgba(0,0,0,0.16)]"
                >
                  <div className="relative aspect-video bg-stone-950/45">
                    {embedUrl ? (
                      <iframe
                        src={embedUrl}
                        title={video.title}
                        className="absolute inset-0 h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    ) : video.thumbnail ? (
                      <Image
                        src={resolveImageUrl(video.thumbnail, 1600)}
                        alt={video.thumbnail.alt || video.title}
                        fill
                        sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.14),_transparent_35%)]" />
                    )}

                    {!embedUrl ? (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/8 text-stone-50 backdrop-blur-md">
                            <Play className="h-5 w-5 fill-stone-50" />
                          </span>
                        </div>
                      </>
                    ) : null}
                  </div>

                  <div className="p-5">
                    <p className="text-[0.68rem] uppercase tracking-[0.28em] text-stone-300/55">
                      {video.category?.title || video.destination?.title || "Video"}
                    </p>
                    <h2 className="mt-3 font-serif text-2xl text-stone-50">
                      {video.title}
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-stone-200/76">
                      {video.description ||
                        "A future travel video can live here with a clean embed or watch link."}
                    </p>
                    {watchUrl ? (
                      <a
                        href={watchUrl}
                        className="mt-5 inline-flex items-center gap-2 rounded-full bg-stone-50 px-5 py-3 text-sm font-medium text-stone-950 transition-transform duration-300 hover:-translate-y-0.5"
                        target={watchUrl.startsWith("http") ? "_blank" : undefined}
                        rel={watchUrl.startsWith("http") ? "noopener noreferrer" : undefined}
                      >
                        Watch on YouTube
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    ) : (
                      <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-5 py-3 text-sm font-medium text-stone-50/60">
                        Watch on YouTube
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <EmptyState
            eyebrow="Videos"
            title="The video archive is ready."
            description="Once YouTube videos are added in Sanity, the page will display the embed or watch link without any redesign."
            actionLabel="Open Admin"
            actionHref="/admin"
          />
        )}
      </section>
    </main>
  );
}
