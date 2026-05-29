export default function EditorialEssay() {
  return (
    <article className="w-full bg-[#0a0a0a] py-32 px-5 md:px-8 z-20 relative">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="mb-16 text-center">
          <span className="text-zinc-500 font-sans tracking-[0.2em] uppercase text-xs mb-6 block">Journal Entry</span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-zinc-100 tracking-wide leading-tight mb-8">
            Sanu's Diary:<br/>The Silence of the Pines
          </h2>
          <div className="flex items-center justify-center space-x-4">
            <span className="text-zinc-500 text-xs md:text-sm font-light uppercase tracking-widest">October 14, 2023</span>
            <div className="w-1 h-1 bg-zinc-700 rounded-full"></div>
            <span className="text-zinc-500 text-xs md:text-sm font-light uppercase tracking-widest">5 min read</span>
          </div>
        </header>

        {/* Body */}
        <div className="text-zinc-300 font-sans text-lg font-light leading-[2.2] tracking-wide">
          
          {/* Drop cap paragraph */}
          <p className="first-letter:float-left first-letter:text-[5.5rem] first-letter:leading-[4.5rem] first-letter:pr-4 first-letter:pt-2 first-letter:font-serif first-letter:text-zinc-100 mb-8">
            There is a profound stillness that settles over the mountains just before dawn. The mist hangs low, clinging to the ancient pines as if trying to keep the forest asleep for just a few moments longer. Walking through this quiet landscape, I found myself instinctively softening my footsteps, reluctant to disturb the absolute peace of the morning.
          </p>
          
          <p className="mb-8">
            In our modern lives, we are constantly bombarded by noise—the hum of traffic, the endless pinging of notifications, the relentless pace of productivity. But out here, the concept of time begins to dissolve. The trees do not rush. The river carves its path with infinite patience.
          </p>

          {/* Pull Quote */}
          <blockquote className="my-20 py-10 border-y border-zinc-800/50 text-center relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0a0a0a] px-4">
              <span className="text-zinc-700 text-3xl font-serif">"</span>
            </div>
            <p className="font-serif text-2xl md:text-3xl italic text-zinc-100 leading-relaxed max-w-xl mx-auto">
              To disappear into the forest is not to lose oneself, but to finally be quiet enough to hear who we have always been.
            </p>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-[#0a0a0a] px-4 transform rotate-180">
              <span className="text-zinc-700 text-3xl font-serif">"</span>
            </div>
          </blockquote>

          <p className="mb-12">
            As the first rays of sunlight broke through the canopy, illuminating the mist in strokes of gold, I realized that travel is not just about moving across geography. It is an internal migration. Every destination we truly connect with mirrors a part of our own soul that has been waiting to be acknowledged.
          </p>

          {/* Inline Image */}
          <figure className="my-16">
            <img 
              src="https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=1200&auto=format&fit=crop" 
              alt="Sunlight piercing through a dense pine forest"
              className="w-full h-auto aspect-[16/10] object-cover rounded-sm opacity-90 transition-opacity hover:opacity-100 duration-700"
            />
            <figcaption className="text-center text-zinc-600 text-[10px] mt-6 tracking-[0.2em] uppercase">
              Morning light filtering through the ancient canopy.
            </figcaption>
          </figure>

          <p className="mb-8">
            I sat on a moss-covered log for hours, just watching the light shift. No agenda. No itinerary. Just the simple, profound act of being present. When I finally packed my bag to head back down the trail, I didn't feel like I was leaving the forest behind. I was carrying its silence with me.
          </p>
        </div>
        
        {/* Footer Divider */}
        <div className="mt-32 flex justify-center">
          <div className="h-[1px] w-12 bg-zinc-700"></div>
        </div>
      </div>
    </article>
  );
}
