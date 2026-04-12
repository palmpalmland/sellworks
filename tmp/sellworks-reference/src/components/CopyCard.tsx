import { motion } from 'motion/react';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface CopyCardProps {
  title: string;
  bullets: string[];
  description: string;
}

export default function CopyCard({ title, bullets, description }: CopyCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = `${title}\n\n${bullets.join('\n')}\n\n${description}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card flex h-full flex-col p-8">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-bold tracking-tight">Product Copy</h3>
        <button 
          onClick={handleCopy}
          className="flex items-center gap-2 rounded-xl bg-white/5 border border-border px-4 py-2 text-sm font-medium hover:bg-white/10 transition-colors"
        >
          {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
          {copied ? "Copied!" : "Copy All"}
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-subtext">Product Title</label>
          <p className="text-lg font-semibold leading-tight">{title}</p>
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-subtext">Key Features</label>
          <ul className="space-y-2">
            {bullets.map((bullet, index) => (
              <li key={index} className="flex items-start gap-3 text-sm text-white/90">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#6C5CE7]" />
                {bullet}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-subtext">Marketing Description</label>
          <p className="text-sm leading-relaxed text-white/80">{description}</p>
        </div>
      </div>
    </div>
  );
}
