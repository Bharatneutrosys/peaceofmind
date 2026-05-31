import {
  ArrowRight,
  MapPin,
  Play,
  Sparkles,
} from "lucide-react";
import Hero from "@/components/Hero";
import EditorialEssay, {
  type EditorialEssayData,
} from "@/components/EditorialEssay";
import MasonryGallery, {
  type SanityPhoto,
} from "@/components/MasonryGallery";
import AuthorProfile from "@/components/AuthorProfile";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import {
  getCategoriesQuery,
  getDestinationsQuery,
  getEssaysQuery,
  getFeaturedVideoQuery,
  getFeaturedEssaysQuery,
  getFeaturedPhotoJournalsQuery,
  getPhotoJournalsQuery,
  getSiteSettingsQuery,
} from "@/sanity/lib/queries";

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
  subtitle?: string | null;
  tagline?: string | null;
  shortDescription?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  youtubeUrl?: string | null;
  contactEmail?: string | null;
  authorDisplayName?: string | null;
  authorBio?: string | null;
  authorImage?: ImageField | null;
  heroImage?: ImageField | null;
  heroHeadline?: string | null;
  heroSubheading?: string | null;
  youtubeFeatureTitle?: string | null;
  youtubeFeatureDescription?: string | null;
  youtubeFeatureUrl?: string | null;
};

type CategoryRecord = {
  _id: string;
  title: string;
  slug?: string | null;
  description?: string | null;
  regionLabel?: string | null;
  featured?: boolean | null;
  order?: number | null;
  coverImage?: ImageField | null;
};

type EssayRecord = EditorialEssayData & {
  _id: string;
  slug?: string | null;
  excerpt?: string | null;
  featured?: boolean | null;
  estimatedReadTime?: string | null;
  tags?: string[] | null;
  publishedAt?: string | null;
  coverImage?: ImageField | null;
  category?: CategoryRecord | null;
};

type PhotoJournalRecord = {
  _id: string;
  title: string;
  excerpt?: string | null;
  destination?: string | null;
  coverImage?: ImageField | null;
  gallery?: SanityPhoto[] | null;
  featuredVideoUrl?: string | null;
  featured?: boolean | null;
  tags?: string[] | null;
  publishedAt?: string | null;
  category?: CategoryRecord | null;
};

type DestinationRecord = {
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
  category?: CategoryRecord | null;
};

type VideoRecord = {
  _id: string;
  title: string;
  description?: string | null;
  youtubeUrl?: string | null;
  slug?: string | null;
  thumbnail?: ImageField | null;
  destination?: { _id: string; title: string; slug?: string | null } | null;
  category?: { _id: string; title: string; slug?: string | null } | null;
  publishedAt?: string | null;
};

async function safeFetch<T>(
  label: string,
  loader: () => Promise<T>,
  fallback: T,
): Promise<T> {
  try {
    return await loader();
  } catch (error) {
    console.error(`[home:${label}]`, error);
    return fallback;
  }
}

function resolveImageUrl(image?: ImageField | null, width = 2400) {
  if (!image) return "";

  if (image.asset?._ref || image.asset?._id) {
    try {
      return urlFor(image).width(width).quality(92).url();
    } catch {
      return image.asset?.url ?? "";
    }
  }

  return image.asset?.url ?? "";
}

function buildGalleryPhotos(journals: PhotoJournalRecord[]): SanityPhoto[] {
  return journals.flatMap((journal) => {
    const gallery = (journal.gallery ?? []).filter(
      (photo): photo is SanityPhoto => Boolean(photo?.asset?.url),
    );

    if (gallery.length) {
      return gallery.map((photo, index) => ({
        ...photo,
        _key: photo._key || `${journal._id}-gallery-${index}`,
      }));
    }

    if (journal.coverImage?.asset?.url) {
      return [
        {
          _key: `${journal._id}-cover`,
          asset: journal.coverImage.asset,
          alt: journal.coverImage.alt || journal.title,
          caption:
            journal.coverImage.caption || journal.destination || journal.title,
        },
      ];
    }

    return [];
  });
}

