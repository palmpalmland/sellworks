import { motion } from 'motion/react';
import { Video, Image as ImageIcon, FileText } from 'lucide-react';

export default function OutputShowcase() {
  return (
    <section className="bg-white/[0.01] border-y border-white/5 py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="mb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#6C5CE7]/10 px-4 py-1 text-sm font-bold text-[#6C5CE7] border border-[#6C5CE7]/20"
          >
            The Output
          </motion.div>
          <h2 className="text-4xl font-black tracking-tight sm:text-6xl">
            Everything you need to <br />
            <span className="gradient-text">launch and scale</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-3">
          {/* Video */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="group flex flex-col items-center text-center"
          >
            <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-[24px] bg-[#6C5CE7]/10 border border-[#6C5CE7]/20 transition-all duration-500 group-hover:scale-110 group-hover:bg-[#6C5CE7]/20 group-hover:shadow-[0_0_30px_rgba(108,92,231,0.2)]">
              <Video className="h-10 w-10 text-[#6C5CE7]" />
            </div>
            <h3 className="mb-4 text-2xl font-bold tracking-tight">Video</h3>
            <p className="text-subtext text-lg leading-relaxed group-hover:text-white/70 transition-colors">
              Generate scroll-stopping TikTok-style ads with hooks, captions, and UGC formatting.
            </p>
          </motion.div>

          {/* Images */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="group flex flex-col items-center text-center"
          >
            <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-[24px] bg-[#00D4FF]/10 border border-[#00D4FF]/20 transition-all duration-500 group-hover:scale-110 group-hover:bg-[#00D4FF]/20 group-hover:shadow-[0_0_30px_rgba(0,212,255,0.2)]">
              <ImageIcon className="h-10 w-10 text-[#00D4FF]" />
            </div>
            <h3 className="mb-4 text-2xl font-bold tracking-tight">Images</h3>
            <p className="text-subtext text-lg leading-relaxed group-hover:text-white/70 transition-colors">
              Create Amazon-ready images, lifestyle visuals, and ad creatives instantly.
            </p>
          </motion.div>

          {/* Copy */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="group flex flex-col items-center text-center"
          >
            <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-[24px] bg-[#6C5CE7]/10 border border-[#6C5CE7]/20 transition-all duration-500 group-hover:scale-110 group-hover:bg-[#6C5CE7]/20 group-hover:shadow-[0_0_30px_rgba(108,92,231,0.2)]">
              <FileText className="h-10 w-10 text-[#6C5CE7]" />
            </div>
            <h3 className="mb-4 text-2xl font-bold tracking-tight">Copy</h3>
            <p className="text-subtext text-lg leading-relaxed group-hover:text-white/70 transition-colors">
              Get titles, bullet points, descriptions, and ad hooks optimized for conversion.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
