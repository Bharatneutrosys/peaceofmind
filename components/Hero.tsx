"use client";

import { motion, Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
      delayChildren: 0.4,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
      {/* Background Image: High-quality misty forest / mountain scene */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-[20s] ease-out hover:scale-105"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=2560&auto=format&fit=crop")',
        }}
      />
      
      {/* Premium Dark Vignette Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/40 opacity-90" />
      <div className="absolute inset-0 z-10 bg-black/30 backdrop-blur-[2px]" />

      {/* Content Container */}
      <motion.div
        className="relative z-20 flex flex-col items-center justify-center text-center px-6 w-full max-w-4xl mx-auto mt-20"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={itemVariants} className="mb-6 flex items-center justify-center space-x-3">
           <div className="h-[1px] w-8 bg-zinc-400"></div>
           <span className="text-zinc-300 font-sans tracking-[0.3em] uppercase text-xs font-light">Volume I</span>
           <div className="h-[1px] w-8 bg-zinc-400"></div>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="font-serif text-5xl md:text-7xl lg:text-[6rem] text-zinc-50 tracking-wide leading-[1.1]"
          style={{ textShadow: "0 4px 20px rgba(0,0,0,0.5)" }}
        >
          The World is<br/>Quiet Here.
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="font-sans mt-10 text-base md:text-lg lg:text-xl text-zinc-300 max-w-xl font-light leading-relaxed tracking-wide"
        >
          Return to the earth. A mindful exploration of slow travel, where the journey itself becomes the sanctuary.
        </motion.p>

        <motion.div variants={itemVariants} className="mt-16">
          <button className="group relative px-8 py-4 bg-transparent text-zinc-100 font-sans text-xs uppercase tracking-[0.25em] overflow-hidden border border-zinc-500/50 hover:border-zinc-300 transition-colors duration-500">
            <div className="absolute inset-0 bg-zinc-100 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1] z-0"></div>
            <span className="relative z-10 group-hover:text-black transition-colors duration-500">Enter the Sanctuary</span>
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
