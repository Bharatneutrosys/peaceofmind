import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { client } from "@/sanity/lib/client";
import {
  getAllCategoriesQuery,
  getAllDestinationsQuery,
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
  parentDestination?: {
    _id: string;
    title?: string | null;
    slug?: string | null;
    country?: string | null;
  } | null;
};

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Destinations | Traveller's Diary",
    description:
      "Browse destinations, categories, and future travel routes from Traveller's Diary.",
    path: "/destinations",
    siteName: "Traveller's Diary",
  });
}

const fallbackCategories: CategoryRecord[] = [
  {
    _id: "fallback-nepal",
    title: "Nepal",
    slug: "nepal",
    description: "Home routes, mountain roads, and places closest to the diary.",
    regionLabel: "Nepal",
  },
  {
    _id: "fallback-south-asia",
    title: "South Asia",
    slug: "south-asia",
    description: "Future regional journeys across borders and cultures.",
    regionLabel: "South Asia",
  },
  {
    _id: "fallback-europe",
    title: "Europe",
    slug: "europe",
    description: "Future train routes, city chapters, and destination notes.",
    regionLabel: "Europe",
  },
];

const fallbackDestinations: DestinationRecord[] = [
  {
    _id: "fallback-destination-nepal",
    title: "Nepal",
    slug: "nepal",
    country: "Nepal",
    shortIntro: "A sample parent place for mountain routes and future stories.",
    category: fallbackCategories[0],
  },
  {
    _id: "fallback-destination-pokhara",
    title: "Pokhara",
    slug: "pokhara",
    country: "Nepal",
    shortIntro: "A sample child place under Nepal.",
    category: fallbackCategories[0],
    parentDestination: { _id: "fallback-destination-nepal", title: "Nepal", slug: "nepal" },
  },
  {
    _id: "fallback-destination-annapurna-base-camp",
    title: "Annapurna Base Camp",
    slug: "annapurna-base-camp",
    country: "Nepal",
    shortIntro: "A sample trekking route under Pokhara.",
    category: fallbackCategories[0],
    parentDestination: { _id: "fallback-destination-pokhara", title: "Pokhara", slug: "pokhara" },
  },
  {
    _id: "fallback-destination-everest-base-camp",
    title: "Everest Base Camp",
    slug: "everest-base-camp",
    country: "Nepal",
    shortIntro: "A sample mountain route under Nepal.",
    category: fallbackCategories[0],
    parentDestination: { _id: "fallback-destination-nepal", title: "Nepal", slug: "nepal" },
  },
  {
    _id: "fallback-destination-europe",
    title: "Europe",
    slug: "europe",
    shortIntro: "A sample parent place for future Europe notes.",
    category: fallbackCategories[2],
  },
  {
    _id: "fallback-destination-belgium",
    title: "Belgium",
    slug: "belgium",
    country: "Belgium",
    shortIntro: "A sample country under Europe.",
    category: fallbackCategories[2],
    parentDestination: { _id: "fallback-destination-europe", title: "Europe", slug: "europe" },
  },
  {
    _id: "fallback-destination-finland",
    title: "Finland",
    slug: "finland",
    country: "Finland",
    shortIntro: "A sample country under Europe.",
    category: fallbackCategories[2],
    parentDestination: { _id: "fallback-destination-europe", title: "Europe", slug: "europe" },
  },
  {
    _id: "fallback-destination-france",
    title: "France",
    slug: "france",
    country: "France",
    shortIntro: "A sample country under Europe.",
    category: fallbackCategories[2],
    parentDestination: { _id: "fallback-destination-europe", title: "Europe", slug: "europe" },
  },
  {
    _id: "fallback-destination-paris",
    title: "Paris",
    slug: "paris",
    country: "France",
    shortIntro: "A sample city under France.",
    category: fallbackCategories[2],
    parentDestination: { _id: "fallback-destination-france", title: "France", slug: "france" },
  },
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function categorySlug(category: CategoryRecord) {
  return category.slug || slugify(category.regionLabel || category.title);
}

function groupLabel(destination: DestinationRecord) {
  return (
    destination.category?.regionLabel ||
    destination.category?.title ||
    destination.region ||
    destination.country ||
    "Unsorted"
  );
}

function matchesCategory(destination: DestinationRecord, category: CategoryRecord) {
  const selected = categorySlug(category);
  return [
    destination.category?.slug,
    destination.category?.title,
    destination.category?.regionLabel,
    destination.region,
    destination.country,
  ]
    .filter(Boolean)
    .map((value) => slugify(String(value)))
    .includes(selected);
}

function buildChildMap(destinations: DestinationRecord[]) {
  const map = new Map<string, DestinationRecord[]>();

  destinations.forEach((destination) => {
    const parentId = destination.parentDestination?._id;
    if (!parentId) return;
    const children = map.get(parentId) || [];
    children.push(destination);
    map.set(parentId, children);
  });

  return map;
}

function DestinationNode({
  destination,
  childMap,
  level = 0,
}: {
  destination: DestinationRecord;
  childMap: Map<string, DestinationRecord[]>;
  level?: number;
}) {
  const children = childMap.get(destination._id) || [];
  const href = destination.slug ? `/destinations/${destination.slug}` : null;
  const image = resolveImageUrl(destination.coverImage, 1400);
  const content = (
    <>
      <div className="relative aspect-[16/10] bg-stone-950/40">
        {image ? (
          <Image
            src={image}
            alt={destination.coverImage?.alt || destination.title}
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
            {groupLabel(destination)}
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
          {children.length > 0 ? `${children.length} nested place${children.length === 1 ? "" : "s"}` : "View destination"}
        </div>
      </div>
    </>
  );

  return (
    <div>
      {href ? (
        <Link
          href={href}
          className="group block overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.04] shadow-[0_16px_40px_rgba(0,0,0,0.16)] transition-transform duration-300 hover:-translate-y-1"
        >
          {content}
        </Link>
      ) : (
        <article className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.04] shadow-[0_16px_40px_rgba(0,0,0,0.16)]">
          {content}
        </article>
      )}

      {children.length > 0 ? (
        <div className="mt-4 grid gap-4">
          {children.map((child) => (
            <DestinationNode
              key={child._id}
              destination={child}
              childMap={childMap}
              level={level + 1}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default async function DestinationsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: selectedCategory } = await searchParams;
  const [categories, destinations] = await Promise.all([
    client.fetch<CategoryRecord[]>(getAllCategoriesQuery).catch(() => []),
    client.fetch<DestinationRecord[]>(getAllDestinationsQuery).catch(() => []),
  ]);

  const visibleCategories = categories.length > 0 ? categories : fallbackCategories;
  const visibleDestinations =
    destinations.length > 0 ? destinations : fallbackDestinations;
  const filteredCategories = selectedCategory
    ? visibleCategories.filter((category) => categorySlug(category) === selectedCategory)
    : visibleCategories;
  const childMap = buildChildMap(visibleDestinations);

  const groupedDestinations = filteredCategories.map((category) => {
    const items = visibleDestinations.filter((destination) =>
      matchesCategory(destination, category),
    );

    return {
      category,
      items,
      roots: items.filter((destination) => !destination.parentDestination?._id),
    };
  });

  const groupedIds = new Set(groupedDestinations.flatMap((group) => group.items.map((item) => item._id)));
  const ungrouped = visibleDestinations.filter((destination) => !groupedIds.has(destination._id));
  const ungroupedRoots = ungrouped.filter((destination) => !destination.parentDestination?._id);

  return (
    <main className="min-h-screen">
      <PageHeader
        eyebrow="Destinations"
        title="A map of places, from Nepal outward."
        description="Browse regions, parent places, and smaller routes as the travel archive grows."
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
            <Link
              key={category._id}
              href={`/destinations?category=${categorySlug(category)}`}
              className="group overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.04] shadow-[0_16px_40px_rgba(0,0,0,0.16)] transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="relative aspect-[16/10] bg-stone-950/40">
                {category.coverImage ? (
                  <Image
                    src={resolveImageUrl(category.coverImage, 1200)}
                    alt={category.coverImage.alt || category.title}
                    fill
                    sizes="(min-width: 1280px) 33vw, 100vw"
                    className="object-cover transition duration-700 group-hover:scale-[1.03]"
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
                  {category.description || "Open this region to view related destinations."}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {selectedCategory ? (
          <div className="mt-5">
            <Link
              href="/destinations"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs uppercase tracking-[0.22em] text-stone-200/74 transition-colors hover:bg-white/12"
            >
              Show all destinations
            </Link>
          </div>
        ) : null}
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 sm:px-8 lg:px-12">
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
                      "Parent places and smaller routes are grouped together here."}
                  </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {group.roots.map((destination) => (
                    <DestinationNode
                      key={destination._id}
                      destination={destination}
                      childMap={childMap}
                    />
                  ))}
                </div>
              </section>
            ))}

          {ungroupedRoots.length > 0 ? (
            <section className="space-y-5">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-stone-300/55">
                  More destinations
                </p>
                <h2 className="mt-3 font-serif text-3xl leading-tight text-stone-50 md:text-4xl">
                  Unsorted places
                </h2>
              </div>
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {ungroupedRoots.map((destination) => (
                  <DestinationNode
                    key={destination._id}
                    destination={destination}
                    childMap={childMap}
                  />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </section>
    </main>
  );
}
