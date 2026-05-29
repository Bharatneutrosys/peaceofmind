export default function Footer() {
  return (
    <footer className="w-full bg-[#050505] py-24 px-6 md:px-12 border-t border-zinc-900 z-20 relative">
      <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
        
        <h3 className="font-serif text-2xl md:text-3xl text-zinc-100 tracking-wide mb-6">
          Travel for peace of mind.<br/>Nature is home.
        </h3>
        
        <div className="h-[1px] w-12 bg-zinc-800 my-10"></div>
        
        <div className="flex flex-col md:flex-row items-center justify-between w-full">
          <span className="font-serif text-xl text-zinc-500 tracking-widest mb-4 md:mb-0">
            Sanu's Diary
          </span>
          
          <div className="flex space-x-6">
            {["Instagram", "Twitter", "Email"].map((link) => (
              <a key={link} href="#" className="text-zinc-600 hover:text-zinc-300 font-sans text-xs uppercase tracking-widest transition-colors duration-300">
                {link}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-16 w-full flex flex-col md:flex-row items-center justify-between text-zinc-700 font-sans text-[10px] uppercase tracking-[0.2em]">
          <span>&copy; {new Date().getFullYear()} Sanu's Diary. All rights reserved.</span>
          <span className="mt-2 md:mt-0">Designed thoughtfully.</span>
        </div>

      </div>
    </footer>
  );
}
