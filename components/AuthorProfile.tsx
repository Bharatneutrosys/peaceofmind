export default function AuthorProfile() {
  return (
    <section id="philosophy" className="w-full bg-[#f4f4f0] text-zinc-900 py-32 px-6 md:px-12 z-20 relative">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
        {/* Left Side: Editorial Image */}
        <div className="relative">
          {/* Subtle offset background block */}
          <div className="absolute top-6 -left-6 w-full h-full bg-zinc-200/50 border border-zinc-300 z-0 hidden md:block"></div>
          
          <div className="relative z-10 aspect-[4/5] w-full overflow-hidden shadow-xl">
            <img 
              src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=1000&auto=format&fit=crop" 
              alt="A quiet traveler looking over a landscape"
              className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
            />
          </div>
        </div>

        {/* Right Side: Text Content */}
        <div className="flex flex-col justify-center">
          <span className="text-zinc-500 font-sans tracking-[0.2em] uppercase text-xs mb-6 block">
            About Sanu's Diary
          </span>
          
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-zinc-800 tracking-wide leading-tight mb-8">
            Finding peace in the pulse of the earth.
          </h2>
          
          <div className="space-y-6 text-zinc-600 font-sans text-base md:text-lg font-light leading-relaxed tracking-wide">
            <p>
              In a world that constantly demands our speed and attention, slow travel is an act of rebellion. It is the conscious choice to stop skimming the surface of destinations and instead let them seep into our bones. When we walk the ancient trails, we don't just observe nature—we remember that we are part of it.
            </p>
            <p>
              This diary is a collection of quiet moments. A testament to the belief that the most profound discoveries happen when we leave our itineraries behind and simply allow the earth to guide us home. 
            </p>
          </div>

          {/* Signature */}
          <div className="mt-12 flex items-center space-x-4">
            <div className="h-[1px] w-8 bg-zinc-400"></div>
            <span className="font-serif italic text-2xl text-zinc-500">Sanu</span>
          </div>
        </div>
      </div>
    </section>
  );
}
