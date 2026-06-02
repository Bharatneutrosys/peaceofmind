"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";

type SocialLinks = {
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  youtubeUrl?: string | null;
};

export default function SiteChrome({
  brandName,
  tagline,
  shortDescription,
  socialLinks,
  children,
}: {
  brandName: string;
  tagline?: string | null;
  shortDescription?: string | null;
  socialLinks?: SocialLinks;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isStudio = pathname?.startsWith("/studio") || pathname?.startsWith("/admin");

  if (isStudio) {
    return <>{children}</>;
  }

  return (
    <SmoothScrollProvider>
      <Navbar brandName={brandName} socialLinks={socialLinks} />
      <div className="flex-grow flex flex-col">{children}</div>
      <Footer
        brandName={brandName}
        tagline={tagline}
        shortDescription={shortDescription}
        socialLinks={socialLinks}
      />
    </SmoothScrollProvider>
  );
}
