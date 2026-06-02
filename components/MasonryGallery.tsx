"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";

export interface SanityPhoto {
  _key?: string;
  asset?: {
    _ref?: string;
    _id?: string;
    url?: string | null;
  } | null;
  alt?: string | null;
  caption?: string | null;
}

const aspectClasses = ["aspect-[4/5]", "aspect-[5/6]", "aspect-[3/4]", "aspect-[7/9]"];

function resolveImageUrl(photo: SanityPhoto, width = 1200) {
  if (photo.asset?._ref || photo.asset?._id) {
    try {
      return urlFor(photo).width(width).quality(90).url();
    } catch {
      return photo.asset?.url ?? "";
    }
  }

  return photo.asset?.url ?? "";
}

export default function MasonryGallery({ photos = [] }: { photos: SanityPhoto[] }) {
  const [selectedImage, setSelectedImage] = useState<SanityPhoto | null>(null);
  const [loadedIds, setLoadedIds] = useState<Record<string, boolean>>({});

  const keyedPhotos = useMemo(
    () =>
      photos.map((photo, index) => ({
        ...photo,
        id: photo._key || photo.asset?._id || `photo-${index}`,
      })),
    [photos],
  );

  useEffect(() => {
    if (!selectedImage) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedImage(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedImage]);

  if (!photos.length) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div className="rounded-[1.5rem] border border-white/10 bg-white/5 px-5 py-8 backdrop-blur-sm sm:rounded-[2rem] sm:px-8 sm:py-10">
          <p className="text-xs uppercase tracking-[0.32em] text-stone-300/55">
            Gallery
          </p>
          <h2 className="mt-4 font-serif text-3xl leading-tight text-stone-50 md:text-5xl">
            The visual archive is waiting for its next chapter.
          </h2>
          <p className="mt-4 max-w-2xl text-pretty text-base leading-8 text-stone-200/78">
            Once the journal fills out, this section becomes a cinematic wall of
            images. For now it stays composed and intentionally quiet.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-8 sm:py-24 lg:px-12">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-stone-300/55">
            Visual journal
          </p>
          <h2 className="mt-4 font-serif text-3xl leading-tight text-stone-50 md:text-5xl">
            Gallery from the road
          </h2>
        </div>
        <p className="max-w-xl text-sm leading-7 text-stone-200/68">
          A quiet grid of moments from the archive, tuned for quick scanning on
          mobile and a cinematic rhythm on larger screens.
        </p>
      </div>

      <div className="columns-1 gap-5 space-y-5 md:columns-2 xl:columns-3">
        {keyedPhotos.map((photo, index) => {
          const id = photo.id;
          const src = resolveImageUrl(photo);
          const aspect = aspectClasses[index % aspectClasses.length];
          const isLoaded = loadedIds[id];

          if (!src) return null;

          return (
            <motion.button
              key={id}
              type="button"
              onClick={() => setSelectedImage(photo)}
              className="group relative block w-full break-inside-avoid overflow-hidden rounded-[1.5rem] border border-white/10 bg-stone-950/40 text-left shadow-[0_16px_50px_rgba(0,0,0,0.18)]"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={`relative w-full ${aspect}`}>
                {!isLoaded ? <div className="absolute inset-0 animate-pulse bg-white/5" /> : null}

                <Image
                  src={src}
                  alt={photo.alt || photo.caption || "Gallery image"}
                  fill
                  sizes="(min-width: 1536px) 33vw, (min-width: 1024px) 34vw, (min-width: 768px) 48vw, 100vw"
                  className={`object-cover transition duration-700 group-hover:scale-[1.03] ${
                    isLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  onLoadingComplete={() =>
                    setLoadedIds((current) => ({ ...current, [id]: true }))
                  }
                />

                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/82 via-stone-950/14 to-transparent opacity-75 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
                  <div className="max-w-[80%]">
                    <p className="text-[0.68rem] uppercase tracking-[0.28em] text-stone-200/55">
                      Frame {String(index + 1).padStart(2, "0")}
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-stone-50 transition-transform duration-500 group-hover:translate-y-[-2px]">
                      {photo.caption || photo.alt || "Untitled study"}
                    </p>
                  </div>
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/8 text-stone-50/80 backdrop-blur-md transition-transform duration-500 group-hover:scale-105">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedImage ? (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={selectedImage.caption || selectedImage.alt || "Gallery image"}
            className="fixed inset-0 z-[250] flex items-center justify-center bg-stone-950/96 px-3 py-5 backdrop-blur-2xl sm:px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setSelectedImage(null)}
          >
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute right-3 top-3 z-10 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/10 text-stone-100 transition-colors duration-300 hover:bg-white/12 sm:right-6 sm:top-6"
              aria-label="Close image viewer"
            >
              <X className="h-5 w-5" />
            </button>

            <motion.div
              className="relative flex w-full max-w-6xl flex-col items-center gap-4"
              initial={{ scale: 0.98, y: 14 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.98, y: 14 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(event) => event.stopPropagation()}
            >
              <Image
                src={resolveImageUrl(selectedImage, 2400)}
                alt={selectedImage.alt || selectedImage.caption || "Gallery image"}
                width={2400}
                height={1600}
                sizes="100vw"
                className="max-h-[76svh] w-auto max-w-full rounded-[1rem] border border-white/10 object-contain shadow-[0_24px_90px_rgba(0,0,0,0.48)] sm:max-h-[82svh] sm:rounded-[1.5rem]"
              />

              {(selectedImage.caption || selectedImage.alt) && (
                <div className="max-w-3xl text-center">
                  <p className="text-xs uppercase tracking-[0.32em] text-stone-300/55">
                    Gallery note
                  </p>
                  <p className="mt-3 text-pretty font-serif text-xl leading-tight text-stone-50 sm:text-2xl md:text-3xl">
                    {selectedImage.caption || selectedImage.alt}
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
