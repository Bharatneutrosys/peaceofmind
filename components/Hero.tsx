"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronDown, MapPin, Sparkles } from "lucide-react";

type HeroMetric = {
  label: string;
  value: string;
};

export default function Hero({
  image,
  brandName = "Traveller's Diary",
  eyebrow = "Born in the hills of Far Western Nepal",
  headline = "A cinematic travel diary shaped by mountain roads, long horizons, and quiet discovery.",
  subheading = "Stories from Nepal and beyond, told with the patience of a travel notebook and the polish of an editorial brand.",
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
      alt: "A wide panoramic Himalayan landscape in Nepal",
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
          className="absolute left-1/2 top-0 h-full w-[145vw] -translate-x-1/2 will-change-transform"
          animate={
            reduceMotion
              ? undefined
              : {
                  x: ["-3.5%", "3.5%", "-3.5%"],
                  scale: [1.04, 1.1, 1.04],
                }
          }
          transition={{
            duration: 24,
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
            sizes="145vw"
            className="object-cover object-center"
            style={{ objectPosition: "center 46%" }}
          />
        </motion.div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.14),_transparent_34%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/52 to-stone-950/10" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-stone-950 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-6 pb-8 pt-28 sm:px-8 lg:px-12 lg:pb-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.45fr)_minmax(17rem,0.68fr)] lg:items-end">
          <div className="max-w-4xl">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-[0.68rem] uppercase tracking-[0.32em] text-stone-100/78 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-amber-100" />
              {brandName}
            </p>

            <p className="mb-5 flex items-center gap-2 text-xs uppercase tracking-[0.34em] text-stone-200/68">
              <span className="h-px w-8 bg-white/30" />
              {eyebrow}
            </p>

            <h1 className="font-serif text-[clamp(3.4rem,8.2vw,8rem)] leading-[0.9] tracking-tight text-balance text-stone-50 drop-shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
              {headline}
            </h1>

            <p className="mt-6 max-w-2xl text-pretty text-base leading-8 text-stone-100/82 sm:text-lg">
              {subheading}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
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

          <div className="rounded-[1.75rem] border border-white/10 bg-white/8 p-5 backdrop-blur-xl">
            <div className="space-y-4">
              <div className="rounded-[1.25rem] border border-white/10 bg-stone-950/35 px-4 py-4">
                <div className="flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.28em] text-stone-200/64">
                  <MapPin className="h-3.5 w-3.5 text-amber-100" />
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
          <span className="hidden sm:inline">Scroll for stories and frames</span>
          <span className="sm:hidden">Scroll</span>
          <span className="inline-flex items-center gap-2">
            <ChevronDown className="h-4 w-4" />
          </span>
        </div>
      </div>
    </section>
  );
}
