import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText, type PortableTextBlock } from "@portabletext/react";
import { ArrowLeft, CalendarDays, Clock3, MapPin } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import PageHeader from "@/components/PageHeader";
import {
  getEssayBySlugQuery,
  getRelatedPhotoJournalsByDestinationQuery,
  getRelatedEssaysByDestinationQuery,
  getSiteSettingsQuery,
} from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import { resolveImageUrl } from "@/sanity/lib/media";
import { portableTextComponents } from "@/components/EditorialEssay";
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
};

type EssayPortableTextImage = {
  _type: "image";
  asset?: {
    _ref?: string;
    _id?: string;
    url?: string | null;
  } | null;
  alt?: string | null;
  caption?: string | null;
};

type EssayBodyValue = PortableTextBlock | EssayPortableTextImage;

type EssayDetail = {
  _id: string;
  title: string;
  slug?: string | null;
  excerpt?: string | null;
  date?: string | null;
  publishedAt?: string | null;
  featured?: boolean | null;
  estimatedReadTime?: string | null;
  tags?: string[] | null;
  coverImage?: ImageField | null;
  destination?: { _id: string; title?: string | null; slug?: string | null } | null;
  category?: {
    _id: string;
    title?: string | null;
    slug?: string | null;
    description?: string | null;
    regionLabel?: string | null;
  } | null;
  body?: EssayBodyValue[] | null;
};

