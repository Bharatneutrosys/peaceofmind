import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

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

export default function Footer({
  brandName = "Traveller's Diary",
  tagline,
  shortDescription,
  socialLinks,
}: {
  brandName?: string;
  tagline?: string | null;
  shortDescription?: string | null;
  socialLinks?: SocialLinks;
}) {
  const socials = socialItems(socialLinks);
  const closingLine = tagline || shortDescription || "Built for journeys that deserve their own light.";

  const footerLinks = [
    { label: "Destinations", href: "#destinations" },
    { label: "Journal", href: "#journal" },
    { label: "Gallery", href: "#gallery" },
    { label: "Videos", href: "#videos" },
    { label: "Philosophy", href: "#philosophy" },
  ];

  return (
    <footer className="relative border-t border-white/8 bg-stone-950 px-6 py-16 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(14rem,0.65fr)_minmax(14rem,0.65fr)]">
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-stone-300/55">
              {brandName}
            </p>
            <h3 className="mt-4 max-w-2xl font-serif text-3xl leading-tight text-stone-50 md:text-4xl">
              {closingLine}
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
              {socials.length > 0 ? (
                socials.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="flex items-center justify-between border-b border-white/8 pb-3 text-sm text-stone-200/78 transition-colors duration-300 hover:text-stone-50"
                  >
                    {link.label}
                    <ArrowUpRight className="h-4 w-4 text-stone-300/50" />
                  </a>
                ))
              ) : (
                <div className="space-y-3">
                  {["Facebook", "Instagram", "YouTube"].map((label) => (
                    <div
                      key={label}
                      className="flex items-center justify-between border-b border-white/8 pb-3 text-sm text-stone-500"
                    >
                      {label}
                      <span className="text-[0.68rem] uppercase tracking-[0.24em] text-stone-500">
                        Pending
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/8 pt-6 text-[0.68rem] uppercase tracking-[0.28em] text-stone-300/50 sm:flex-row sm:items-center sm:justify-between">
          <span>&copy; {new Date().getFullYear()} {brandName}</span>
          <span>Built for journeys that deserve their own light.</span>
        </div>
      </div>
    </footer>
  );
}
