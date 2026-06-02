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

type EssayPortableTextLink = {
  href?: string | null;
  blank?: boolean | null;
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
  if (!date) return "Undated story";

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

export const portableTextComponents: PortableTextComponents<EssayPortableTextValue> = {
  marks: {
    link: ({ children, value }) => {
      const link = value as EssayPortableTextLink | undefined;

      if (!link?.href) {
        return <span>{children}</span>;
      }

      return (
        <a
          href={link.href}
          target={link.blank ? "_blank" : undefined}
          rel={link.blank ? "noreferrer" : undefined}
          className="text-amber-100 underline decoration-amber-100/40 underline-offset-4 transition-colors duration-300 hover:text-amber-50 hover:decoration-amber-50"
        >
          {children}
        </a>
      );
    },
    strong: ({ children }) => (
      <strong className="font-semibold text-stone-50">{children}</strong>
    ),
    em: ({ children }) => <em className="italic text-stone-100/90">{children}</em>,
  },
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
      <section className="relative mx-auto max-w-7xl px-0 py-0">
        <div className="rounded-[1.5rem] border border-white/10 bg-white/5 px-6 py-8 backdrop-blur-sm sm:px-8">
          <p className="text-xs uppercase tracking-[0.32em] text-stone-300/55">
            Journal
          </p>
          <h2 className="mt-4 font-serif text-3xl leading-tight text-stone-50 md:text-5xl">
            The first story is waiting.
          </h2>
          <p className="mt-4 max-w-2xl text-pretty text-base leading-8 text-stone-200/78">
            Add a travel story from the admin panel when it is ready.
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
  const hasBody = Boolean(essay.body?.length);

  return (
    <section
      id="journal"
      className="relative mx-auto max-w-7xl px-0 py-0"
    >
      <article className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.03] shadow-[0_16px_50px_rgba(0,0,0,0.18)] backdrop-blur-sm">
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

        <div className="grid gap-8 px-5 py-7 md:px-8 md:py-9 lg:grid-cols-[minmax(0,1.6fr)_minmax(16rem,0.7fr)]">
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
              <h2 className="mt-4 text-balance font-serif text-[clamp(2rem,4vw,3.4rem)] leading-[1] tracking-tight text-stone-50">
                {essay.title}
              </h2>
              <p className="mt-5 max-w-2xl text-pretty text-base leading-8 text-stone-200/76 md:text-lg">
                {essay.destination
                  ? `A travel note from ${essay.destination}.`
                  : "A travel note from the road."}
              </p>
            </div>

            <div className="mt-10 border-t border-white/10 pt-8">
              {hasBody ? (
                <div className="space-y-6">
                  <PortableText
                    value={(essay.body ?? []) as EssayPortableTextValue[]}
                    components={portableTextComponents}
                  />
                </div>
              ) : (
                <div className="max-w-3xl rounded-[1.5rem] border border-white/10 bg-white/4 px-6 py-8">
                  <p className="text-xs uppercase tracking-[0.32em] text-stone-300/55">
                    Story body
                  </p>
                  <p className="mt-4 text-pretty text-base leading-8 text-stone-200/78">
                    This story is waiting for its full text. Add it from the admin panel when ready.
                  </p>
                </div>
              )}
            </div>
          </div>

          <aside className="space-y-4 self-start rounded-[1.75rem] border border-white/10 bg-stone-950/35 p-5">
            <p className="text-xs uppercase tracking-[0.32em] text-stone-300/55">
              Story note
            </p>
            <div className="space-y-4 text-sm leading-7 text-stone-200/78">
              <p>
                Keep the story simple, personal, and easy to read.
              </p>
            </div>

            <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
              <p className="text-[0.68rem] uppercase tracking-[0.28em] text-stone-300/55">
                Best for
              </p>
              <p className="mt-3 font-serif text-2xl text-stone-50">
                Places, photos, and memories.
              </p>
            </div>
          </aside>
        </div>
      </article>
    </section>
  );
}
