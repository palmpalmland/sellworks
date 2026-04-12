import { motion } from 'motion/react';
import VideoCard from './VideoCard';
import CopyCard from './CopyCard';
import ImageGrid from './ImageGrid';
import { ProductContent } from '../types';

interface ResultsDashboardProps {
  content: ProductContent;
}

export default function ResultsDashboard({ content }: ResultsDashboardProps) {
  return (
    <div className="section-container relative">
      {/* Decorative background element */}
      <div className="absolute top-0 left-1/2 -z-10 h-[600px] w-full -translate-x-1/2 bg-[radial-gradient(circle_at_50%_0%,rgba(108,92,231,0.05)_0%,transparent_70%)]" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-20 text-center"
      >
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-500/10 px-4 py-1 text-sm font-bold text-green-500 border border-green-500/20">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          Generation Complete
        </div>
        <h2 className="text-4xl font-black tracking-tight sm:text-6xl">
          🎉 Your Content Kit is Ready
        </h2>
        <p className="mt-4 text-subtext text-lg">We've generated a full suite of high-converting assets for your product.</p>
      </motion.div>

      <div className="grid grid-cols-1 gap-10">
        {/* Video Section - Hero Position */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <div className="relative">
            <div className="absolute -inset-1 rounded-[28px] bg-gradient-to-r from-[#6C5CE7] to-[#00D4FF] opacity-20 blur-2xl" />
            <VideoCard videoUrl={content.videoUrl} />
          </div>
        </motion.div>

        {/* Two Columns: Copy & Images */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <CopyCard 
              title={content.title} 
              bullets={content.bullets} 
              description={content.description} 
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <ImageGrid images={content.images} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
