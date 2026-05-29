import Hero from "@/components/Hero";
import MasonryGallery from "@/components/MasonryGallery";
import EditorialEssay from "@/components/EditorialEssay";
import AuthorProfile from "@/components/AuthorProfile";

export default function Home() {
  return (
    <main className="w-full flex flex-col bg-[#0a0a0a]">
      <Hero />
      <MasonryGallery />
      <EditorialEssay />
      <AuthorProfile />
    </main>
  );
}
