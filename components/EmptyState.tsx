import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function EmptyState({
  eyebrow = "Archive",
  title,
  description,
  actionLabel,
  actionHref,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 px-6 py-10 backdrop-blur-sm sm:px-8">
      <p className="text-xs uppercase tracking-[0.32em] text-stone-300/55">
        {eyebrow}
      </p>
      <h2 className="mt-4 font-serif text-[clamp(2.2rem,5.8vw,4.8rem)] leading-tight text-stone-50">
        {title}
      </h2>
      <p className="mt-4 max-w-2xl text-pretty text-base leading-8 text-stone-200/78">
        {description}
      </p>
      {actionLabel && actionHref ? (
        <Link
          href={actionHref}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-stone-50 px-5 py-3 text-sm font-medium text-stone-950 transition-transform duration-300 hover:-translate-y-0.5"
        >
          {actionLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
  );
}
