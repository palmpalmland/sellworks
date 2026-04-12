import { motion } from 'motion/react';

const steps = [
  {
    number: "01",
    title: "Paste your product link",
    description: "Simply drop a link from Amazon, Shopify, or TikTok Shop into our AI engine.",
  },
  {
    number: "02",
    title: "Sellworks generates your kit",
    description: "Our AI analyzes the product and generates your entire content system in seconds.",
  },
  {
    number: "03",
    title: "Export and use across platforms",
    description: "Download your high-res images, videos, and copy to launch your ads instantly.",
  }
];

export default function HowItWorks() {
  return (
    <section className="section-container">
      <div className="mb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#00D4FF]/10 px-4 py-1 text-sm font-bold text-[#00D4FF] border border-[#00D4FF]/20"
        >
          The Process
        </motion.div>
        <h2 className="text-4xl font-black tracking-tight sm:text-6xl">
          How <span className="gradient-text">Sellworks</span> works
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        {steps.map((step, index) => (
          <motion.div 
            key={index} 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2, duration: 0.8 }}
            className="relative flex flex-col items-center text-center"
          >
            <div className="group relative mb-10">
              <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-[#6C5CE7] to-[#00D4FF] opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-20" />
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white/5 border border-white/5 text-4xl font-black text-[#6C5CE7] transition-all duration-500 group-hover:scale-110 group-hover:border-[#6C5CE7]/30 group-hover:bg-[#6C5CE7]/10">
                {step.number}
              </div>
            </div>
            <h3 className="mb-4 text-2xl font-bold tracking-tight">{step.title}</h3>
            <p className="text-subtext text-lg leading-relaxed">
              {step.description}
            </p>
            
            {index < steps.length - 1 && (
              <div className="absolute right-0 top-12 hidden h-0.5 w-1/2 bg-gradient-to-r from-[#6C5CE7]/20 via-[#00D4FF]/20 to-transparent lg:block" />
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
