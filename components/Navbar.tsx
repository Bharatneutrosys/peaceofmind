"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={"fixed top-0 left-0 w-full z-[200] transition-all duration-500 border-b " + (
        scrolled
          ? "bg-[#0a0a0a]/80 backdrop-blur-xl border-zinc-800/50 py-4"
          : "bg-transparent border-transparent py-6"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link href="/" className="group flex items-center">
          <span className="font-serif text-2xl text-zinc-100 tracking-wider">
            Sanu's Diary
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-10">
          {["Destinations", "Journal", "Philosophy"].map((item) => (
            <Link
              key={item}
              href={"#" + item.toLowerCase()}
              className="relative group py-2"
            >
              <span className="text-zinc-300 font-sans text-xs uppercase tracking-[0.2em] font-light group-hover:text-white transition-colors duration-300">
                {item}
              </span>
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white transition-all duration-500 ease-out group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        <button className="md:hidden text-zinc-300 hover:text-white transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="12" x2="20" y2="12"></line>
            <line x1="4" y1="6" x2="20" y2="6"></line>
            <line x1="4" y1="18" x2="20" y2="18"></line>
          </svg>
        </button>
      </div>
    </header>
  );
}
