import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface UpgradeBarProps {
  isVisible: boolean;
}

export default function UpgradeBar({ isVisible }: UpgradeBarProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-8 left-1/2 z-[90] -translate-x-1/2 w-full max-w-2xl px-4"
        >
          <div className="glass-card flex items-center justify-between p-4 bg-background/80 backdrop-blur-xl border-[#6C5CE7]/30 shadow-[0_0_40px_rgba(108,92,231,0.2)]">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6C5CE7]/20 text-[#6C5CE7]">
                <Sparkles size={20} />
              </div>
              <div>
                <p className="text-sm font-bold">Unlock full content kit</p>
                <p className="text-xs text-subtext">Get high-res assets and unlimited generations.</p>
              </div>
            </div>
            
            <button className="gradient-button flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold text-white">
              Upgrade to Pro — $29/month
              <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
