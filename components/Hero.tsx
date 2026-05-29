"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-stone-900">
      
      {/* Cinematic Ken Burns Background */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2574&auto=format&fit=crop")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}

        animate={{
          scale: [1.05, 1.2, 1.05], // Zooms in further
          x: ["0%", "-6%", "0%"],   // Pans much wider horizontally
          y: ["0%", "-2%", "0%"],   // Adds a slight vertical tilt
        }}
        transition={{
          duration: 18,             // Sliced from 40s down to 18s for noticeable speed
          ease: "easeInOut",        // Makes the turnaround at the edges smooth
          repeat: Infinity,
        }}
      />

      {/* Dark Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      {/* Hero Text Content */}
      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 drop-shadow-lg">
          Life of a Traveller
        </h1>
        <p className="text-lg md:text-2xl text-stone-200 font-medium drop-shadow-md">
          Discovering the world, one journey at a time.
        </p>
      </div>

    </section>
  );
}