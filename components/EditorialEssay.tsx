import { PortableText } from '@portabletext/react';

interface EssayProp {
  title: string;
  date: string;
  body: any[];
}

export default function EditorialEssay({ essay }: { essay?: EssayProp | null }) {
  if (!essay) return null;

  return (
    <article className="w-full bg-[#0a0a0a] py-32 px-5 md:px-8 z-20 relative">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="mb-16 text-center">
          <span className="text-zinc-500 font-sans tracking-[0.2em] uppercase text-xs mb-6 block">Journal Entry</span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-zinc-100 tracking-wide leading-tight mb-8">
            {essay.title}
          </h2>
          <div className="flex items-center justify-center space-x-4">
            {essay.date && (
              <span className="text-zinc-500 text-xs md:text-sm font-light uppercase tracking-widest">
                {new Date(essay.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            )}
            {essay.date && <div className="w-1 h-1 bg-zinc-700 rounded-full"></div>}
            <span className="text-zinc-500 text-xs md:text-sm font-light uppercase tracking-widest">5 min read</span>
          </div>
        </header>

        {/* Body */}
        <div className="prose prose-invert prose-zinc prose-lg max-w-none text-zinc-300 font-sans font-light leading-[2.2] tracking-wide prose-headings:font-serif prose-headings:text-zinc-100 prose-a:text-zinc-100 prose-blockquote:font-serif prose-blockquote:text-zinc-100 prose-blockquote:italic prose-blockquote:border-l-zinc-700 prose-strong:text-zinc-100">
          <PortableText value={essay.body} />
        </div>
        
        {/* Footer Divider */}
        <div className="mt-32 flex justify-center">
          <div className="h-[1px] w-12 bg-zinc-700"></div>
        </div>
      </div>
    </article>
  );
}
