import { motion } from 'motion/react';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-[100] w-full border-b border-white/5 bg-background/60 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-12">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-gradient-to-br from-[#6C5CE7] to-[#00D4FF] transition-transform duration-500 group-hover:rotate-12">
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-2xl font-black tracking-tighter">Sellworks</span>
        </div>
        
        <div className="hidden items-center gap-10 md:flex">
          <a href="#product" className="text-sm font-bold uppercase tracking-widest text-subtext hover:text-white transition-all">Product</a>
          <a href="#demo" className="text-sm font-bold uppercase tracking-widest text-subtext hover:text-white transition-all">Demo</a>
          <a href="#pricing" className="text-sm font-bold uppercase tracking-widest text-subtext hover:text-white transition-all">Pricing</a>
          <button className="rounded-2xl bg-white px-7 py-3 text-sm font-black uppercase tracking-widest text-black hover:bg-white/90 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            Start Free
          </button>
        </div>
        
        <button className="md:hidden text-subtext hover:text-white transition-colors">
          <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
