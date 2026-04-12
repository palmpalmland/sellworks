import { useState, useRef } from 'react';
import { Zap } from 'lucide-react';
import { motion } from 'motion/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LoadingOverlay from './components/LoadingOverlay';
import ResultsDashboard from './components/ResultsDashboard';
import UpgradeBar from './components/UpgradeBar';
import InspirationSection from './components/InspirationSection';
import ValueExplanation from './components/ValueExplanation';
import OutputShowcase from './components/OutputShowcase';
import CompetitiveAdvantage from './components/CompetitiveAdvantage';
import Benefits from './components/Benefits';
import UseCases from './components/UseCases';
import HowItWorks from './components/HowItWorks';
import Pricing from './components/Pricing';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import { AppState, ProductContent } from './types';

const MOCK_CONTENT: ProductContent = {
  title: "Portable Blender Bottle for Smoothies On the Go",
  bullets: [
    "USB rechargeable and portable",
    "Powerful blending performance",
    "Leak-proof design",
    "Lightweight and easy to clean",
    "Perfect for travel and gym"
  ],
  description: "Create fresh smoothies anywhere with a compact portable blender bottle designed for busy lifestyles.",
  videoUrl: "https://example.com/video.mp4",
  images: [
    "https://picsum.photos/seed/blender-white/800/800",
    "https://picsum.photos/seed/blender-lifestyle/800/800",
    "https://picsum.photos/seed/blender-ad/800/800"
  ]
};

export default function App() {
  const [state, setState] = useState<AppState>('idle');
  const [content, setContent] = useState<ProductContent | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleGenerate = (url: string) => {
    setState('loading');
  };

  const handleLoadingComplete = () => {
    setContent(MOCK_CONTENT);
    setState('results');
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background selection:bg-[#6C5CE7]/30">
      <Navbar />
      
      <main className="relative">
        {/* Global Background Elements */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-[15%] left-[-10%] h-[1000px] w-[1000px] rounded-full bg-[#6C5CE7]/05 blur-[120px]" />
          <div className="absolute top-[45%] right-[-10%] h-[1000px] w-[1000px] rounded-full bg-[#00D4FF]/05 blur-[120px]" />
          <div className="absolute bottom-[10%] left-[20%] h-[800px] w-[800px] rounded-full bg-[#6C5CE7]/05 blur-[120px]" />
        </div>

        {/* Hero Section */}
        <Hero onGenerate={handleGenerate} />

        {/* Value Explanation */}
        <div id="product" className="relative">
          <ValueExplanation />
        </div>

        {/* Interactive Demo Section (Results or Placeholder) */}
        <div id="demo" ref={resultsRef} className="scroll-mt-24">
          {state === 'results' && content ? (
            <ResultsDashboard content={content} />
          ) : (
            <section className="section-container">
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="mb-16 text-center"
              >
                <h2 className="text-4xl font-black tracking-tight sm:text-6xl">See Sellworks in action</h2>
                <p className="mt-6 text-subtext text-lg">Paste a link above to see the magic happen.</p>
              </motion.div>
              <div className="glass-card group relative aspect-video w-full overflow-hidden bg-white/[0.02] border-dashed border-white/10 flex items-center justify-center transition-all duration-500 hover:border-white/20">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(108,92,231,0.05)_0%,transparent_70%)]" />
                <div className="relative flex flex-col items-center gap-4 text-subtext group-hover:text-white/60 transition-colors">
                  <div className="h-16 w-16 rounded-full border-2 border-dashed border-current flex items-center justify-center animate-[spin_10s_linear_infinite]">
                    <Zap size={32} />
                  </div>
                  <p className="font-bold tracking-widest uppercase text-sm">Demo results will appear here</p>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Output Showcase */}
        <OutputShowcase />

        {/* Benefits Section */}
        <Benefits />

        {/* Competitive Comparison */}
        <CompetitiveAdvantage />

        {/* Use Cases */}
        <UseCases />

        {/* How It Works */}
        <HowItWorks />

        {/* Inspiration Section */}
        <InspirationSection />

        {/* Pricing */}
        <div id="pricing">
          <Pricing />
        </div>

        {/* Final CTA */}
        <FinalCTA />
      </main>

      <Footer />

      <LoadingOverlay 
        isVisible={state === 'loading'} 
        onComplete={handleLoadingComplete} 
      />

      <UpgradeBar isVisible={state === 'results'} />
    </div>
  );
}
