"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-stone-900">
      
      {/* Cinematic Panoramic Drone Flight Background */}
      <motion.div
        className="absolute inset-y-0 left-0 w-[125%] h-full z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1605649487212-47bdab064df7?q=80&w=2670&auto=format&fit=crop")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        animate={{
          // Slowly drifts horizontally while executing a luxurious, gentle zoom
          x: ["0%", "-18%", "0%"],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 24,            // Perfect speed: noticeable movement without feeling rushed
          ease: "easeInOut",       // Mimics a drone pilot smoothly accelerating and braking
          repeat: Infinity,
        }}
      />

      {/* Dark Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 bg-black/45 z-10" />

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