import { motion } from 'motion/react';
import { Check } from 'lucide-react';

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Try Sellworks for free",
    features: ["1 product kit", "Standard resolution", "Basic support"],
    cta: "Start Free",
    highlight: false,
  },
  {
    name: "Starter",
    price: "$19",
    description: "For small sellers",
    features: ["10 product kits", "High resolution", "Priority support", "No watermarks"],
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "Growth",
    price: "$49",
    description: "Our most popular plan",
    features: ["50 product kits", "4K resolution", "Dedicated account manager", "Custom branding"],
    cta: "Get Growth",
    highlight: true,
  },
  {
    name: "Scale",
    price: "$99",
    description: "For high-volume brands",
    features: ["Unlimited kits (fair use)", "API access", "White-label options", "24/7 support"],
    cta: "Get Scale",
    highlight: false,
  }
];

export default function Pricing() {
  return (
    <section className="section-container">
      <div className="mb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#00D4FF]/10 px-4 py-1 text-sm font-bold text-[#00D4FF] border border-[#00D4FF]/20"
        >
          Simple, Transparent Pricing
        </motion.div>
        <h2 className="text-4xl font-black tracking-tight sm:text-6xl">
          High-volume content. <br />
          <span className="gradient-text">Low cost.</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan, index) => (
          <motion.div 
            key={index} 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className={`glass-card group flex flex-col p-8 transition-all duration-500 hover:bg-white/[0.03] ${plan.highlight ? 'border-[#6C5CE7]/50 shadow-[0_0_50px_rgba(108,92,231,0.15)] bg-[#6C5CE7]/5' : 'hover:border-white/10'}`}
          >
            {plan.highlight && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[#6C5CE7] px-4 py-1 text-[10px] font-black uppercase tracking-widest text-white">
                Most Popular
              </div>
            )}
            <div className="mb-8">
              <h3 className="text-xl font-bold tracking-tight">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-5xl font-black tracking-tighter">{plan.price}</span>
                {plan.price !== "Custom" && <span className="text-subtext font-medium">/mo</span>}
              </div>
              <p className="mt-3 text-sm text-subtext leading-relaxed">{plan.description}</p>
            </div>

            <ul className="mb-10 flex-1 space-y-4">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-white/80">
                  <div className="mt-1 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-[#00D4FF]/20 text-[#00D4FF]">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>

            <button className={`w-full rounded-2xl py-4 text-sm font-bold transition-all duration-300 ${plan.highlight ? 'gradient-button text-white' : 'bg-white/5 border border-white/5 hover:bg-white/10 text-white'}`}>
              {plan.cta}
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
