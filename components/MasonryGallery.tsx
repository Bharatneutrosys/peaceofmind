"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const images = [
  { id: "1", url: "https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=1000&auto=format&fit=crop", caption: "Silent Valleys" },
  { id: "2", url: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?q=80&w=800&auto=format&fit=crop", caption: "Distant Horizons" },
  { id: "3", url: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?q=80&w=1200&auto=format&fit=crop", caption: "Rivers of Time" },
  { id: "4", url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=900&auto=format&fit=crop", caption: "Into the Wild" },
  { id: "5", url: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=1000&auto=format&fit=crop", caption: "Forest Canopy" },
  { id: "6", url: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?q=80&w=1100&auto=format&fit=crop", caption: "Mountain Retreat" },
  { id: "7", url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=950&auto=format&fit=crop", caption: "Morning Mist" },
  { id: "8", url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1050&auto=format&fit=crop", caption: "Alpine Lakes" },
];

export default function MasonryGallery() {
  const [selectedImage, setSelectedImage] = useState<typeof images[0] | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section className="relative w-full bg-[#0a0a0a] py-32 px-4 md:px-8 lg:px-12 z-20">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-20 text-center flex flex-col items-center">
          <span className="text-zinc-500 font-sans tracking-[0.3em] uppercase text-xs mb-4 block">The Collection</span>
          <h2 className="font-serif text-4xl md:text-5xl text-zinc-100 tracking-wide">Visual Journeys</h2>
          <div className="h-[1px] w-12 bg-zinc-700 mt-8"></div>
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {images.map((img) => (
            <motion.div
              key={img.id}
              className="relative overflow-hidden cursor-pointer group break-inside-avoid"
              onMouseEnter={() => setHoveredId(img.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => setSelectedImage(img)}
              animate={{
                opacity: hoveredId && hoveredId !== img.id ? 0.35 : 1,
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div className="w-full h-full transform transition-transform duration-[1.5s] ease-[0.16,1,0.3,1] group-hover:scale-[1.03]">
                <motion.img
                  layoutId={`gallery-image-${img.id}`}
                  src={img.url}
                  alt={img.caption}
                  className="w-full h-auto object-cover"
                />
              </div>
              
              {/* Image Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <div className="absolute inset-0 flex flex-col justify-end p-8 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0 pointer-events-none">
                <span className="text-zinc-100 font-sans text-xs tracking-[0.25em] uppercase font-light">
                  {img.caption}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox Overlay */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-12"
              onClick={() => setSelectedImage(null)}
            >
              {/* Close Button */}
              <button
                className="absolute top-6 right-6 md:top-10 md:right-10 text-zinc-500 hover:text-white transition-colors z-[110]"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(null);
                }}
              >
                <X size={32} strokeWidth={1} />
              </button>

              <div 
                className="relative max-w-6xl w-full h-full flex flex-col items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <motion.img
                  layoutId={`gallery-image-${selectedImage.id}`}
                  src={selectedImage.url}
                  alt={selectedImage.caption}
                  className="w-auto h-auto max-w-full max-h-[85vh] object-contain shadow-2xl cursor-default"
                />
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="absolute bottom-4 md:bottom-0 text-center pointer-events-none"
                >
                  <span className="text-zinc-300 font-serif text-2xl md:text-3xl tracking-wider">
                    {selectedImage.caption}
                  </span>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
      </div>
    </section>
  );
}
