"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Destinations", href: "/destinations" },
  { label: "Journal", href: "/journal" },
  { label: "Gallery", href: "/gallery" },
  { label: "Videos", href: "/videos" },
  { label: "About", href: "/about" },
];

type SocialLinks = {
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  youtubeUrl?: string | null;
};

function socialItems(socialLinks?: SocialLinks) {
  return [
    socialLinks?.facebookUrl
      ? { label: "Facebook", href: socialLinks.facebookUrl }
      : null,
    socialLinks?.instagramUrl
      ? { label: "Instagram", href: socialLinks.instagramUrl }
      : null,
    socialLinks?.youtubeUrl ? { label: "YouTube", href: socialLinks.youtubeUrl } : null,
  ].filter(Boolean) as Array<{ label: string; href: string }>;
}

export default function Navbar({
  brandName = "Traveller's Diary",
  socialLinks,
}: {
  brandName?: string;
  socialLinks?: SocialLinks;
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const socials = useMemo(() => socialItems(socialLinks), [socialLinks]);
  const isActiveRoute = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 18);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <>
      <header
        className={
          "fixed left-0 top-0 z-[200] w-full border-b transition-[background-color,border-color,box-shadow] duration-500 " +
          (scrolled
            ? "border-white/10 bg-stone-950/80 shadow-[0_18px_50px_rgba(0,0,0,0.28)] backdrop-blur-xl"
            : "border-transparent bg-transparent")
        }
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-12">
          <Link
            href="/"
            className="group inline-flex items-center gap-3"
            onClick={() => setMenuOpen(false)}
          >
            <span className="relative h-12 w-12 overflow-hidden rounded-full border border-amber-100/30 bg-white shadow-[0_12px_30px_rgba(0,0,0,0.3)] ring-1 ring-black/10">
              <Image
                src="/logo/logo.png"
                alt=""
                fill
                priority
                sizes="48px"
                className="object-cover"
              />
            </span>
            <span className="font-serif text-lg leading-none text-stone-50 transition-colors group-hover:text-amber-100 sm:text-xl">
              {brandName}
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActiveRoute(item.href) ? "page" : undefined}
                className={
                  "group relative py-2 text-[0.72rem] uppercase tracking-[0.24em] transition-colors duration-300 " +
                  (isActiveRoute(item.href)
                    ? "text-stone-50"
                    : "text-stone-200/72 hover:text-stone-50")
                }
              >
                {item.label}
                <span
                  className={
                    "absolute inset-x-0 -bottom-0.5 h-px bg-stone-50 transition-transform duration-300 " +
                    (isActiveRoute(item.href)
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100")
                  }
                />
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {socials.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="rounded-full border border-white/10 bg-white/6 px-3 py-2 text-[0.68rem] uppercase tracking-[0.2em] text-stone-100/72 transition-colors duration-300 hover:bg-white/12"
              >
                {item.label}
              </a>
            ))}
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/6 text-stone-100 transition-colors duration-300 hover:bg-white/12 md:hidden"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      <div
        id="mobile-navigation"
        className={
          "fixed inset-0 z-[190] flex flex-col justify-end bg-stone-950/92 px-6 pb-8 pt-24 backdrop-blur-2xl transition-opacity duration-300 md:hidden " +
          (menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0")
        }
        aria-hidden={!menuOpen}
      >
        <div className="mb-8 rounded-[1.75rem] border border-white/10 bg-white/6 p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-stone-200/55">
            {brandName}
          </p>
          <p className="mt-3 max-w-sm text-sm leading-7 text-stone-200/82">
            Travel notes, photos, and videos from places worth remembering.
          </p>
        </div>

        <nav className="space-y-3">
          {navItems.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between rounded-[1.25rem] border border-white/10 bg-white/6 px-4 py-4 text-xl font-light tracking-[0.06em] text-stone-50 transition-colors duration-300 hover:bg-white/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-100/70 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950 sm:text-2xl"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
              <span className="text-sm text-stone-300/60">0{index + 1}</span>
            </Link>
          ))}
        </nav>

        {socials.length > 0 ? (
          <div className="mt-6 grid grid-cols-3 gap-3">
            {socials.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="rounded-full border border-white/10 bg-white/6 px-3 py-3 text-center text-[0.7rem] uppercase tracking-[0.2em] text-stone-100/72 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-100/70 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </>
  );
}
