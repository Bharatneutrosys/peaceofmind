import Hero from "@/components/Hero";
import EditorialEssay from "@/components/EditorialEssay";
import MasonryGallery from "@/components/MasonryGallery";
import AuthorProfile from "@/components/AuthorProfile";
import { client } from "@/sanity/lib/client";
import { getEssaysQuery, getPhotoJournalsQuery } from "@/sanity/lib/queries";

export const revalidate = 60; 

export default async function Home() {
  // Fetch BOTH the essays and the photos from Sanity in parallel
  const [essays, fetchedPhotos] = await Promise.all([
    client.fetch(getEssaysQuery),
    client.fetch(getPhotoJournalsQuery)
  ]);

  const latestEssay = essays?.length > 0 ? essays[0] : null;

  return (
    <main className="flex min-h-screen flex-col w-full bg-stone-900">
      
      {/* 1. Cinematic Header */}
      <Hero />

      {/* 2. Sanity Rich-Text Essay */}
      {latestEssay && (
        <section className="py-16 md:py-24">
          <EditorialEssay essay={latestEssay} />
        </section>
      )}

      {/* 3. Photo Gallery (Now receiving the fetched photos!) */}
      <section className="py-16">
        <MasonryGallery photos={fetchedPhotos || []} />
      </section>

      {/* 4. Author Bio */}
      <section className="py-16">
        <AuthorProfile />
      </section>

    </main>
  );
}