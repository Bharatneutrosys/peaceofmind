import type { ReactNode } from "react";

export default function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <header className="mx-auto flex max-w-7xl flex-col gap-6 px-6 pb-12 pt-28 sm:px-8 lg:px-12">
      {eyebrow ? (
        <p className="text-xs uppercase tracking-[0.34em] text-stone-300/55">
          {eyebrow}
        </p>
      ) : null}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-4xl">
          <h1 className="text-balance font-serif text-[clamp(3rem,7vw,6rem)] leading-[0.92] tracking-tight text-stone-50">
            {title}
          </h1>
          {description ? (
            <p className="mt-5 max-w-3xl text-pretty text-base leading-8 text-stone-200/78 md:text-lg">
              {description}
            </p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </header>
  );
}
