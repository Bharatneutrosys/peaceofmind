import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import PageHeader from "@/components/PageHeader";
import { client } from "@/sanity/lib/client";
import { getEssaysQuery, getSiteSettingsQuery } from "@/sanity/lib/queries";
import { resolveImageUrl } from "@/sanity/lib/media";

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
};

type EssayCard = {
  _id: string;
  title: string;
  slug?: string | null;
  excerpt?: string | null;
  date?: string | null;
  publishedAt?: string | null;
  destination?: { title?: string | null; slug?: string | null } | null;
  category?: {
    title?: string | null;
    slug?: string | null;
    regionLabel?: string | null;
  } | null;
  coverImage?: ImageField | null;
};

async function getSiteSettings() {
  return client
    .fetch<SiteSettings | null>(getSiteSettingsQuery)
    .catch(() => null);
}

function formatDate(date?: string | null) {
  if (!date) return "Recent";

  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  } catch {
    return "Recent";
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await getSiteSettings();
  const brandName = siteSettings?.brandName || "Traveller's Diary";
  const description =
    siteSettings?.shortDescription ||
    siteSettings?.tagline ||
    "Read the latest travel stories from Traveller's Diary.";

  return {
    title: `Journal | ${brandName}`,
    description,
  };
}

export default async function JournalPage() {
  const [siteSettings, essays] = await Promise.all([
    getSiteSettings(),
    client.fetch<EssayCard[]>(getEssaysQuery).catch(() => []),
  ]);

  const brandName = siteSettings?.brandName || "Traveller's Diary";

  return (
    <main className="min-h-screen">
      <PageHeader
        eyebrow="Journal"
        title="Travel stories shaped by roads, weather, and memory."
        description="Long-form writing from Traveller’s Diary, arranged like a premium travel magazine and ready to expand as the archive grows."
        action={
          <Link
            href="/about"
            className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-5 py-3 text-sm font-medium text-stone-50 backdrop-blur-md transition-colors duration-300 hover:bg-white/12"
          >
            About {brandName}
            <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />

      <section className="mx-auto max-w-7xl px-6 pb-24 sm:px-8 lg:px-12">
        {essays.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {essays.map((essay) => {
              const href = essay.slug ? `/journal/${essay.slug}` : "/journal";
              const image = resolveImageUrl(essay.coverImage, 1400);

              return (
                <article
                  key={essay._id}
                  className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.04] shadow-[0_16px_40px_rgba(0,0,0,0.16)]"
                >
                  <Link href={href} className="group block">
                    <div className="relative aspect-[16/10] bg-stone-950/40">
                      {image ? (
                        <Image
                          src={image}
                          alt={essay.coverImage?.alt || essay.title}
                          fill
                          sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                          className="object-cover transition duration-700 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.14),_transparent_35%)]" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/18 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-[0.68rem] uppercase tracking-[0.28em] text-stone-200/55">
                          {essay.category?.regionLabel ||
                            essay.category?.title ||
                            essay.destination?.title ||
                            "Travel story"}
                        </p>
                        <h2 className="mt-2 font-serif text-2xl text-stone-50">
                          {essay.title}
                        </h2>
                      </div>
                    </div>

                    <div className="p-5">
                      <p className="text-sm leading-7 text-stone-200/76">
                        {essay.excerpt ||
                          "A short editorial note is waiting to be written for this story."}
                      </p>

                      <div className="mt-5 flex flex-wrap items-center gap-3 text-[0.68rem] uppercase tracking-[0.24em] text-stone-300/55">
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-stone-950/30 px-3 py-2">
                          <CalendarDays className="h-3.5 w-3.5 text-amber-100" />
                          {formatDate(essay.publishedAt || essay.date)}
                        </span>
                        {essay.destination?.title ? (
                          <span className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-stone-950/30 px-3 py-2">
                            <MapPin className="h-3.5 w-3.5 text-sky-100" />
                            {essay.destination.title}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        ) : (
          <EmptyState
            eyebrow="Journal"
            title="The first story is still waiting to be published."
            description="The archive is ready for essays and travel stories, and the homepage and routing already know how to show them when they arrive."
            actionLabel="Back to home"
            actionHref="/"
          />
        )}
      </section>
    </main>
  );
}
