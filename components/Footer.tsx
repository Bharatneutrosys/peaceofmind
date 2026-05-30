import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const footerLinks = [
  { label: "Destinations", href: "#destinations" },
  { label: "Journal", href: "#journal" },
  { label: "Gallery", href: "#gallery" },
  { label: "Videos", href: "#videos" },
  { label: "Philosophy", href: "#philosophy" },
];

const socialLinks = [
  { label: "Facebook", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "YouTube", href: "#" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/8 bg-stone-950 px-6 py-16 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(14rem,0.65fr)_minmax(14rem,0.65fr)]">
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-stone-300/55">
              Traveller&apos;s Diary
            </p>
            <h3 className="mt-4 max-w-2xl font-serif text-3xl leading-tight text-stone-50 md:text-4xl">
              Stories from mountain country, written with calm and intention.
            </h3>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-stone-300/55">
              Explore
            </p>
            <div className="mt-4 space-y-3">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between border-b border-white/8 pb-3 text-sm text-stone-200/78 transition-colors duration-300 hover:text-stone-50"
                >
                  {link.label}
                  <ArrowUpRight className="h-4 w-4 text-stone-300/50" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-stone-300/55">
              Follow
            </p>
            <div className="mt-4 space-y-3">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="flex items-center justify-between border-b border-white/8 pb-3 text-sm text-stone-200/78 transition-colors duration-300 hover:text-stone-50"
                >
                  {link.label}
                  <ArrowUpRight className="h-4 w-4 text-stone-300/50" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/8 pt-6 text-[0.68rem] uppercase tracking-[0.28em] text-stone-300/50 sm:flex-row sm:items-center sm:justify-between">
          <span>&copy; {new Date().getFullYear()} Traveller&apos;s Diary</span>
          <span>Built for journeys that deserve their own light.</span>
        </div>
      </div>
    </footer>
  );
}
