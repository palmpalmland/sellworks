import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

const examples = [
  {
    title: "Portable Blender",
    type: "Content Kit",
    image: "https://picsum.photos/seed/blender/400/400",
  },
  {
    title: "Ergonomic Chair",
    type: "TikTok Ad",
    image: "https://picsum.photos/seed/chair/400/400",
  },
  {
    title: "Smart Watch",
    type: "Amazon Listing",
    image: "https://picsum.photos/seed/watch/400/400",
  },
  {
    title: "Coffee Maker",
    type: "UGC Video",
    image: "https://picsum.photos/seed/coffee/400/400",
  }
];

export default function InspirationSection() {
  return (
    <section className="section-container">
      <div className="mb-16 flex flex-col items-center text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#6C5CE7]/10 px-4 py-1 text-sm font-bold text-[#6C5CE7] border border-[#6C5CE7]/20"
          >
            Community Gallery
          </motion.div>
          <h2 className="text-4xl font-black tracking-tight sm:text-6xl">Get Inspired</h2>
          <p className="mt-4 text-subtext text-lg">See what others are creating with Sellworks.</p>
        </div>
        <button className="mt-8 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-[#6C5CE7] hover:text-[#00D4FF] transition-colors sm:mt-0">
          View All Examples
          <ArrowUpRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {examples.map((example, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -12 }}
            className="group glass-card cursor-pointer overflow-hidden transition-all duration-500 hover:border-[#6C5CE7]/30 hover:shadow-[0_20px_40px_rgba(108,92,231,0.1)]"
          >
            <div className="aspect-square overflow-hidden bg-black/20">
              <img 
                src={example.image} 
                alt={example.title} 
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-6">
              <div className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#6C5CE7]">
                {example.type}
              </div>
              <h3 className="text-xl font-bold tracking-tight">{example.title}</h3>
              <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-subtext group-hover:text-white transition-colors">
                <span>Simulate demo</span>
                <ArrowUpRight size={16} className="opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
