import { motion, AnimatePresence } from 'motion/react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface LoadingOverlayProps {
  isVisible: boolean;
  onComplete: () => void;
}

const steps = [
  "Analyzing product...",
  "Writing high-converting copy...",
  "Generating product images...",
  "Creating video..."
];

export default function LoadingOverlay({ isVisible, onComplete }: LoadingOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        clearInterval(interval);
        setTimeout(onComplete, 1000);
        return prev;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-xl"
        >
          <div className="mx-auto max-w-md w-full px-6 text-center">
            <div className="mb-12 flex justify-center">
              <div className="relative h-24 w-24">
                <div className="absolute inset-0 animate-pulse rounded-full bg-[#6C5CE7]/20 blur-2xl" />
                <Loader2 className="h-24 w-24 animate-spin text-[#6C5CE7]" strokeWidth={1} />
              </div>
            </div>

            <h2 className="mb-8 text-2xl font-bold tracking-tight">
              Generating your content kit...
            </h2>

            <div className="space-y-4">
              {steps.map((step, index) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ 
                    opacity: index <= currentStep ? 1 : 0.3,
                    x: 0,
                    color: index === currentStep ? "#FFFFFF" : index < currentStep ? "#A0A0B2" : "#A0A0B2"
                  }}
                  className="flex items-center gap-3 text-left font-medium"
                >
                  {index < currentStep ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : index === currentStep ? (
                    <Loader2 className="h-5 w-5 animate-spin text-[#6C5CE7]" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-border" />
                  )}
                  <span>{step}</span>
                </motion.div>
              ))}
            </div>

            {/* Fake Preview Elements */}
            <div className="mt-12 grid grid-cols-2 gap-4 opacity-20 filter blur-sm">
              <div className="aspect-video rounded-xl bg-card border border-border" />
              <div className="aspect-square rounded-xl bg-card border border-border" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
