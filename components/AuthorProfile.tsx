import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Compass, MapPinned, Sparkles } from "lucide-react";

type SocialLinks = {
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  youtubeUrl?: string | null;
};

const values = [
  "Simple notes from real journeys",
  "Photos that hold a memory",
  "Places shared in a warm voice",
];

function socialItems(socialLinks?: SocialLinks) {
  return [
    socialLinks?.facebookUrl
      ? { label: "Facebook", href: socialLinks.facebookUrl }
      : null,
    socialLinks?.instagramUrl
      ? { label: "Instagram", href: socialLinks.instagramUrl }
      : null,
    socialLinks?.youtubeUrl ? { label: "YouTube", href: socialLinks.youtubeUrl } : null,
  ].filter(Boolean) as Array<{ label: string; href: string }>;
}

export default function AuthorProfile({
  authorBio,
  authorImage,
  socialLinks,
}: {
  authorBio?: string | null;
  authorImage?: {
    src?: string | null;
    alt?: string | null;
  } | null;
  socialLinks?: SocialLinks;
}) {
  const socials = socialItems(socialLinks);

  return (
    <section
      id="philosophy"
      className="relative mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12"
    >
      <div className="grid items-center gap-8 rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-5 shadow-[0_18px_54px_rgba(0,0,0,0.18)] backdrop-blur-sm md:p-7 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.1fr)]">
        <div className="relative">
          <div className="absolute -inset-4 hidden rounded-[2rem] border border-white/8 bg-white/6 blur-0 md:block" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-white/10 bg-stone-950/50">
            <Image
              src={
                authorImage?.src ||
                "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=1800&auto=format&fit=crop"
              }
              alt={authorImage?.alt || "A traveler overlooking a quiet landscape"}
              fill
              sizes="(min-width: 1280px) 40vw, 100vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/10 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.16),_transparent_30%)]" />
          </div>
        </div>

        <div className="max-w-3xl">
          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.32em] text-stone-300/55">
            <Sparkles className="h-3.5 w-3.5 text-amber-100" />
            Philosophy
          </p>

          <h2 className="mt-5 text-balance font-serif text-[clamp(2.1rem,4vw,3.8rem)] leading-[1] tracking-tight text-stone-50">
            A traveler collecting places, photos, and small moments from the road.
          </h2>

          <p className="mt-6 max-w-2xl text-pretty text-base leading-8 text-stone-200/78 md:text-lg">
            {authorBio ||
              "This is a simple travel diary for notes, photos, and videos from places that feel worth remembering."}
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { label: "Focus", value: "Travel notes" },
              { label: "Photos", value: "Everyday beauty" },
              { label: "Voice", value: "Warm and clear" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-[1.1rem] border border-white/10 bg-white/5 px-4 py-4"
              >
                <p className="text-[0.68rem] uppercase tracking-[0.28em] text-stone-300/55">
                  {item.label}
                </p>
                <p className="mt-2 text-sm leading-6 text-stone-100/88">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 space-y-3">
            {values.map((value) => (
              <div
                key={value}
                className="flex items-start gap-3 rounded-[1rem] border border-white/8 bg-stone-950/25 px-4 py-3 text-sm leading-7 text-stone-200/84"
              >
                <MapPinned className="mt-1 h-4 w-4 shrink-0 text-amber-100" />
                <span>{value}</span>
              </div>
            ))}
          </div>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="#journal"
              className="inline-flex items-center gap-2 rounded-full bg-stone-50 px-5 py-3 text-sm font-medium text-stone-950 transition-transform duration-300 hover:-translate-y-0.5"
            >
              Read the journal
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#videos"
              className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-5 py-3 text-sm font-medium text-stone-50 backdrop-blur-md transition-colors duration-300 hover:bg-white/12"
            >
              Watch featured video
              <Compass className="h-4 w-4" />
            </Link>
          </div>

          {socials.length > 0 ? (
            <div className="mt-8 flex flex-wrap gap-3">
              {socials.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[0.72rem] uppercase tracking-[0.22em] text-stone-100/78 transition-colors duration-300 hover:bg-white/10"
                >
                  {link.label}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
