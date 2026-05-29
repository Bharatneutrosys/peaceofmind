import Link from "next/link";
import Hero from "@/components/Hero";
import EditorialEssay, {
  type EditorialEssayData,
} from "@/components/EditorialEssay";
import MasonryGallery, {
  type SanityPhoto,
} from "@/components/MasonryGallery";
import AuthorProfile from "@/components/AuthorProfile";
import { client } from "@/sanity/lib/client";
import {
  getDestinationsQuery,
  getEssaysQuery,
  getPhotoJournalsQuery,
} from "@/sanity/lib/queries";
import { ArrowRight, Compass, Sparkles } from "lucide-react";

export const revalidate = 60;

type SanityAsset = {
  _id?: string | null;
  url?: string | null;
};

type SanityImage = {
  asset?: SanityAsset | null;
  alt?: string | null;
  caption?: string | null;
};

type EssayRecord = EditorialEssayData & {
  _id: string;
  slug?: string | null;
};

type PhotoJournalRecord = {
  _id: string;
  title: string;
  destination?: string | null;
  coverImage?: SanityImage | null;
  gallery?: SanityPhoto[] | null;
};

type DestinationRecord = {
  _id: string;
  title: string;
  slug?: string | null;
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

function getImageSrc(image?: SanityImage | null) {
  return image?.asset?.url ?? "";
}

function buildGalleryPhotos(journals: PhotoJournalRecord[]): SanityPhoto[] {
  return journals.flatMap((journal) => {
    const gallery = (journal.gallery ?? [])
      .filter((photo): photo is SanityPhoto => Boolean(photo?.asset?.url));

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
          caption: journal.coverImage.caption || journal.destination || journal.title,
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
    getImageSrc(latestJournal?.coverImage) ||
    getImageSrc(latestEssay?.coverImage) ||
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2400&auto=format&fit=crop";

  const heroLocation =
    latestJournal?.destination ||
    latestEssay?.destination ||
    destinations[0]?.title ||
    "High country light";

  const destinationHighlights =
    destinations.length > 0
      ? destinations.slice(0, 4).map((destination) => {
          const essayCount = essays.filter(
            (essay) => essay.destination === destination.title,
          ).length;
          const journalCount = photoJournals.filter(
            (journal) => journal.destination === destination.title,
          ).length;

          return {
            ...destination,
            essayCount,
            journalCount,
            status:
              essayCount + journalCount > 0 ? "Active route" : "Open horizon",
          };
        })
      : [];

  const journeyCount = essays.length + photoJournals.length;
  const featuredMonth = formatMonth(latestEssay?.date);

  return (
    <main className="flex min-h-screen flex-col overflow-x-hidden bg-transparent">
      <Hero
        image={{ src: heroImage, alt: latestEssay?.title || latestJournal?.title || "Life of a Traveller" }}
        location={heroLocation}
        season={latestEssay?.date ? featuredMonth : "Quiet season"}
        metrics={[
          { label: "Stories", value: String(essays.length).padStart(2, "0") },
          {
            label: "Frames",
            value: String(galleryPhotos.length).padStart(2, "0"),
          },
          {
            label: "Routes",
            value: String(destinations.length).padStart(2, "0"),
          },
        ]}
      />

      <section
        id="destinations"
        className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12"
      >
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="flex items-center gap-2 text-xs uppercase tracking-[0.32em] text-stone-300/55">
              <Compass className="h-3.5 w-3.5 text-amber-100" />
              Destination highlights
            </p>
            <h2 className="mt-4 font-serif text-3xl leading-tight text-stone-50 md:text-5xl">
              Places with a pulse, a mood, and a memory.
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-stone-200/68">
            A compact index of the places shaping the archive, with the latest
            essays and journal entries surfaced first.
          </p>
        </div>

        {destinationHighlights.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {destinationHighlights.map((destination) => (
              <article
                key={destination._id}
                className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.16)] backdrop-blur-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[0.68rem] uppercase tracking-[0.28em] text-stone-300/55">
                      {destination.status}
                    </p>
                    <h3 className="mt-3 font-serif text-2xl text-stone-50">
                      {destination.title}
                    </h3>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[0.68rem] uppercase tracking-[0.24em] text-stone-200/70">
                    {destination.slug || "route"}
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-[1rem] border border-white/8 bg-stone-950/30 px-4 py-3">
                    <p className="text-[0.65rem] uppercase tracking-[0.28em] text-stone-300/50">
                      Essays
                    </p>
                    <p className="mt-2 text-lg text-stone-50">
                      {String(destination.essayCount).padStart(2, "0")}
                    </p>
                  </div>
                  <div className="rounded-[1rem] border border-white/8 bg-stone-950/30 px-4 py-3">
                    <p className="text-[0.65rem] uppercase tracking-[0.28em] text-stone-300/50">
                      Frames
                    </p>
                    <p className="mt-2 text-lg text-stone-50">
                      {String(destination.journalCount).padStart(2, "0")}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 px-6 py-10 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.32em] text-stone-300/55">
              No destinations yet
            </p>
            <p className="mt-4 max-w-2xl text-base leading-8 text-stone-200/76">
              The destination index will appear here as soon as the archive is
              populated. The rest of the homepage remains active so the site
              still feels complete.
            </p>
            <Link
              href="#journal"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-stone-50 px-5 py-3 text-sm font-medium text-stone-950 transition-transform duration-300 hover:-translate-y-0.5"
            >
              Read the first essay
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </section>

      <EditorialEssay essay={latestEssay} />

      <section className="mx-auto max-w-7xl px-6 pb-24 sm:px-8 lg:px-12">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] px-6 py-8 backdrop-blur-sm md:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-stone-300/55">
                Archive
              </p>
              <h2 className="mt-4 font-serif text-3xl leading-tight text-stone-50 md:text-4xl">
                Recent entries and routes
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-stone-200/68">
              {journeyCount > 0
                ? `${journeyCount} pieces currently live across essays and photo journals.`
                : "The archive is still quiet, but the page remains composed and readable."}
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {essays.length > 0 ? (
              essays.slice(0, 3).map((essay) => (
                <article
                  key={essay._id}
                  className="rounded-[1.4rem] border border-white/10 bg-stone-950/30 p-5"
                >
                  <p className="text-[0.68rem] uppercase tracking-[0.28em] text-stone-300/55">
                    {formatMonth(essay.date)}
                  </p>
                  <h3 className="mt-3 font-serif text-2xl leading-tight text-stone-50">
                    {essay.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-stone-200/72">
                    {essay.destination
                      ? `Written from ${essay.destination}.`
                      : "A reflective dispatch from the archive."}
                  </p>
                </article>
              ))
            ) : (
              <article className="rounded-[1.4rem] border border-white/10 bg-stone-950/30 p-5 text-stone-200/72">
                No essays have been published yet.
              </article>
            )}
          </div>
        </div>
      </section>

      <section id="gallery" className="scroll-mt-28">
        <MasonryGallery photos={galleryPhotos} />
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
                Receive the next dispatch when the road opens again.
              </h2>
              <p className="mt-4 max-w-2xl text-pretty text-base leading-8 text-stone-200/76">
                A restrained newsletter-style closing for readers who want the
                next story, the next gallery, and the next quiet route without
                noise.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 lg:justify-end">
              <a
                href="mailto:hello@lifeofatraveller.com"
                className="inline-flex items-center gap-2 rounded-full bg-stone-50 px-5 py-3 text-sm font-medium text-stone-950 transition-transform duration-300 hover:-translate-y-0.5"
              >
                Subscribe by email
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href="#top"
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-5 py-3 text-sm font-medium text-stone-50 backdrop-blur-md transition-colors duration-300 hover:bg-white/12"
              >
                Back to top
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
