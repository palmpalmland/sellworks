import { motion } from 'motion/react';
import { Link as LinkIcon, Upload, ArrowRight } from 'lucide-react';

interface HeroProps {
  onGenerate: (url: string) => void;
}

export default function Hero({ onGenerate }: HeroProps) {
  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-6 py-32">
      {/* Background Glows */}
      <div className="absolute top-0 -z-10 h-full w-full">
        <div className="absolute top-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-[#6C5CE7]/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-[#00D4FF]/10 blur-[120px] animate-pulse" />
        <div className="absolute top-[20%] left-[50%] -translate-x-1/2 h-[800px] w-full bg-[radial-gradient(circle_at_50%_0%,rgba(108,92,231,0.08)_0%,transparent_70%)]" />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-5xl text-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium backdrop-blur-md"
        >
          <span className="flex h-2 w-2 rounded-full bg-[#6C5CE7] animate-ping" />
          <span className="text-white/80">New: TikTok Shop Integration Live</span>
        </motion.div>

        <h1 className="text-5xl font-black tracking-tight sm:text-7xl lg:text-8xl leading-[1.05]">
          Turn any product into <br />
          <span className="gradient-text">high-converting ads</span> <br />
          in 60 seconds
        </h1>
        
        <p className="mx-auto mt-8 max-w-2xl text-lg text-subtext sm:text-xl leading-relaxed">
          Sellworks analyzes your product and generates everything you need to sell — Amazon-ready images, TikTok ads, and conversion-optimized copy.
        </p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mx-auto mt-16 w-full max-w-3xl"
        >
          <div className="glass-card group relative flex flex-col gap-4 p-5 sm:flex-row sm:items-center transition-all duration-500 hover:border-white/10 hover:shadow-[0_0_50px_rgba(108,92,231,0.15)]">
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-subtext group-focus-within:text-[#6C5CE7] transition-colors">
                <LinkIcon size={22} />
              </div>
              <input 
                type="text" 
                placeholder="Paste Amazon, Shopify, or TikTok Shop product link"
                className="h-16 w-full rounded-2xl bg-background/40 pl-14 pr-4 text-white placeholder:text-subtext/40 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 transition-all"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <button className="flex h-16 items-center gap-2 rounded-2xl border border-white/5 bg-white/5 px-6 font-semibold text-white hover:bg-white/10 transition-all">
                <Upload size={20} />
                <span className="hidden sm:inline">Upload</span>
              </button>
              
              <button 
                onClick={() => onGenerate("https://amazon.com/product")}
                className="gradient-button flex h-16 items-center gap-3 rounded-2xl px-10 font-bold text-white"
              >
                <span>Generate</span>
                <ArrowRight size={22} />
              </button>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-3">
            <span className="text-sm text-subtext/60">No link?</span>
            <button 
              onClick={() => onGenerate("https://amazon.com/example-blender")}
              className="text-sm font-bold text-[#6C5CE7] hover:text-[#00D4FF] transition-colors underline underline-offset-4"
            >
              Try an example product
            </button>
          </div>
          
          <div className="mt-10 flex items-center justify-center gap-10 text-sm font-bold uppercase tracking-[0.2em] text-subtext/40">
            <span className="hover:text-subtext transition-colors cursor-default">Amazon</span>
            <span className="hover:text-subtext transition-colors cursor-default">Shopify</span>
            <span className="hover:text-subtext transition-colors cursor-default">TikTok Shop</span>
            <span className="hover:text-subtext transition-colors cursor-default">Meta</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
