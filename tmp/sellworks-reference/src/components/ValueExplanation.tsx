import { motion } from 'motion/react';
import { FileText, Image as ImageIcon, Video, Zap } from 'lucide-react';

const features = [
  {
    title: "Product Listing Copy",
    description: "SEO-optimized titles, bullets, and descriptions that rank and convert.",
    icon: <FileText className="text-[#6C5CE7]" />,
  },
  {
    title: "Amazon-Ready Images",
    description: "High-quality white background and lifestyle visuals generated instantly.",
    icon: <ImageIcon className="text-[#00D4FF]" />,
  },
  {
    title: "TikTok Ad Creatives",
    description: "Scroll-stopping video ads with hooks and UGC-style formatting.",
    icon: <Video className="text-[#6C5CE7]" />,
  },
  {
    title: "Multiple Hook Variations",
    description: "Test different angles to find what resonates with your audience.",
    icon: <Zap className="text-[#00D4FF]" />,
  }
];

export default function ValueExplanation() {
  return (
    <section className="section-container">
      <div className="mb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#6C5CE7]/10 px-4 py-1 text-sm font-bold text-[#6C5CE7] border border-[#6C5CE7]/20"
        >
          The Sellworks Advantage
        </motion.div>
        <h2 className="text-4xl font-black tracking-tight sm:text-6xl">
          From one product link to a <br />
          <span className="gradient-text">full content kit</span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-subtext leading-relaxed">
          Most tools generate one asset at a time. Sellworks analyzes your product and generates your entire marketing system in seconds.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className="glass-card group p-8 transition-all duration-500 hover:bg-white/[0.03] hover:border-white/10"
          >
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 border border-white/5 group-hover:border-[#6C5CE7]/30 group-hover:bg-[#6C5CE7]/10 transition-all duration-500">
              {feature.icon}
            </div>
            <h3 className="mb-3 text-xl font-bold tracking-tight">{feature.title}</h3>
            <p className="text-sm leading-relaxed text-subtext group-hover:text-white/70 transition-colors">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
