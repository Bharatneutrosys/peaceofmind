import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Compass, MapPinned, Sparkles } from "lucide-react";

const values = [
  "Slow routes over loud itineraries",
  "Small details over broad summaries",
  "Quiet luxury over spectacle",
];

const socialLinks = [
  { label: "Facebook", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "YouTube", href: "#" },
];

export default function AuthorProfile() {
  return (
    <section
      id="philosophy"
      className="relative mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12"
    >
      <div className="grid items-center gap-10 rounded-[2.25rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)] backdrop-blur-sm md:p-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:p-10">
        <div className="relative">
          <div className="absolute -inset-4 hidden rounded-[2rem] border border-white/8 bg-white/6 blur-0 md:block" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-white/10 bg-stone-950/50">
            <Image
              src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=1800&auto=format&fit=crop"
              alt="A traveler overlooking a quiet landscape"
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

          <h2 className="mt-5 text-balance font-serif text-[clamp(2.7rem,5vw,4.9rem)] leading-[0.96] tracking-tight text-stone-50">
            Raised close to the hills of Far Western Nepal, Traveller&apos;s
            Diary studies the world through roads, weather, food, silence, and
            movement.
          </h2>

          <p className="mt-6 max-w-2xl text-pretty text-base leading-8 text-stone-200/78 md:text-lg">
            This is the beginning of a serious travel creator brand: a place
            for stories, photo journals, and destination notes shaped by a
            young woman who grew up around mountains and is studying travel and
            tourism with a storyteller&apos;s eye.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { label: "Perspective", value: "Mountain-born and observant" },
              { label: "Focus", value: "People, places, culture" },
              { label: "Voice", value: "Elegant and grounded" },
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

          <div className="mt-8 flex flex-wrap gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[0.72rem] uppercase tracking-[0.22em] text-stone-100/78 transition-colors duration-300 hover:bg-white/10"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
