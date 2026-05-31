import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import PageHeader from "@/components/PageHeader";
import { client } from "@/sanity/lib/client";
import {
  getAllCategoriesQuery,
  getAllDestinationsQuery,
} from "@/sanity/lib/queries";
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

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Destinations | Traveller's Diary",
    description:
      "Browse destinations, categories, and future travel routes from Traveller's Diary.",
  };
}

function groupKey(destination: DestinationRecord) {
  return (
    destination.category?.title ||
    destination.region ||
    destination.country ||
    "Unsorted"
  );
}

export default async function DestinationsPage() {
  const [categories, destinations] = await Promise.all([
    client.fetch<CategoryRecord[]>(getAllCategoriesQuery).catch(() => []),
    client.fetch<DestinationRecord[]>(getAllDestinationsQuery).catch(() => []),
  ]);

  const fallbackCategories: CategoryRecord[] = [
    {
      _id: "fallback-nepal",
      title: "Nepal",
      description: "Home routes, mountain roads, and the places closest to the diary.",
      regionLabel: "Nepal",
    },
    {
      _id: "fallback-south-asia",
      title: "South Asia",
      description: "Regional journeys across borders, cultures, and quieter movement.",
      regionLabel: "South Asia",
    },
    {
      _id: "fallback-europe",
      title: "Europe",
      description: "Future train routes, city chapters, and long-form destination notes.",
      regionLabel: "Europe",
    },
  ];

  const visibleCategories = categories.length > 0 ? categories : fallbackCategories;
  const groupedDestinations = visibleCategories.map((category) => ({
    category,
    items: destinations.filter((destination) => {
      const key = groupKey(destination).toLowerCase();
      return key === category.title.toLowerCase() || key === (category.regionLabel || "").toLowerCase();
    }),
  }));

  const ungrouped = destinations.filter((destination) => {
    const key = groupKey(destination).toLowerCase();
    return !visibleCategories.some((category) =>
      key === category.title.toLowerCase() ||
      key === (category.regionLabel || "").toLowerCase(),
    );
  });

  return (
    <main className="min-h-screen">
      <PageHeader
        eyebrow="Destinations"
        title="A map of places, from Nepal outward."
        description="Traveller’s Diary is designed to grow into a destination archive where category, region, and story can sit together with a quiet editorial rhythm."
        action={
          <Link
            href="/journal"
            className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-5 py-3 text-sm font-medium text-stone-50 backdrop-blur-md transition-colors duration-300 hover:bg-white/12"
          >
            Explore Journal
            <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />

      <section className="mx-auto max-w-7xl px-6 pb-10 sm:px-8 lg:px-12">
        <div className="grid gap-4 md:grid-cols-3">
          {visibleCategories.map((category) => (
            <article
              key={category._id}
              className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.04] shadow-[0_16px_40px_rgba(0,0,0,0.16)]"
            >
              <div className="relative aspect-[16/10] bg-stone-950/40">
                {category.coverImage ? (
                  <Image
                    src={resolveImageUrl(category.coverImage, 1200)}
                    alt={category.coverImage.alt || category.title}
                    fill
                    sizes="(min-width: 1280px) 33vw, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.14),_transparent_35%)]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/16 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-[0.68rem] uppercase tracking-[0.28em] text-stone-200/55">
                    {category.regionLabel || category.title}
                  </p>
                  <h2 className="mt-2 font-serif text-2xl text-stone-50">
                    {category.title}
                  </h2>
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm leading-7 text-stone-200/76">
                  {category.description || "A category ready for future destinations."}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 sm:px-8 lg:px-12">
        {destinations.length > 0 ? (
          <div className="space-y-12">
            {groupedDestinations
              .filter((group) => group.items.length > 0)
              .map((group) => (
                <section key={group.category._id} className="space-y-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.32em] text-stone-300/55">
                        {group.category.regionLabel || group.category.title}
                      </p>
                      <h2 className="mt-3 font-serif text-3xl leading-tight text-stone-50 md:text-4xl">
                        {group.category.title}
                      </h2>
                    </div>
                    <p className="max-w-2xl text-sm leading-7 text-stone-200/68">
                      {group.category.description ||
                        "A small selection of destinations ready for future stories and route notes."}
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {group.items.map((destination) => {
                      const href = destination.slug
                        ? `/destinations/${destination.slug}`
                        : "/destinations";

                      return (
                        <Link
                          key={destination._id}
                          href={href}
                          className="group overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.04] shadow-[0_16px_40px_rgba(0,0,0,0.16)] transition-transform duration-300 hover:-translate-y-1"
                        >
                          <div className="relative aspect-[16/10] bg-stone-950/40">
                            {destination.coverImage ? (
                              <Image
                                src={resolveImageUrl(destination.coverImage, 1400)}
                                alt={destination.coverImage.alt || destination.title}
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
                                {destination.category?.title ||
                                  destination.region ||
                                  destination.country ||
                                  "Destination"}
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
                                "A destination note ready for future stories."}
                            </p>
                            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-2 text-[0.68rem] uppercase tracking-[0.24em] text-stone-200/70">
                              <MapPin className="h-3.5 w-3.5 text-amber-100" />
                              View destination
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </section>
              ))}

            {ungrouped.length > 0 ? (
              <section className="space-y-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.32em] text-stone-300/55">
                    More destinations
                  </p>
                  <h2 className="mt-3 font-serif text-3xl leading-tight text-stone-50 md:text-4xl">
                    Unsorted places
                  </h2>
                </div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {ungrouped.map((destination) => (
                    <Link
                      key={destination._id}
                      href={destination.slug ? `/destinations/${destination.slug}` : "/destinations"}
                      className="group overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.04] shadow-[0_16px_40px_rgba(0,0,0,0.16)] transition-transform duration-300 hover:-translate-y-1"
                    >
                      <div className="p-5">
                        <p className="text-[0.68rem] uppercase tracking-[0.28em] text-stone-300/55">
                          {destination.region || destination.country || "Destination"}
                        </p>
                        <h3 className="mt-3 font-serif text-2xl text-stone-50">
                          {destination.title}
                        </h3>
                        <p className="mt-3 text-sm leading-7 text-stone-200/76">
                          {destination.shortIntro ||
                            destination.description ||
                            "A destination note ready for future stories."}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        ) : (
          <EmptyState
            eyebrow="Destinations"
            title="The destination archive is ready."
            description="Nepal, South Asia, and Europe can be added from Sanity at any time, and the site will surface them without any redesign."
            actionLabel="Open Site Settings"
            actionHref="/studio"
          />
        )}
      </section>
    </main>
  );
}
