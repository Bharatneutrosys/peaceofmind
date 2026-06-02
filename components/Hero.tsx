"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronDown, Quote } from "lucide-react";

type HeroAuthorCard = {
  image?: { src: string; alt: string } | null;
  name?: string | null;
  intro?: string | null;
  quote?: string | null;
};

export default function Hero({
  image,
  brandName = "Traveller's Diary",
  eyebrow = "Travel diary",
  headline = "Stories from the mountains and beyond.",
  subheading = "Travel notes, photos, and videos from places worth remembering.",
  authorCard,
}: {
  image?: { src: string; alt: string } | null;
  brandName?: string;
  eyebrow?: string;
  headline?: string;
  subheading?: string;
  authorCard?: HeroAuthorCard | null;
}) {
  const reduceMotion = useReducedMotion();
  const heroImage =
    image ?? {
      src: "/images/hero-panorama.png",
      alt: "A long Himalayan mountain panorama",
    };
  const cardName = authorCard?.name || brandName;
  const cardIntro =
    authorCard?.intro ||
    "A traveler collecting simple notes, photos, and videos from places worth remembering.";
  const cardQuote =
    authorCard?.quote ||
    "We travel far looking for joy, then come home and find it was waiting there.";

  return (
    <section
      id="top"
      className="relative isolate min-h-[66svh] overflow-hidden bg-stone-950 text-stone-50 md:min-h-[74svh]"
    >
      <div className="absolute inset-0">
        <motion.div
          className="absolute left-1/2 top-0 h-full w-[260vw] -translate-x-1/2 will-change-transform md:w-[170vw]"
          animate={
            reduceMotion
              ? undefined
              : {
                  x: ["-14%", "14%", "-14%"],
                  scale: [1.01, 1.035, 1.01],
                }
          }
          transition={{
            duration: 29,
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
            sizes="(min-width: 768px) 170vw, 260vw"
            className="object-cover object-center"
            style={{ objectPosition: "center 50%" }}
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/74 via-stone-950/28 to-stone-950/8" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/82 via-stone-950/12 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-stone-950 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[66svh] max-w-7xl flex-col justify-end px-6 pb-6 pt-24 sm:px-8 md:min-h-[74svh] lg:px-12 lg:pb-8">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(14rem,0.38fr)] lg:items-end">
          <div className="max-w-2xl">
            <p className="mb-4 flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.28em] text-stone-100/78">
              <span className="h-px w-8 bg-white/30" />
              {eyebrow || brandName}
            </p>

            <h1 className="max-w-2xl text-balance font-serif text-[clamp(1.9rem,3.6vw,3.4rem)] leading-[1.02] text-stone-50 drop-shadow-[0_10px_34px_rgba(0,0,0,0.52)]">
              {headline}
            </h1>

            <p className="mt-4 max-w-lg text-pretty text-sm leading-7 text-stone-100/88 sm:text-base">
              {subheading}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/journal"
                className="inline-flex items-center gap-2 rounded-full bg-stone-50 px-5 py-3 text-sm font-medium text-stone-950 transition-transform duration-300 hover:-translate-y-0.5"
              >
                Explore Journal
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 rounded-full border border-white/16 bg-white/8 px-5 py-3 text-sm font-medium text-stone-50 backdrop-blur-md transition-colors duration-300 hover:bg-white/14"
              >
                View Gallery
              </Link>
            </div>
          </div>

          <div className="hidden rounded-[1.35rem] border border-white/10 bg-stone-950/34 p-4 shadow-[0_18px_54px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:block">
            <div className="grid gap-4">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1rem] border border-white/10 bg-stone-950/55">
                {authorCard?.image?.src ? (
                  <Image
                    src={authorCard.image.src}
                    alt={authorCard.image.alt}
                    fill
                    sizes="(min-width: 1024px) 22vw, 45vw"
                    className="object-cover object-center"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_20%,rgba(255,255,255,0.18),transparent_28%),linear-gradient(135deg,rgba(200,154,87,0.28),rgba(135,182,201,0.14)_48%,rgba(0,0,0,0.22))]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/74 via-transparent to-transparent" />
                <p className="absolute bottom-3 left-3 right-3 text-[0.68rem] uppercase tracking-[0.26em] text-stone-100/76">
                  About the traveler
                </p>
              </div>

              <div>
                <p className="font-serif text-xl leading-tight text-stone-50">
                  {cardName}
                </p>
                <p className="mt-2 text-sm leading-6 text-stone-100/72">
                  {cardIntro}
                </p>
              </div>

              <div className="border-t border-white/10 pt-3">
                <Quote className="h-4 w-4 text-amber-100" />
                <p className="mt-2 text-pretty font-serif text-lg leading-7 text-stone-50/92">
                  {cardQuote}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-[0.65rem] uppercase tracking-[0.24em] text-stone-200/58">
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