function formatMonth(date?: string | null) {
  if (!date) return "Recent";

  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  } catch {
    return "Recent";
  }
}

function socialItems(settings?: SiteSettings | null) {
  return [
    settings?.facebookUrl
      ? { label: "Facebook", href: settings.facebookUrl }
      : null,
    settings?.instagramUrl
      ? { label: "Instagram", href: settings.instagramUrl }
      : null,
    settings?.youtubeUrl ? { label: "YouTube", href: settings.youtubeUrl } : null,
  ].filter(Boolean) as Array<{ label: string; href: string }>;
}

export default async function Home() {
  const [siteSettings, categories, allEssays, featuredEssays, allJournals, featuredJournals, destinations, featuredVideo] =
    await Promise.all([
      safeFetch("siteSettings", () => client.fetch<SiteSettings | null>(getSiteSettingsQuery), null),
      safeFetch("categories", () => client.fetch<CategoryRecord[]>(getCategoriesQuery), []),
      safeFetch("essays", () => client.fetch<EssayRecord[]>(getEssaysQuery), []),
      safeFetch("featuredEssays", () => client.fetch<EssayRecord[]>(getFeaturedEssaysQuery), []),
      safeFetch("photoJournals", () => client.fetch<PhotoJournalRecord[]>(getPhotoJournalsQuery), []),
      safeFetch("featuredJournals", () => client.fetch<PhotoJournalRecord[]>(getFeaturedPhotoJournalsQuery), []),
      safeFetch("destinations", () => client.fetch<DestinationRecord[]>(getDestinationsQuery), []),
      safeFetch("featuredVideo", () => client.fetch<VideoRecord | null>(getFeaturedVideoQuery), null),
    ]);

  const brandName = siteSettings?.brandName || "Traveller's Diary";
  const heroImage =
    resolveImageUrl(siteSettings?.heroImage) ||
    resolveImageUrl(featuredJournals[0]?.coverImage) ||
    resolveImageUrl(featuredEssays[0]?.coverImage) ||
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=3200&auto=format&fit=crop";

  const latestEssay = featuredEssays[0] ?? allEssays[0] ?? null;
  const latestJournal = featuredJournals[0] ?? allJournals[0] ?? null;
  const galleryPhotos = buildGalleryPhotos(allJournals);
  const heroLocation =
    latestJournal?.destination ||
    latestEssay?.destination ||
    destinations[0]?.title ||
    "Far Western Nepal";

  const storyCount = allEssays.length + allJournals.length;
  const featuredMonth = formatMonth(latestEssay?.date);
  const socialLinks = socialItems(siteSettings);
  const siteFeaturedVideo = siteSettings?.youtubeFeatureUrl
    ? {
        _id: "site-settings-featured-video",
        title:
          siteSettings.youtubeFeatureTitle ||
          "A cinematic frame reserved for future travel films.",
        description:
          siteSettings.youtubeFeatureDescription ||
          "A space reserved for future travel films and route stories from the official channel.",
        youtubeUrl: siteSettings.youtubeFeatureUrl,
        thumbnail:
          siteSettings.heroImage ||
          featuredJournals[0]?.coverImage ||
          latestJournal?.coverImage ||
          null,
        destination: null,
        category: null,
      }
    : null;
  const featuredVideoSource = featuredVideo || siteFeaturedVideo || (latestJournal?.featuredVideoUrl
    ? {
        _id: latestJournal._id,
        title: latestJournal.title,
        description: latestJournal.excerpt || "A visual story from the road.",
        youtubeUrl: latestJournal.featuredVideoUrl,
        thumbnail: latestJournal.coverImage,
        destination: latestJournal.destination ? { _id: latestJournal._id, title: latestJournal.destination } : null,
        category: latestJournal.category
          ? { _id: latestJournal.category._id, title: latestJournal.category.title, slug: latestJournal.category.slug || undefined }
          : null,
      }
    : null);

  const categoryCards: CategoryRecord[] = [
    {
      _id: "nepal",
      title: "Nepal",
      description: "Mountain roads, local journeys, and the landscapes closest to home.",
    },
    {
      _id: "south-asia",
      title: "South Asia",
      description: "Neighboring routes, border towns, culture, and movement across the region.",
    },
    {
      _id: "europe",
      title: "Europe",
      description: "Future city escapes, rail journeys, and long-form destination essays.",
    },
    {
      _id: "more-coming-soon",
      title: "More coming soon",
      description: "Ready to expand from the Sanity admin panel as the archive grows.",
    },
  ];

  const liveCategories: CategoryRecord[] = categories.length > 0 ? categories : categoryCards;

  const destinationsWithCounts = destinations.map((destination) => {
    const categoryTitle = destination.category?.title || destination.region || null;
    const relatedEssays = allEssays.filter((essay) =>
      Boolean(
        essay.destination === destination.title ||
          (categoryTitle && essay.category?.title === categoryTitle),
      ),
    ).length;
    const relatedJournals = allJournals.filter((journal) =>
      Boolean(
        journal.destination === destination.title ||
          (categoryTitle && journal.category?.title === categoryTitle),
      ),
    ).length;

    return {
      ...destination,
      relatedEssays,
      relatedJournals,
      image: resolveImageUrl(destination.coverImage, 1200),
    };
  });

  return (
    <main className="flex min-h-screen flex-col overflow-x-hidden bg-transparent">
      <Hero
        brandName={brandName}
        image={{
          src: heroImage,
          alt:
            siteSettings?.heroHeadline ||
            latestEssay?.title ||
            latestJournal?.title ||
            "A panoramic Himalayan landscape in Nepal",
        }}
        eyebrow={
          siteSettings?.subtitle ||
          siteSettings?.tagline ||
          "Born in the hills of Far Western Nepal"
        }
        headline={
          siteSettings?.heroHeadline ||
          "A cinematic travel diary shaped by mountain roads, long horizons, and quiet discovery."
        }
        subheading={
          siteSettings?.heroSubheading ||
          siteSettings?.shortDescription ||
          "Stories from Nepal and beyond, told with the patience of a travel notebook and the polish of an editorial brand."
        }
        location={heroLocation}
        season={latestEssay?.date ? featuredMonth : "Nepal • South Asia • Beyond"}
        metrics={[
          { label: "Stories", value: String(allEssays.length).padStart(2, "0") },
          { label: "Frames", value: String(galleryPhotos.length).padStart(2, "0") },
          { label: "Routes", value: String(destinations.length).padStart(2, "0") },
        ]}
      />

      <section
        id="destinations"
        className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12"
      >
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="flex items-center gap-2 text-xs uppercase tracking-[0.32em] text-stone-300/55">
              <MapPin className="h-3.5 w-3.5 text-amber-100" />
              Destination categories
            </p>
            <h2 className="mt-4 font-serif text-3xl leading-tight text-stone-50 md:text-5xl">
              The archive is being built as a map of places, not just a feed.
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-stone-200/68">
            Nepal, South Asia, Europe, and future categories can expand from the
            Sanity admin as the brand grows.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {liveCategories.map((category) => (
            <article
              key={category._id || category.title}
              className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.16)] backdrop-blur-sm"
            >
              <p className="text-[0.68rem] uppercase tracking-[0.28em] text-stone-300/55">
                {category.regionLabel || category.title}
              </p>
              <h3 className="mt-3 font-serif text-2xl text-stone-50">
                {category.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-stone-200/74">
                {"description" in category && category.description
                  ? category.description
                  : "A category ready to grow with the archive."}
              </p>
              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[0.68rem] uppercase tracking-[0.24em] text-stone-200/70">
                <Sparkles className="h-3.5 w-3.5 text-amber-100" />
                Future routes
              </div>
            </article>
          ))}
        </div>

        {destinationsWithCounts.length > 0 ? (
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {destinationsWithCounts.map((destination) => (
              <article
                key={destination._id}
                className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.03] shadow-[0_16px_40px_rgba(0,0,0,0.16)]"
              >
                <div className="relative aspect-[16/10] bg-stone-950/40">
                  {destination.image ? (
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url("${destination.image}")` }}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_35%)]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/24 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-[0.68rem] uppercase tracking-[0.28em] text-stone-200/55">
                      {destination.category?.title || destination.region || "Destination"}
                    </p>
                    <h3 className="mt-2 font-serif text-2xl text-stone-50">
                      {destination.title}
                    </h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm leading-7 text-stone-200/76">
                    {destination.shortIntro ||
                      destination.description ||
                      "A destination note ready to deepen as more stories are added."}
                  </p>
                  <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-[1rem] border border-white/8 bg-stone-950/30 px-4 py-3">
                      <p className="text-[0.65rem] uppercase tracking-[0.28em] text-stone-300/50">
                        Essays
                      </p>
                      <p className="mt-2 text-lg text-stone-50">
                        {String(destination.relatedEssays).padStart(2, "0")}
                      </p>
                    </div>
                    <div className="rounded-[1rem] border border-white/8 bg-stone-950/30 px-4 py-3">
                      <p className="text-[0.65rem] uppercase tracking-[0.28em] text-stone-300/50">
                        Frames
                      </p>
                      <p className="mt-2 text-lg text-stone-50">
                        {String(destination.relatedJournals).padStart(2, "0")}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-white/5 px-6 py-10 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.32em] text-stone-300/55">
              No live destinations yet
            </p>
            <p className="mt-4 max-w-2xl text-base leading-8 text-stone-200/76">
              The category system is ready for future routes from the Sanity
              admin, and the homepage still reads as a finished editorial page
              even before the archive fills out.
            </p>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 sm:px-8 lg:px-12">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] px-6 py-8 backdrop-blur-sm md:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-stone-300/55">
                Featured journal entry
              </p>
              <h2 className="mt-4 font-serif text-3xl leading-tight text-stone-50 md:text-4xl">
                Recent writing from the road
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-stone-200/68">
              {storyCount > 0
                ? `${storyCount} live pieces currently published across essays and photo journals.`
                : "The journal is waiting for its first long-form story, and the layout is ready for it."}
            </p>
          </div>

          <div className="mt-8">
            <EditorialEssay essay={latestEssay} />
          </div>
        </div>
      </section>

      <section id="gallery" className="scroll-mt-28">
        <MasonryGallery photos={galleryPhotos} />
      </section>

      <section
        id="videos"
        className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12"
      >
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="flex items-center gap-2 text-xs uppercase tracking-[0.32em] text-stone-300/55">
              <Play className="h-3.5 w-3.5 text-amber-100" />
              YouTube feature
            </p>
            <h2 className="mt-4 font-serif text-3xl leading-tight text-stone-50 md:text-5xl">
              {siteSettings?.youtubeFeatureTitle ||
                "A cinematic frame reserved for future travel films."}
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-stone-200/68">
            {siteSettings?.youtubeFeatureDescription ||
              "This space is ready for an embedded YouTube player later, without changing the structure of the homepage."}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(17rem,0.65fr)]">
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] shadow-[0_24px_90px_rgba(0,0,0,0.22)]">
            <div className="relative aspect-video bg-stone-950/50">
              {featuredVideoSource?.thumbnail ? (
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url("${resolveImageUrl(featuredVideoSource.thumbnail, 1800)}")`,
                  }}
                />
              ) : null}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.14),_transparent_28%)]" />
              <div className="absolute inset-0 bg-gradient-to-br from-stone-950/30 via-transparent to-stone-950/70" />
              <div className="absolute inset-4 rounded-[1.5rem] border border-white/10 bg-white/[0.03] backdrop-blur-sm">
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <span className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-white/12 bg-white/8 text-stone-50">
                      <Play className="h-6 w-6 fill-stone-50" />
                    </span>
                    <p className="mt-5 text-xs uppercase tracking-[0.32em] text-stone-200/55">
                      YouTube ready
                    </p>
                    <p className="mt-3 font-serif text-2xl text-stone-50">
                      {featuredVideoSource?.title ||
                        "Travel films, soon."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.32em] text-stone-300/55">
              Future embed
            </p>
            <p className="mt-4 text-sm leading-7 text-stone-200/76">
              {featuredVideoSource?.description ||
                siteFeaturedVideo?.description ||
                "A YouTube URL can be connected here later from the Sanity admin or replaced with a live iframe when the channel is ready."}
            </p>
            {featuredVideoSource?.youtubeUrl ? (
              <a
                href={featuredVideoSource.youtubeUrl}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-stone-50 px-5 py-3 text-sm font-medium text-stone-950 transition-transform duration-300 hover:-translate-y-0.5"
                target="_blank"
                rel="noreferrer"
              >
                Watch on YouTube
                <ArrowRight className="h-4 w-4" />
              </a>
            ) : (
              <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-stone-50 px-5 py-3 text-sm font-medium text-stone-950/60">
                Watch on YouTube
                <ArrowRight className="h-4 w-4" />
              </span>
            )}

            <div className="mt-8 space-y-3">
              {socialLinks.length > 0 ? (
                socialLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex items-center justify-between rounded-[1rem] border border-white/8 bg-stone-950/25 px-4 py-3 text-sm text-stone-200/82 transition-colors duration-300 hover:bg-white/6"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="inline-flex items-center gap-2">
                      {item.label}
                    </span>
                    <ArrowRight className="h-4 w-4 text-stone-300/50" />
                  </a>
                ))
              ) : (
                ["Facebook", "Instagram", "YouTube"].map((label) => (
                  <div
                    key={label}
                    className="flex items-center justify-between rounded-[1rem] border border-white/8 bg-stone-950/25 px-4 py-3 text-sm text-stone-500"
                  >
                    <span>{label}</span>
                    <span className="text-[0.68rem] uppercase tracking-[0.24em] text-stone-500">
                      Pending
                    </span>
                  </div>
                ))
              )}
            </div>
          </aside>
        </div>
      </section>

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
        socialLinks={{
          facebookUrl: siteSettings?.facebookUrl || null,
          instagramUrl: siteSettings?.instagramUrl || null,
          youtubeUrl: siteSettings?.youtubeUrl || null,
        }}
      />

      <section className="mx-auto max-w-7xl px-6 pb-24 sm:px-8 lg:px-12">
        <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] px-6 py-10 backdrop-blur-sm md:px-8 md:py-12">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(16rem,0.7fr)] lg:items-center">
            <div>
              <p className="flex items-center gap-2 text-xs uppercase tracking-[0.32em] text-stone-300/55">
                <Sparkles className="h-3.5 w-3.5 text-amber-100" />
                Follow the diary
              </p>
              <h2 className="mt-4 font-serif text-3xl leading-tight text-stone-50 md:text-5xl">
                Stay close to the next story, the next route, and the next frame.
              </h2>
              <p className="mt-4 max-w-2xl text-pretty text-base leading-8 text-stone-200/76">
                Built for readers who want the travel diary, the photos, and the
                future video stories in one elegant place.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 lg:justify-end">
              {socialLinks.length > 0 ? (
                socialLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-5 py-3 text-sm font-medium text-stone-50 backdrop-blur-md transition-colors duration-300 hover:bg-white/12"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {item.label}
                  </a>
                ))
              ) : (
                ["Facebook", "Instagram", "YouTube"].map((label) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-5 py-3 text-sm font-medium text-stone-50/60"
                  >
                    {label}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
