import Hero from "@/components/Hero";
import EditorialEssay from "@/components/EditorialEssay";
import MasonryGallery from "@/components/MasonryGallery";
import AuthorProfile from "@/components/AuthorProfile";
import { client } from "@/sanity/lib/client";
import { getEssaysQuery } from "@/sanity/lib/queries";

// Optional: Revalidate every 60 seconds so Sanity updates show up quickly
export const revalidate = 60; 

export default async function Home() {
  // Fetch the latest essay from Sanity
  const essays = await client.fetch(getEssaysQuery);
  const latestEssay = essays?.length > 0 ? essays[0] : null;

  return (
    <main className="flex min-h-screen flex-col w-full bg-stone-900">
      
      {/* 1. Cinematic Header */}
      <Hero />

      {/* 2. Sanity Rich-Text Essay (Graceful Fallback applied) */}
      {latestEssay && (
        <section className="py-16 md:py-24">
          <EditorialEssay essay={latestEssay} />
        </section>
      )}

      {/* 3. Photo Gallery */}
      <section className="py-16">
        <MasonryGallery />
      </section>

      {/* 4. Author Bio */}
      <section className="py-16">
        <AuthorProfile />
      </section>

    </main>
  );
}