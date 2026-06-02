import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import PageHeader from "@/components/PageHeader";
import { client } from "@/sanity/lib/client";
import {
  getDestinationBySlugQuery,
  getRelatedEssaysByDestinationQuery,
  getRelatedPhotoJournalsByDestinationQuery,
  getSiteSettingsQuery,
} from "@/sanity/lib/queries";
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
};

type DestinationDetail = {
  _id: string;
  title: string;
  slug?: string | null;
  region?: string | null;
  description?: string | null;
  shortIntro?: string | null;
  country?: string | null;
  featured?: boolean | null;
  order?: number | null;
  coverImage?: ImageField | null;
  category?: {
    _id: string;
    title?: string | null;
    slug?: string | null;
    description?: string | null;
    regionLabel?: string | null;
  } | null;
  parentDestination?: {
    _id: string;
    title?: string | null;
    slug?: string | null;
    country?: string | null;
  } | null;
  children?: DestinationChild[] | null;
};

type DestinationChild = {
  _id: string;
  title: string;
  slug?: string | null;
  description?: string | null;
  shortIntro?: string | null;
  country?: string | null;
  coverImage?: ImageField | null;
  category?: {
    _id: string;
    title?: string | null;
    regionLabel?: string | null;
  } | null;
};

type RelatedEssay = {
  _id: string;
  title: string;
  slug?: string | null;
  excerpt?: string | null;
  date?: string | null;
  coverImage?: ImageField | null;
  category?: {
    _id: string;
    title?: string | null;
    regionLabel?: string | null;
  } | null;
};

type RelatedJournal = {
  _id: string;
  title: string;
  excerpt?: string | null;
  publishedAt?: string | null;
  coverImage?: ImageField | null;
  category?: {
    _id: string;
    title?: string | null;
    regionLabel?: string | null;
  } | null;
};

