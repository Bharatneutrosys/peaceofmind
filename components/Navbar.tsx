"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const navItems = ["Destinations", "Journal", "Philosophy"];

  return (
    <>
      <header
        className={"fixed top-0 left-0 w-full z-[200] transition-all duration-500 border-b " + (
          scrolled
            ? "bg-[#0a0a0a]/80 backdrop-blur-xl border-zinc-800/50 py-4"
            : "bg-transparent border-transparent py-6"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="group flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
            <span className="font-serif text-2xl text-zinc-100 tracking-wider">
              Sanu's Diary
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-10">
            {navItems.map((item) => (
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

          <button 
            className="md:hidden text-zinc-300 hover:text-white transition-colors z-[210] relative"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={28} strokeWidth={1.5} /> : <Menu size={28} strokeWidth={1.5} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-[190] bg-black/90 backdrop-blur-xl transition-opacity duration-300 md:hidden flex flex-col justify-center items-center ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col items-center space-y-8">
          {navItems.map((item) => (
            <Link
              key={item}
              href={"#" + item.toLowerCase()}
              className="text-2xl font-sans tracking-[0.2em] uppercase font-light text-zinc-300 hover:text-white transition-colors duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
