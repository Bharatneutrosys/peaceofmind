import Link from "next/link";
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
  getDestinationsQuery,
  getEssaysQuery,
  getPhotoJournalsQuery,
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

type EssayRecord = EditorialEssayData & {
  _id: string;
  slug?: string | null;
  coverImage?: ImageField | null;
};

type PhotoJournalRecord = {
  _id: string;
  title: string;
  destination?: string | null;
  coverImage?: ImageField | null;
  gallery?: SanityPhoto[] | null;
  featuredVideoUrl?: string | null;
};

type DestinationRecord = {
  _id: string;
  title: string;
  slug?: string | null;
  region?: string | null;
  description?: string | null;
  coverImage?: ImageField | null;
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

export default async function Home() {
  const [essays, photoJournals, destinations] = await Promise.all([
    safeFetch("essays", () => client.fetch<EssayRecord[]>(getEssaysQuery), []),
    safeFetch(
      "photoJournals",
      () => client.fetch<PhotoJournalRecord[]>(getPhotoJournalsQuery),
      [],
    ),
    safeFetch(
      "destinations",
      () => client.fetch<DestinationRecord[]>(getDestinationsQuery),
      [],
    ),
  ]);

  const latestEssay = essays[0] ?? null;
  const latestJournal = photoJournals[0] ?? null;
  const galleryPhotos = buildGalleryPhotos(photoJournals);
  const heroImage =
    resolveImageUrl(latestJournal?.coverImage) ||
    resolveImageUrl(latestEssay?.coverImage) ||
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=3200&auto=format&fit=crop";

  const heroLocation =
    latestJournal?.destination ||
    latestEssay?.destination ||
    destinations[0]?.title ||
    "Far Western Nepal";

  const storyCount = essays.length + photoJournals.length;
  const featuredMonth = formatMonth(latestEssay?.date);

  const categoryCards = [
    {
      title: "Nepal",
      description: "Mountain roads, local journeys, and the landscapes closest to home.",
    },
    {
      title: "South Asia",
      description: "Neighboring routes, border towns, culture, and movement across the region.",
    },
    {
      title: "Europe",
      description: "Future city escapes, rail journeys, and long-form destination essays.",
    },
    {
      title: "More coming soon",
      description: "Expandable from the Sanity admin panel as the archive grows.",
    },
  ];

  const liveDestinations = destinations.map((destination) => {
    const relatedEssays = essays.filter(
      (essay) =>
        essay.destination === destination.title ||
        (destination.region && essay.destination?.includes(destination.region)),
    ).length;
    const relatedJournals = photoJournals.filter(
      (journal) =>
        journal.destination === destination.title ||
        (destination.region && journal.destination?.includes(destination.region)),
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
        image={{
          src: heroImage,
          alt:
            latestEssay?.title ||
            latestJournal?.title ||
            "A panoramic Himalayan landscape in Nepal",
        }}
        location={heroLocation}
        season={latestEssay?.date ? featuredMonth : "Nepal • South Asia • Beyond"}
        metrics={[
          { label: "Stories", value: String(essays.length).padStart(2, "0") },
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
              The archive is being built as a map, not just a feed.
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-stone-200/68">
            Nepal, South Asia, Europe, and future categories can expand from the
            Sanity admin as the brand grows.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {categoryCards.map((card) => (
            <article
              key={card.title}
              className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.16)] backdrop-blur-sm"
            >
              <p className="text-[0.68rem] uppercase tracking-[0.28em] text-stone-300/55">
                Category
              </p>
              <h3 className="mt-3 font-serif text-2xl text-stone-50">
                {card.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-stone-200/74">
                {card.description}
              </p>
              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[0.68rem] uppercase tracking-[0.24em] text-stone-200/70">
                <Sparkles className="h-3.5 w-3.5 text-amber-100" />
                Admin expandable
              </div>
            </article>
          ))}
        </div>

        {liveDestinations.length > 0 ? (
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {liveDestinations.map((destination) => (
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
                      {destination.region || "Destination"}
                    </p>
                    <h3 className="mt-2 font-serif text-2xl text-stone-50">
                      {destination.title}
                    </h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm leading-7 text-stone-200/76">
                    {destination.description ||
                      "A destination note ready to expand as the archive grows."}
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
              even before the archive fills in.
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
                : "The journal is empty for now, but the layout is already ready for the next story."}
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
              A cinematic frame reserved for future travel films.
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-stone-200/68">
            This space is ready for an embedded YouTube player later, without
            changing the structure of the homepage.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(17rem,0.65fr)]">
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] shadow-[0_24px_90px_rgba(0,0,0,0.22)]">
            <div className="relative aspect-video bg-stone-950/50">
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
                      Travel films, soon.
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
              A YouTube URL can be connected here later from the Sanity admin or
              replaced with a live iframe when the channel is ready.
            </p>
            <Link
              href="#"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-stone-50 px-5 py-3 text-sm font-medium text-stone-950 transition-transform duration-300 hover:-translate-y-0.5"
            >
              Watch on YouTube
              <ArrowRight className="h-4 w-4" />
            </Link>

            <div className="mt-8 space-y-3">
            {[
                { label: "Facebook" },
                { label: "Instagram" },
                { label: "YouTube" },
              ].map(({ label }) => (
                <a
                  key={label}
                  href="#"
                  className="flex items-center justify-between rounded-[1rem] border border-white/8 bg-stone-950/25 px-4 py-3 text-sm text-stone-200/82 transition-colors duration-300 hover:bg-white/6"
                >
                  <span className="inline-flex items-center gap-2">
                    {label}
                  </span>
                  <ArrowRight className="h-4 w-4 text-stone-300/50" />
                </a>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <AuthorProfile />

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
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-full bg-stone-50 px-5 py-3 text-sm font-medium text-stone-950 transition-transform duration-300 hover:-translate-y-0.5"
              >
                Facebook
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-5 py-3 text-sm font-medium text-stone-50 backdrop-blur-md transition-colors duration-300 hover:bg-white/12"
              >
                Instagram
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-5 py-3 text-sm font-medium text-stone-50 backdrop-blur-md transition-colors duration-300 hover:bg-white/12"
              >
                YouTube
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
