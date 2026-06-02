"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronDown, MapPin } from "lucide-react";

type HeroMetric = {
  label: string;
  value: string;
};

export default function Hero({
  image,
  brandName = "Traveller's Diary",
  eyebrow = "Travel diary",
  headline = "Stories from the road, the mountains, and beyond.",
  subheading = "Travel notes, photos, and videos from places worth remembering.",
  location = "Far Western Nepal",
  season = "Nepal • South Asia • Beyond",
  metrics = [],
}: {
  image?: { src: string; alt: string } | null;
  brandName?: string;
  eyebrow?: string;
  headline?: string;
  subheading?: string;
  location?: string;
  season?: string;
  metrics?: HeroMetric[];
}) {
  const reduceMotion = useReducedMotion();
  const heroImage =
    image ?? {
      src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=3200&auto=format&fit=crop",
      alt: "A panoramic mountain range at dusk",
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
      className="relative isolate min-h-[82svh] overflow-hidden bg-stone-950 text-stone-50 md:min-h-[88svh]"
    >
      <div className="absolute inset-0">
        <motion.div
          className="absolute left-1/2 top-0 h-full w-[138vw] -translate-x-1/2 will-change-transform"
          animate={
            reduceMotion
              ? undefined
              : {
                  x: ["-9%", "9%", "-9%"],
                  scale: [1.02, 1.06, 1.02],
                }
          }
          transition={{
            duration: 28,
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
            sizes="138vw"
            className="object-cover object-center"
            style={{ objectPosition: "center 46%" }}
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/82 via-stone-950/36 to-stone-950/18" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/28 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-stone-950 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[82svh] max-w-7xl flex-col justify-end px-6 pb-7 pt-28 sm:px-8 md:min-h-[88svh] lg:px-12 lg:pb-10">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(15rem,0.42fr)] lg:items-end">
          <div className="max-w-3xl">
            <p className="mb-4 flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.28em] text-stone-100/78">
              <span className="h-px w-8 bg-white/30" />
              {eyebrow || brandName}
            </p>

            <h1 className="max-w-3xl text-balance font-serif text-[clamp(2.2rem,4.6vw,4.5rem)] leading-[0.98] text-stone-50 drop-shadow-[0_10px_34px_rgba(0,0,0,0.48)]">
              {headline}
            </h1>

            <p className="mt-5 max-w-xl text-pretty text-base leading-7 text-stone-100/88 sm:text-lg">
              {subheading}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="#journal"
                className="inline-flex items-center gap-2 rounded-full bg-stone-50 px-5 py-3 text-sm font-medium text-stone-950 transition-transform duration-300 hover:-translate-y-0.5"
              >
                Explore Journal
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#gallery"
                className="inline-flex items-center gap-2 rounded-full border border-white/16 bg-white/8 px-5 py-3 text-sm font-medium text-stone-50 backdrop-blur-md transition-colors duration-300 hover:bg-white/14"
              >
                View Gallery
              </Link>
            </div>
          </div>

          <div className="rounded-[1.25rem] border border-white/10 bg-stone-950/32 p-4 backdrop-blur-xl">
            <div className="space-y-3">
              <div>
                <div className="flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.28em] text-stone-200/64">
                  <MapPin className="h-3.5 w-3.5 text-amber-100" />
                  Current route
                </div>
                <p className="mt-2 font-serif text-xl text-stone-50">{location}</p>
                <p className="mt-2 text-sm leading-6 text-stone-100/72">
                  {season}
                </p>
              </div>

              <div className="grid gap-2">
                {displayMetrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="flex items-center justify-between border-t border-white/10 pt-2"
                  >
                    <p className="text-[0.64rem] uppercase tracking-[0.24em] text-stone-200/55">
                      {metric.label}
                    </p>
                    <p className="text-sm font-medium text-stone-50">
                      {metric.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-7 flex items-center justify-between border-t border-white/10 pt-4 text-[0.65rem] uppercase tracking-[0.24em] text-stone-200/58">
          <span className="hidden sm:inline">Scroll for stories</span>
          <span className="sm:hidden">Scroll</span>
          <span className="inline-flex items-center gap-2">
            <ChevronDown className="h-4 w-4" />
          </span>
        </div>
      </div>
    </section>
  );
}
