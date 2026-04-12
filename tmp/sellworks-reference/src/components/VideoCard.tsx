import { motion } from 'motion/react';
import { Download, RefreshCw, Play, Zap } from 'lucide-react';

interface VideoCardProps {
  videoUrl: string;
}

export default function VideoCard({ videoUrl }: VideoCardProps) {
  return (
    <div className="glass-card overflow-hidden group/video">
      <div className="relative aspect-[9/16] max-h-[600px] mx-auto w-full max-w-[340px] bg-black rounded-[32px] overflow-hidden border border-white/10 shadow-2xl">
        {/* Mock Video Placeholder */}
        <img 
          src="https://picsum.photos/seed/product-video/1080/1920" 
          alt="Video Preview" 
          className="h-full w-full object-cover opacity-80 transition-transform duration-700 group-hover/video:scale-105"
          referrerPolicy="no-referrer"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-2xl transition-all hover:bg-white/20"
          >
            <Play className="ml-1 h-8 w-8 fill-white" />
          </motion.div>
        </div>

        {/* TikTok Style UI Elements */}
        <div className="absolute right-4 bottom-32 flex flex-col gap-6 items-center">
          <div className="flex flex-col items-center gap-1">
            <div className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[#6C5CE7] to-[#00D4FF]" />
            </div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
              <span className="text-white text-xs font-bold">12k</span>
            </div>
          </div>
        </div>

        {/* Video Info Overlay */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex gap-2 mb-4">
            <span className="rounded-full bg-[#6C5CE7] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">Viral Hook</span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-md border border-white/10">UGC</span>
          </div>
          <h4 className="text-sm font-bold text-white line-clamp-2 leading-relaxed">
            This portable blender is a game changer for my morning routine! 🥤✨ #lifestyle #musthave
          </h4>
        </div>

        {/* Blur Overlay for Monetization */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black to-transparent backdrop-blur-[4px] flex items-center justify-center">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/80">
            <Zap size={14} className="text-[#00D4FF]" />
            <span>High-Res Export Locked</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between p-8 border-t border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-black uppercase tracking-widest text-black hover:bg-white/90 transition-all shadow-lg active:scale-95">
            <Download size={18} strokeWidth={3} />
            Download
          </button>
          <button className="flex items-center gap-2 rounded-2xl bg-white/5 border border-white/10 px-6 py-3 text-sm font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all active:scale-95">
            <RefreshCw size={18} strokeWidth={3} />
            Remix
          </button>
        </div>
        
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-subtext">
          9:16 Vertical • 4K AI Render
        </div>
      </div>
    </div>
  );
}
