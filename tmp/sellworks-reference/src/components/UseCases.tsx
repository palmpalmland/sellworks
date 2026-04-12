import { motion } from 'motion/react';
import { ShoppingBag, Store, Video, Briefcase } from 'lucide-react';

const cases = [
  {
    title: "Amazon Sellers",
    description: "Generate A+ content and listing images that dominate the search results.",
    icon: <ShoppingBag />,
  },
  {
    title: "Shopify Brands",
    description: "Create high-converting product pages and social media ads instantly.",
    icon: <Store />,
  },
  {
    title: "TikTok Shop Sellers",
    description: "Launch viral-ready UGC video ads with AI voices and captions.",
    icon: <Video />,
  },
  {
    title: "Agencies",
    description: "Scale content production for your clients without increasing headcount.",
    icon: <Briefcase />,
  }
];

export default function UseCases() {
  return (
    <section className="bg-white/[0.01] py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#00D4FF]/10 px-4 py-1 text-sm font-bold text-[#00D4FF] border border-[#00D4FF]/20"
          >
            Target Audience
          </motion.div>
          <h2 className="text-4xl font-black tracking-tight sm:text-6xl">
            Who Sellworks is for
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {cases.map((useCase, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card group p-10 hover:border-[#6C5CE7]/30 hover:bg-white/[0.03] transition-all duration-500"
            >
              <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 border border-white/5 text-subtext group-hover:text-[#6C5CE7] group-hover:border-[#6C5CE7]/30 group-hover:bg-[#6C5CE7]/10 transition-all duration-500">
                {useCase.icon}
              </div>
              <h3 className="mb-4 text-2xl font-bold tracking-tight">{useCase.title}</h3>
              <p className="text-lg text-subtext leading-relaxed group-hover:text-white/70 transition-colors">
                {useCase.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