async function getSiteSettings() {
  return client
    .fetch<SiteSettings | null>(getSiteSettingsQuery)
    .catch(() => null);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [siteSettings, destination] = await Promise.all([
    getSiteSettings(),
    client
      .fetch<DestinationDetail | null>(getDestinationBySlugQuery, { slug })
      .catch(() => null),
  ]);

  const brandName = siteSettings?.brandName || "Traveller's Diary";

  if (!destination) {
    return buildMetadata({
      title: `Destinations | ${brandName}`,
      description:
        siteSettings?.shortDescription ||
        siteSettings?.tagline ||
        "Browse destinations from Traveller's Diary.",
      path: "/destinations",
      siteName: brandName,
    });
  }

  return buildMetadata({
    title: `${destination.title} | Destinations | ${brandName}`,
    description:
      destination.shortIntro ||
      destination.description ||
      siteSettings?.shortDescription ||
      "A destination page from Traveller's Diary.",
    path: `/destinations/${slug}`,
    image: resolveImageUrl(destination.coverImage, 1600) || undefined,
    imageAlt: destination.coverImage?.alt || destination.title,
    siteName: brandName,
    type: "article",
  });
}

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const destination = await client
    .fetch<DestinationDetail | null>(getDestinationBySlugQuery, { slug })
    .catch(() => null);

  if (!destination) {
    notFound();
  }

  const [relatedEssays, relatedJournals] = await Promise.all([
    client
      .fetch<RelatedEssay[]>(getRelatedEssaysByDestinationQuery, {
        destinationId: destination._id,
      })
      .catch(() => []),
    client
      .fetch<RelatedJournal[]>(getRelatedPhotoJournalsByDestinationQuery, {
        destinationId: destination._id,
      })
      .catch(() => []),
  ]);

  return (
    <main className="min-h-screen">
      <PageHeader
        eyebrow="Destinations"
        title={destination.title}
        description={
          destination.shortIntro ||
          destination.description ||
          "A destination landing page shaped by the calm editorial tone of Traveller's Diary."
        }
        action={
          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-5 py-3 text-sm font-medium text-stone-50 backdrop-blur-md transition-colors duration-300 hover:bg-white/12"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Destinations
          </Link>
        }
      />

      <section className="mx-auto max-w-7xl px-6 pb-24 sm:px-8 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)]">
          <article className="overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/[0.03] shadow-[0_24px_90px_rgba(0,0,0,0.28)] backdrop-blur-sm">
            <div className="relative aspect-[16/9] bg-stone-950/40">
              {destination.coverImage ? (
                <Image
                  src={resolveImageUrl(destination.coverImage, 2000)}
                  alt={destination.coverImage.alt || destination.title}
                  fill
                  priority
                  sizes="(min-width: 1280px) 900px, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.14),_transparent_35%)]" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/18 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-[0.68rem] uppercase tracking-[0.28em] text-stone-200/55">
                  {destination.category?.regionLabel ||
                    destination.category?.title ||
                    destination.region ||
                    destination.country ||
                    "Destination"}
                </p>
                <h1 className="mt-2 font-serif text-3xl text-stone-50 md:text-5xl">
                  {destination.title}
                </h1>
              </div>
            </div>

            <div className="grid gap-10 px-6 py-8 md:px-10 md:py-12 lg:px-12">
              <div className="space-y-5">
                <div className="flex flex-wrap gap-3 text-[0.7rem] uppercase tracking-[0.28em] text-stone-300/55">
                  {destination.country ? (
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
                      <MapPin className="h-3.5 w-3.5 text-amber-100" />
                      {destination.country}
                    </span>
                  ) : null}
                  {destination.category?.title ? (
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
                      <MapPin className="h-3.5 w-3.5 text-sky-100" />
                      {destination.category.regionLabel || destination.category.title}
                    </span>
                  ) : null}
                  {destination.parentDestination?.title ? (
                    <Link
                      href={
                        destination.parentDestination.slug
                          ? `/destinations/${destination.parentDestination.slug}`
                          : "/destinations"
                      }
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 transition-colors hover:bg-white/10"
                    >
                      <MapPin className="h-3.5 w-3.5 text-emerald-100" />
                      Under {destination.parentDestination.title}
                    </Link>
                  ) : null}
                </div>

                <p className="max-w-3xl text-pretty text-base leading-8 text-stone-200/80 md:text-lg">
                  {destination.description ||
                    destination.shortIntro ||
                    "A destination page is ready for future story expansion."}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.25rem] border border-white/10 bg-stone-950/35 p-4">
                  <p className="text-[0.68rem] uppercase tracking-[0.28em] text-stone-300/55">
                    Country
                  </p>
                  <p className="mt-3 font-serif text-2xl text-stone-50">
                    {destination.country || "Unlisted"}
                  </p>
                </div>
                <div className="rounded-[1.25rem] border border-white/10 bg-stone-950/35 p-4">
                  <p className="text-[0.68rem] uppercase tracking-[0.28em] text-stone-300/55">
                    Category
                  </p>
                  <p className="mt-3 font-serif text-2xl text-stone-50">
                    {destination.category?.title || destination.region || "Destination"}
                  </p>
                </div>
              </div>
            </div>
          </article>

          <aside className="space-y-4 self-start rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.32em] text-stone-300/55">
              Destination notes
            </p>
            <div className="space-y-4 text-sm leading-7 text-stone-200/78">
              <p>
                Traveller&apos;s Diary uses each destination as a chapter heading,
                allowing stories and photo journals to grow underneath it.
              </p>
              <p>
                If related stories or frames exist, they will appear lower on the
                page and connect back to the same route.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {destination.children?.length ? (
        <section className="mx-auto max-w-7xl px-6 pb-24 sm:px-8 lg:px-12">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] px-6 py-8 backdrop-blur-sm md:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-stone-300/55">
                  Child places
                </p>
                <h2 className="mt-3 font-serif text-3xl text-stone-50">
                  Places under {destination.title}
                </h2>
              </div>
              <p className="max-w-2xl text-sm leading-7 text-stone-200/68">
                Smaller routes and related places connected to this destination.
              </p>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {destination.children.map((child) => (
                <Link
                  key={child._id}
                  href={child.slug ? `/destinations/${child.slug}` : "/destinations"}
                  className="group overflow-hidden rounded-[1.5rem] border border-white/10 bg-stone-950/25 transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className="relative aspect-[16/10] bg-stone-950/40">
                    {child.coverImage ? (
                      <Image
                        src={resolveImageUrl(child.coverImage, 1200)}
                        alt={child.coverImage.alt || child.title}
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
                        {child.category?.regionLabel ||
                          child.category?.title ||
                          child.country ||
                          "Child place"}
                      </p>
                      <h3 className="mt-2 font-serif text-2xl text-stone-50">
                        {child.title}
                      </h3>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-sm leading-7 text-stone-200/76">
                      {child.shortIntro ||
                        child.description ||
                        "A nested place ready for future stories."}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-7xl px-6 pb-24 sm:px-8 lg:px-12">
        {relatedEssays.length === 0 && relatedJournals.length === 0 && !destination.children?.length ? (
          <div className="mb-8 rounded-[1.75rem] border border-white/10 bg-white/5 px-6 py-10 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.32em] text-stone-300/55">
              Related content
            </p>
            <p className="mt-4 max-w-2xl text-base leading-8 text-stone-200/78">
              Stories and photo journals for this destination will appear here soon.
            </p>
          </div>
        ) : null}
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] px-6 py-8 backdrop-blur-sm md:px-8">
            <p className="text-xs uppercase tracking-[0.32em] text-stone-300/55">
              Related essays
            </p>
            {relatedEssays.length > 0 ? (
              <div className="mt-6 space-y-4">
                {relatedEssays.slice(0, 3).map((essay) => (
                  <Link
                    key={essay._id}
                    href={essay.slug ? `/journal/${essay.slug}` : "/journal"}
                    className="block rounded-[1.25rem] border border-white/8 bg-stone-950/25 p-4 transition-colors duration-300 hover:bg-white/6"
                  >
                    <p className="text-[0.68rem] uppercase tracking-[0.28em] text-stone-300/55">
                      {essay.category?.regionLabel || essay.category?.title || "Journal"}
                    </p>
                    <p className="mt-2 font-serif text-xl text-stone-50">
                      {essay.title}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-stone-200/72">
                      {essay.excerpt || "A companion story from the same destination."}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState
                eyebrow="Related essays"
                title="No essays linked to this destination yet."
                description="Once essays are assigned to this destination in Sanity, they will appear here automatically."
                actionLabel="Browse Journal"
                actionHref="/journal"
              />
            )}
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] px-6 py-8 backdrop-blur-sm md:px-8">
            <p className="text-xs uppercase tracking-[0.32em] text-stone-300/55">
              Related photo journals
            </p>
            {relatedJournals.length > 0 ? (
              <div className="mt-6 space-y-4">
                {relatedJournals.slice(0, 3).map((journal) => (
                  <Link
                    key={journal._id}
                    href="/gallery"
                    className="flex gap-4 rounded-[1.25rem] border border-white/8 bg-stone-950/25 p-4 transition-colors duration-300 hover:bg-white/6"
                  >
                    <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-[1rem] bg-stone-900">
                      {journal.coverImage ? (
                        <Image
                          src={resolveImageUrl(journal.coverImage, 800)}
                          alt={journal.coverImage.alt || journal.title}
                          fill
                          sizes="112px"
                          className="object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[0.68rem] uppercase tracking-[0.28em] text-stone-300/55">
                        {journal.category?.regionLabel ||
                          journal.category?.title ||
                          "Photo journal"}
                      </p>
                      <p className="mt-2 font-serif text-xl text-stone-50">
                        {journal.title}
                      </p>
                      <p className="mt-2 text-sm leading-7 text-stone-200/72">
                        {journal.excerpt || "A visual companion to this destination."}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState
                eyebrow="Related photo journals"
                title="No photo journal linked yet."
                description="Once a photo journal is assigned to this destination, the gallery connection will show up here."
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
