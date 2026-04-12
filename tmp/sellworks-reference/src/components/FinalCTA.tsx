import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section className="section-container">
      <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-[#6C5CE7] to-[#00D4FF] p-12 text-center sm:p-24">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 h-full w-full opacity-20">
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-white blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-white blur-3xl" />
        </div>
        
        <div className="relative z-10 mx-auto max-w-3xl">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-black tracking-tighter text-white sm:text-7xl"
          >
            Ready to scale your ecommerce content?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-8 text-xl font-medium text-white/90 sm:text-2xl"
          >
            Join 2,000+ brands using Sellworks to launch products 10x faster.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row"
          >
            <button className="w-full rounded-2xl bg-white px-10 py-5 text-lg font-black uppercase tracking-widest text-[#6C5CE7] transition-all hover:scale-105 hover:shadow-2xl active:scale-95 sm:w-auto">
              Start Free Trial
            </button>
            <button className="w-full rounded-2xl border-2 border-white/30 px-10 py-5 text-lg font-black uppercase tracking-widest text-white backdrop-blur-sm transition-all hover:bg-white/10 sm:w-auto">
              Book a Demo
            </button>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-8 text-sm font-bold uppercase tracking-widest text-white/60"
          >
            No credit card required • 7-day free trial
          </motion.p>
        </div>
      </div>
    </section>
  );
}
