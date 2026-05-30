import Image from "next/image";
import Link from "next/link";
import { PortableText, toPlainText, type PortableTextBlock, type PortableTextComponents } from "@portabletext/react";
import { ArrowRight, CalendarDays, Clock3, Quote } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";

type SanityImageSource = {
  asset?: {
    _ref?: string;
    _id?: string;
    url?: string;
  } | null;
  alt?: string | null;
  caption?: string | null;
};

type EssayPortableTextImage = {
  _type: "image";
  asset?: {
    _ref?: string;
    _id?: string;
    url?: string;
  } | null;
  alt?: string | null;
  caption?: string | null;
};

type EssayPortableTextValue = PortableTextBlock | EssayPortableTextImage;

export type EditorialEssayData = {
  title: string;
  date?: string | null;
  destination?: string | null;
  coverImage?: SanityImageSource | null;
  body?: EssayPortableTextValue[] | null;
};

function formatDate(date?: string | null) {
  if (!date) return "Undated dispatch";

  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  } catch {
    return date;
  }
}

function estimateReadTime(body?: EssayPortableTextValue[] | null) {
  if (!body?.length) {
    return "4 min read";
  }

  const wordCount = toPlainText(body).trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(4, Math.round(wordCount / 190));

  return `${minutes} min read`;
}

function resolveImageUrl(source?: SanityImageSource | null, width = 1600) {
  if (!source) return "";

  if (source.asset?._ref || source.asset?._id) {
    try {
      return urlFor(source).width(width).quality(92).url();
    } catch {
      return source.asset?.url ?? "";
    }
  }

  return source.asset?.url ?? "";
}

const portableTextComponents: PortableTextComponents<EssayPortableTextValue> = {
  block: {
    normal: ({ children }) => (
      <p className="max-w-3xl text-pretty text-[1.04rem] leading-8 text-stone-200/86 md:text-[1.08rem] md:leading-9">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="mt-14 max-w-3xl font-serif text-3xl leading-tight text-stone-50 md:text-4xl">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-10 max-w-3xl font-serif text-2xl leading-tight text-stone-50 md:text-[2.15rem]">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-12 max-w-3xl border-l border-amber-200/40 bg-white/4 px-6 py-5 text-stone-100/92 backdrop-blur-sm md:px-8">
        <Quote className="mb-4 h-5 w-5 text-amber-100/80" />
        <div className="font-serif text-2xl leading-tight tracking-tight md:text-[2.2rem]">
          {children}
        </div>
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="my-6 max-w-3xl space-y-3 pl-5 text-[1.04rem] leading-8 text-stone-200/84 marker:text-amber-100">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="my-6 max-w-3xl space-y-3 pl-5 text-[1.04rem] leading-8 text-stone-200/84 marker:text-amber-100">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="pl-1">{children}</li>,
    number: ({ children }) => <li className="pl-1">{children}</li>,
  },
  types: {
    image: ({ value }) => {
      const src = resolveImageUrl(value, 1600);

      if (!src) {
        return null;
      }

      return (
        <figure className="my-12 overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5">
          <div className="relative aspect-[16/10] w-full">
            <Image
              src={src}
              alt={value.alt || value.caption || "Essay image"}
              fill
              sizes="(min-width: 1024px) 780px, 100vw"
              className="object-cover"
            />
          </div>
          {value.caption ? (
            <figcaption className="border-t border-white/8 px-5 py-4 text-sm leading-6 text-stone-200/70">
              {value.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    },
  },
};

export default function EditorialEssay({
  essay,
}: {
  essay?: EditorialEssayData | null;
}) {
  if (!essay) {
    return (
      <section className="relative mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 px-6 py-10 backdrop-blur-sm sm:px-8">
          <p className="text-xs uppercase tracking-[0.32em] text-stone-300/55">
            Journal
          </p>
          <h2 className="mt-4 font-serif text-3xl leading-tight text-stone-50 md:text-5xl">
            The next dispatch is still forming.
          </h2>
          <p className="mt-4 max-w-2xl text-pretty text-base leading-8 text-stone-200/78">
            The archive is waiting for its next long-form story. Until then,
            the gallery, destination notes, and video frame remain open.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="#gallery"
              className="inline-flex items-center gap-2 rounded-full bg-stone-50 px-5 py-3 text-sm font-medium text-stone-950 transition-transform duration-300 hover:-translate-y-0.5"
            >
              Explore the gallery
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#videos"
              className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-5 py-3 text-sm font-medium text-stone-50 backdrop-blur-md transition-colors duration-300 hover:bg-white/12"
            >
              Watch featured video
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const formattedDate = formatDate(essay.date);
  const readTime = estimateReadTime(essay.body);
  const coverSrc = resolveImageUrl(essay.coverImage, 1800);

  return (
    <section
      id="journal"
      className="relative mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12"
    >
      <article className="overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/[0.03] shadow-[0_24px_90px_rgba(0,0,0,0.28)] backdrop-blur-sm">
        {coverSrc ? (
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            <Image
              src={coverSrc}
              alt={essay.coverImage?.alt || essay.title}
              fill
              priority
              sizes="(min-width: 1280px) 1200px, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/12 to-transparent" />
          </div>
        ) : null}

        <div className="grid gap-12 px-6 py-8 md:px-10 md:py-12 lg:grid-cols-[minmax(0,1.6fr)_minmax(16rem,0.7fr)] lg:px-12">
          <div>
            <div className="flex flex-wrap items-center gap-3 text-[0.7rem] uppercase tracking-[0.32em] text-stone-300/60">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
                <CalendarDays className="h-3.5 w-3.5 text-amber-100" />
                {formattedDate}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
                <Clock3 className="h-3.5 w-3.5 text-sky-100" />
                {readTime}
              </span>
            </div>

            <div className="mt-8 max-w-3xl">
              <p className="text-xs uppercase tracking-[0.32em] text-stone-300/55">
                Featured essay
              </p>
              <h2 className="mt-4 text-balance font-serif text-[clamp(2.7rem,5vw,4.8rem)] leading-[0.95] tracking-tight text-stone-50">
                {essay.title}
              </h2>
              <p className="mt-5 max-w-2xl text-pretty text-base leading-8 text-stone-200/76 md:text-lg">
                {essay.destination
                  ? `Written from ${essay.destination}, this dispatch lingers on the details that turn movement into memory.`
                  : "Written in the language of slow movement, this dispatch lingers on the details that turn travel into memory."}
              </p>
            </div>

            <div className="mt-10 border-t border-white/10 pt-8">
              <PortableText
                value={(essay.body ?? []) as EssayPortableTextValue[]}
                components={portableTextComponents}
              />
            </div>
          </div>

          <aside className="space-y-4 self-start rounded-[1.75rem] border border-white/10 bg-stone-950/35 p-5">
            <p className="text-xs uppercase tracking-[0.32em] text-stone-300/55">
              Editorial notes
            </p>
            <div className="space-y-4 text-sm leading-7 text-stone-200/78">
              <p>
                A quiet record of place, weather, and the small decisions that
                make a journey feel personal.
              </p>
              <p>
                The full archive stays light and easy to scan, with generous
                spacing and restrained motion for reading on any screen.
              </p>
            </div>

            <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
              <p className="text-[0.68rem] uppercase tracking-[0.28em] text-stone-300/55">
                Reading tone
              </p>
              <p className="mt-3 font-serif text-2xl text-stone-50">
                Measured, immersive, and unhurried.
              </p>
            </div>
          </aside>
        </div>
      </article>
    </section>
  );
}
