import { motion } from 'motion/react';
import { Rocket, TrendingUp, Layers, DollarSign } from 'lucide-react';

const benefits = [
  {
    title: "Launch products faster",
    description: "Go from idea to live listing in minutes, not weeks.",
    icon: <Rocket className="text-[#6C5CE7]" />,
  },
  {
    title: "Increase conversion rates",
    description: "AI-optimized copy and visuals designed to drive sales.",
    icon: <TrendingUp className="text-[#00D4FF]" />,
  },
  {
    title: "Test more creatives",
    description: "Generate dozens of variations to find your winning ad.",
    icon: <Layers className="text-[#6C5CE7]" />,
  },
  {
    title: "Reduce content costs",
    description: "Save thousands on photographers and copywriters.",
    icon: <DollarSign className="text-[#00D4FF]" />,
  }
];

export default function Benefits() {
  return (
    <section className="section-container">
      <div className="mb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#6C5CE7]/10 px-4 py-1 text-sm font-bold text-[#6C5CE7] border border-[#6C5CE7]/20"
        >
          Why Choose Sellworks
        </motion.div>
        <h2 className="text-4xl font-black tracking-tight sm:text-6xl">
          Built for sellers <br />
          <span className="gradient-text">who want results</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        {benefits.map((benefit, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className="glass-card group flex flex-col items-start gap-6 p-10 transition-all duration-500 hover:bg-white/[0.03] hover:border-white/10"
          >
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-white/5 border border-white/5 group-hover:border-[#6C5CE7]/30 group-hover:bg-[#6C5CE7]/10 transition-all duration-500">
              {benefit.icon}
            </div>
            <div>
              <h3 className="mb-3 text-2xl font-bold tracking-tight">{benefit.title}</h3>
              <p className="text-subtext text-lg leading-relaxed group-hover:text-white/70 transition-colors">
                {benefit.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
