import type { Metadata } from "next";
import EmptyState from "@/components/EmptyState";
import MasonryGallery, { type SanityPhoto } from "@/components/MasonryGallery";
import PageHeader from "@/components/PageHeader";
import { client } from "@/sanity/lib/client";
import { getPhotoJournalsQuery, getSiteSettingsQuery } from "@/sanity/lib/queries";
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

type PhotoJournalRecord = {
  _id: string;
  title: string;
  destination?: string | null;
  coverImage?: ImageField | null;
  gallery?: SanityPhoto[] | null;
};

async function getSiteSettings() {
  return client
    .fetch<SiteSettings | null>(getSiteSettingsQuery)
    .catch(() => null);
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

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await getSiteSettings();
  const brandName = siteSettings?.brandName || "Traveller's Diary";

  return buildMetadata({
    title: `Gallery | ${brandName}`,
    description:
      siteSettings?.shortDescription ||
      siteSettings?.tagline ||
      "A cinematic gallery from Traveller's Diary.",
    path: "/gallery",
    image: siteSettings?.heroImage?.asset?.url || undefined,
    imageAlt: siteSettings?.heroHeadline || brandName,
    siteName: brandName,
  });
}

export default async function GalleryPage() {
  const journals = await client
    .fetch<PhotoJournalRecord[]>(getPhotoJournalsQuery)
    .catch(() => []);
  const photos = buildGalleryPhotos(journals);

  return (
    <main className="min-h-screen">
      <PageHeader
        eyebrow="Gallery"
        title="The visual archive, expanded."
        description="Photo journals, gallery frames, and atmospheric stills from the road. The lightbox experience remains intact here."
      />

      <section className="mx-auto max-w-7xl px-6 pb-24 sm:px-8 lg:px-12">
        {photos.length > 0 ? (
          <MasonryGallery photos={photos} />
        ) : (
          <EmptyState
            eyebrow="Gallery"
            title="The visual archive is waiting for its first frame."
            description="Once photo journals are added in Sanity, this page becomes a full masonry gallery with a lightbox view."
            actionLabel="Open Photo Journals"
            actionHref="/journal"
          />
        )}
      </section>
    </main>
  );
}
