import { motion } from 'motion/react';
import { Check, X } from 'lucide-react';

export default function CompetitiveAdvantage() {
  return (
    <section className="section-container">
      <div className="mb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#6C5CE7]/10 px-4 py-1 text-sm font-bold text-[#6C5CE7] border border-[#6C5CE7]/20"
        >
          The Competitive Edge
        </motion.div>
        <h2 className="text-4xl font-black tracking-tight sm:text-6xl">
          Why Sellworks beats <br />
          <span className="gradient-text">traditional AI tools</span>
        </h2>
        <p className="mt-6 text-xl text-subtext italic">
          “Most tools create content. Sellworks creates conversion systems.”
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="glass-card overflow-hidden border-white/10"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-8 py-6 text-xs font-black uppercase tracking-[0.2em] text-subtext">Feature</th>
                <th className="px-8 py-6 text-xs font-black uppercase tracking-[0.2em] text-[#6C5CE7]">Sellworks</th>
                <th className="px-8 py-6 text-xs font-black uppercase tracking-[0.2em] text-subtext/60">Others</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { label: "Full content kit", sellworks: true, others: false },
                { label: "Built for ecommerce", sellworks: true, others: false },
                { label: "Lower cost", sellworks: true, others: false },
                { label: "Multiple variations", sellworks: true, others: false },
                { label: "Single asset generation", sellworks: false, others: true },
              ].map((row, i) => (
                <tr key={i} className="group hover:bg-white/[0.01] transition-colors">
                  <td className="px-8 py-6 font-bold tracking-tight">{row.label}</td>
                  <td className="px-8 py-6">
                    {row.sellworks ? (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00D4FF]/10 text-[#00D4FF]">
                        <Check className="h-5 w-5" strokeWidth={3} />
                      </div>
                    ) : (
                      <X className="h-5 w-5 text-subtext/20" />
                    )}
                  </td>
                  <td className="px-8 py-6">
                    {row.others ? (
                      <Check className="h-5 w-5 text-subtext/40" />
                    ) : (
                      <X className="h-5 w-5 text-subtext/20" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </section>
  );
}
