"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronDown, Compass, MapPin, Sparkles } from "lucide-react";

type HeroImage = {
  src: string;
  alt: string;
};

type HeroMetric = {
  label: string;
  value: string;
};

export default function Hero({
  image,
  location = "Himalayan Range",
  season = "Early winter light",
  metrics = [],
}: {
  image?: HeroImage | null;
  location?: string;
  season?: string;
  metrics?: HeroMetric[];
}) {
  const reduceMotion = useReducedMotion();
  const heroImage =
    image ?? {
      src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2400&auto=format&fit=crop",
      alt: "A cinematic mountain landscape at dawn",
    };

  const motionProps = reduceMotion
    ? undefined
    : {
        scale: [1.04, 1.09, 1.04],
        x: ["0%", "-2.5%", "0%"],
      };

  const displayMetrics =
    metrics.length > 0
      ? metrics
      : [
          { label: "Tempo", value: "Unhurried" },
          { label: "Mood", value: "Cinematic" },
          { label: "Lens", value: "Quiet luxury" },
        ];

  return (
    <section
      id="top"
      className="relative isolate min-h-[100svh] overflow-hidden bg-stone-950 text-stone-50"
    >
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          animate={motionProps}
          transition={{
            duration: 34,
            ease: "easeInOut",
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "mirror",
          }}
        >
          <Image
            src={heroImage.src}
            alt={heroImage.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </motion.div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_34%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/48 to-stone-950/8" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-stone-950 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-6 pb-8 pt-28 sm:px-8 lg:px-12 lg:pb-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.78fr)] lg:items-end">
          <div className="max-w-4xl">
            <div className="mb-6 flex flex-wrap items-center gap-3 text-[0.7rem] uppercase tracking-[0.3em] text-stone-200/80">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-amber-200" />
                Life of a Traveller
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 backdrop-blur-md">
                <Compass className="h-3.5 w-3.5 text-sky-200" />
                Sanu&apos;s Diary
              </span>
            </div>

            <p className="mb-5 flex items-center gap-2 text-xs uppercase tracking-[0.34em] text-stone-200/70">
              <span className="h-px w-8 bg-white/30" />
              cinematic travel documentary
            </p>

            <h1 className="font-serif text-[clamp(3.4rem,8.1vw,7.9rem)] leading-[0.9] tracking-tight text-balance text-stone-50 drop-shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
              Slow miles, bright horizons, and the kind of silence that stays
              with you.
            </h1>

            <p className="mt-6 max-w-2xl text-pretty text-base leading-8 text-stone-100/82 sm:text-lg">
              An editorial travel diary shaped by mountain mornings, long train
              rides, and the luminous calm that appears when you stop rushing
              through a place and let it reveal itself.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="#journal"
                className="inline-flex items-center gap-2 rounded-full bg-stone-50 px-5 py-3 text-sm font-medium text-stone-950 transition-transform duration-300 hover:-translate-y-0.5"
              >
                Read the latest essay
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#gallery"
                className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/8 px-5 py-3 text-sm font-medium text-stone-50 backdrop-blur-md transition-colors duration-300 hover:bg-white/14"
              >
                Enter the visual journal
              </Link>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-white/8 p-5 backdrop-blur-xl">
            <div className="space-y-4">
              <div className="rounded-[1.25rem] border border-white/10 bg-stone-950/35 px-4 py-4">
                <div className="flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.28em] text-stone-200/65">
                  <MapPin className="h-3.5 w-3.5 text-amber-200" />
                  current chapter
                </div>
                <p className="mt-3 font-serif text-2xl text-stone-50">{location}</p>
                <p className="mt-2 text-sm leading-6 text-stone-100/72">
                  {season}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                {displayMetrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-[1.1rem] border border-white/10 bg-stone-950/30 px-4 py-3"
                  >
                    <p className="text-[0.68rem] uppercase tracking-[0.28em] text-stone-200/55">
                      {metric.label}
                    </p>
                    <p className="mt-2 text-sm font-medium text-stone-50">
                      {metric.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-5 text-[0.7rem] uppercase tracking-[0.32em] text-stone-200/58">
          <span className="hidden sm:inline">Scroll to read the diary</span>
          <span className="sm:hidden">Scroll</span>
          <span className="inline-flex items-center gap-2">
            <ChevronDown className="h-4 w-4" />
          </span>
        </div>
      </div>
    </section>
  );
}
