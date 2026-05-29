import Hero from "@/components/Hero";
import MasonryGallery from "@/components/MasonryGallery";
import EditorialEssay from "@/components/EditorialEssay";
import AuthorProfile from "@/components/AuthorProfile";
import { client } from "@/sanity/lib/client";
import { getPhotoJournalsQuery } from "@/sanity/lib/queries";
import { SanityPhoto } from "@/components/MasonryGallery";

export const revalidate = 60; // Revalidate the page every 60 seconds

export default async function Home() {
  const journals = await client.fetch(getPhotoJournalsQuery);
  const fetchedPhotos: SanityPhoto[] = journals.flatMap((journal: any) => journal.gallery || []);

  return (
    <main className="w-full flex flex-col bg-[#0a0a0a]">
      <Hero />
      <MasonryGallery photos={fetchedPhotos} />
      <EditorialEssay />
      <AuthorProfile />
    </main>
  );
}
