import { motion } from 'motion/react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-background py-20">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#6C5CE7] to-[#00D4FF]" />
              <span className="text-xl font-black tracking-tighter">Sellworks</span>
            </div>
            <p className="mt-6 text-sm leading-relaxed text-subtext">
              The first AI content agent built specifically for high-volume ecommerce brands.
            </p>
          </div>
          
          <div>
            <h4 className="mb-6 text-xs font-black uppercase tracking-[0.2em] text-white">Product</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-sm text-subtext hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="text-sm text-subtext hover:text-white transition-colors">Demo</a></li>
              <li><a href="#" className="text-sm text-subtext hover:text-white transition-colors">Pricing</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="mb-6 text-xs font-black uppercase tracking-[0.2em] text-white">Company</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-sm text-subtext hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="text-sm text-subtext hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-sm text-subtext hover:text-white transition-colors">Careers</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="mb-6 text-xs font-black uppercase tracking-[0.2em] text-white">Legal</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-sm text-subtext hover:text-white transition-colors">Privacy</a></li>
              <li><a href="#" className="text-sm text-subtext hover:text-white transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-20 border-t border-white/5 pt-10 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-subtext/40">
            © {new Date().getFullYear()} Sellworks AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