type PhotoJournalCard = {
  _id: string;
  title: string;
  excerpt?: string | null;
  publishedAt?: string | null;
  coverImage?: ImageField | null;
  destination?: { _id: string; title?: string | null; slug?: string | null } | null;
  category?: {
    _id: string;
    title?: string | null;
    slug?: string | null;
    regionLabel?: string | null;
  } | null;
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

function estimateReadTime(body?: EssayBodyValue[] | null) {
  if (!body?.length) {
    return "4 min read";
  }

  const plainText = body
    .map((block) => {
      if (block._type !== "block") return "";
      return (block as PortableTextBlock).children
        .map((child) => ("text" in child ? child.text : ""))
        .join(" ");
    })
    .join(" ");

  const words = plainText.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(4, Math.round(words / 190))} min read`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [siteSettings, essay] = await Promise.all([
    getSiteSettings(),
    client.fetch<EssayDetail | null>(getEssayBySlugQuery, { slug }).catch(() => null),
  ]);

  const brandName = siteSettings?.brandName || "Traveller's Diary";
  if (!essay) {
    return buildMetadata({
      title: `Journal | ${brandName}`,
      description:
        siteSettings?.shortDescription ||
        siteSettings?.tagline ||
        "Premium travel stories from Traveller's Diary.",
      path: "/journal",
      siteName: brandName,
    });
  }

  return buildMetadata({
    title: `${essay.title} | Journal | ${brandName}`,
    description:
      essay.excerpt ||
      siteSettings?.shortDescription ||
      "A premium travel story from Traveller's Diary.",
    path: `/journal/${slug}`,
    image: resolveImageUrl(essay.coverImage, 1600) || undefined,
    imageAlt: essay.coverImage?.alt || essay.title,
    siteName: brandName,
    type: "article",
  });
}

export default async function JournalDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const essay = await client
    .fetch<EssayDetail | null>(getEssayBySlugQuery, { slug })
    .catch(() => null);

  if (!essay) {
    notFound();
  }

  const [relatedEssays, relatedJournals] = await Promise.all([
    essay.destination?._id
      ? client
          .fetch<EssayDetail[]>(getRelatedEssaysByDestinationQuery, {
            destinationId: essay.destination._id,
          })
          .catch(() => [])
      : Promise.resolve([]),
    essay.destination?._id
      ? client
          .fetch<PhotoJournalCard[]>(getRelatedPhotoJournalsByDestinationQuery, {
            destinationId: essay.destination._id,
          })
          .catch(() => [])
      : Promise.resolve([]),
  ]);

  const cleanRelatedEssays = relatedEssays.filter((item) => item._id !== essay._id);

  return (
    <main className="min-h-screen">
      <PageHeader
        eyebrow="Journal"
        title={essay.title}
        description={
          essay.excerpt ||
          "A full travel story set in the quiet, cinematic voice of Traveller's Diary."
        }
        action={
          <Link
            href="/journal"
            className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-5 py-3 text-sm font-medium text-stone-50 backdrop-blur-md transition-colors duration-300 hover:bg-white/12"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Journal
          </Link>
        }
      />

      <section className="mx-auto max-w-7xl px-6 pb-24 sm:px-8 lg:px-12">
        <article className="overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/[0.03] shadow-[0_24px_90px_rgba(0,0,0,0.28)] backdrop-blur-sm">
          {essay.coverImage ? (
            <div className="relative aspect-[16/9] w-full overflow-hidden">
              <Image
                src={resolveImageUrl(essay.coverImage, 2000)}
                alt={essay.coverImage.alt || essay.title}
                fill
                priority
                sizes="(min-width: 1280px) 1200px, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/12 to-transparent" />
            </div>
          ) : null}

          <div className="grid gap-12 px-6 py-8 md:px-10 md:py-12 lg:grid-cols-[minmax(0,1.6fr)_minmax(16rem,0.7fr)] lg:px-12">
            <div>
              <div className="flex flex-wrap items-center gap-3 text-[0.7rem] uppercase tracking-[0.32em] text-stone-300/60">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
                  <CalendarDays className="h-3.5 w-3.5 text-amber-100" />
                  {formatDate(essay.publishedAt || essay.date)}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
                  <Clock3 className="h-3.5 w-3.5 text-sky-100" />
                  {estimateReadTime(essay.body)}
                </span>
                {essay.destination?.title ? (
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
                    <MapPin className="h-3.5 w-3.5 text-amber-100" />
                    {essay.destination.title}
                  </span>
                ) : null}
              </div>

              <div className="mt-8 max-w-3xl">
                <p className="text-xs uppercase tracking-[0.32em] text-stone-300/55">
                  Featured story
                </p>
                {essay.category?.title ? (
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-sm uppercase tracking-[0.28em] text-stone-300/55">
                    <span>{essay.category.regionLabel || essay.category.title}</span>
                    {essay.destination?.title ? (
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[0.68rem] tracking-[0.22em] text-stone-200/66">
                        <MapPin className="h-3.5 w-3.5 text-amber-100" />
                        {essay.destination.title}
                      </span>
                    ) : null}
                  </div>
                ) : null}
                <div className="mt-5 border-t border-white/10 pt-8">
                  {essay.body?.length ? (
                    <PortableText
                      value={(essay.body ?? []) as EssayBodyValue[]}
                      components={portableTextComponents}
                    />
                  ) : (
                    <div className="max-w-3xl rounded-[1.5rem] border border-white/10 bg-white/4 px-6 py-8">
                      <p className="text-xs uppercase tracking-[0.32em] text-stone-300/55">
                        Story body
                      </p>
                      <p className="mt-4 text-pretty text-base leading-8 text-stone-200/78">
                        This story is waiting for its full travel text. The page
                        is ready, and the article body can be added from Sanity
                        whenever the essay is published.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <aside className="space-y-4 self-start rounded-[1.75rem] border border-white/10 bg-stone-950/35 p-5">
              <p className="text-xs uppercase tracking-[0.32em] text-stone-300/55">
                Story notes
              </p>
              <div className="space-y-4 text-sm leading-7 text-stone-200/78">
                <p>
                  {essay.destination?.title
                    ? `Written from ${essay.destination.title}, this story stays close to the details that make a journey feel personal.`
                    : "This story stays close to the details that make a journey feel personal."}
                </p>
              <p>
                  Traveller&apos;s Diary uses a calm editorial voice, letting the road,
                  light, and memory do most of the talking.
              </p>
              </div>

              {essay.tags?.length ? (
                <div className="flex flex-wrap gap-2 pt-2">
                  {essay.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[0.68rem] uppercase tracking-[0.22em] text-stone-100/74"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </aside>
          </div>
        </article>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 sm:px-8 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] px-6 py-8 backdrop-blur-sm md:px-8">
            <p className="text-xs uppercase tracking-[0.32em] text-stone-300/55">
              Related stories
            </p>
            {cleanRelatedEssays.length > 0 ? (
              <div className="mt-6 space-y-4">
                {cleanRelatedEssays.slice(0, 3).map((item) => (
                  <Link
                    key={item._id}
                    href={item.slug ? `/journal/${item.slug}` : "/journal"}
                    className="block rounded-[1.25rem] border border-white/8 bg-stone-950/25 p-4 transition-colors duration-300 hover:bg-white/6"
                  >
                    <p className="text-[0.68rem] uppercase tracking-[0.28em] text-stone-300/55">
                      {item.category?.regionLabel || item.category?.title || "Story"}
                    </p>
                    <p className="mt-2 font-serif text-xl text-stone-50">
                      {item.title}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-stone-200/72">
                      {item.excerpt || "A companion piece from the same destination."}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState
                eyebrow="Related stories"
                title="No companion stories yet."
                description="The archive can surface related travel stories here once more essays are added for this destination."
                actionLabel="Browse Journal"
                actionHref="/journal"
              />
            )}
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] px-6 py-8 backdrop-blur-sm md:px-8">
            <p className="text-xs uppercase tracking-[0.32em] text-stone-300/55">
              Related frames
            </p>
            {relatedJournals.length > 0 ? (
              <div className="mt-6 space-y-4">
                {relatedJournals.slice(0, 3).map((item) => (
                  <Link
                    key={item._id}
                    href="/gallery"
                    className="flex gap-4 rounded-[1.25rem] border border-white/8 bg-stone-950/25 p-4 transition-colors duration-300 hover:bg-white/6"
                  >
                    <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-[1rem] bg-stone-900">
                      {item.coverImage ? (
                        <Image
                          src={resolveImageUrl(item.coverImage, 800)}
                          alt={item.coverImage.alt || item.title}
                          fill
                          sizes="112px"
                          className="object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[0.68rem] uppercase tracking-[0.28em] text-stone-300/55">
                        {item.category?.regionLabel || item.category?.title || "Photo journal"}
                      </p>
                      <p className="mt-2 font-serif text-xl text-stone-50">
                        {item.title}
                      </p>
                      <p className="mt-2 text-sm leading-7 text-stone-200/72">
                        {item.excerpt || "A complementary visual note from the archive."}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState
                eyebrow="Related frames"
                title="No matching photo journal yet."
                description="When a matching photo journal exists, it will appear here beside the story."
                actionLabel="Open Gallery"
                actionHref="/gallery"
              />
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
