"use client";

import { motion, Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Background Image Placeholder */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2070&auto=format&fit=crop")',
        }}
      />
      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-black/60 to-black/90" />

      {/* Content */}
      <motion.div
        className="relative z-20 flex flex-col items-center justify-center text-center px-4 md:px-6 w-full max-w-5xl"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.h1
          variants={itemVariants}
          className="font-serif text-5xl md:text-7xl lg:text-8xl text-white tracking-tight leading-tight"
        >
          Life of a Traveller
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="font-sans mt-6 text-lg md:text-xl lg:text-2xl text-zinc-300 max-w-2xl font-light"
        >
          Explore the world through my lens
        </motion.p>

        <motion.div variants={itemVariants} className="mt-12">
          <button className="px-10 py-4 bg-white text-black font-sans text-xs md:text-sm uppercase tracking-[0.2em] hover:bg-zinc-200 transition-colors duration-300">
            View Journeys
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
