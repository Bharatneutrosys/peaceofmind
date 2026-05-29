import Hero from "@/components/Hero";
import MasonryGallery from "@/components/MasonryGallery";

export default function Home() {
  return (
    <main className="w-full flex flex-col bg-[#0a0a0a]">
      <Hero />
      <MasonryGallery />
    </main>
  );
}
