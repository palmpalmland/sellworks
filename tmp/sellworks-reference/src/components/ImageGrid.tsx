import { motion } from 'motion/react';
import { Download, RefreshCw, ZoomIn } from 'lucide-react';

interface ImageGridProps {
  images: string[];
}

const labels = ["White Background", "Lifestyle", "Ad Creative"];

export default function ImageGrid({ images }: ImageGridProps) {
  return (
    <div className="glass-card flex h-full flex-col p-8">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-bold tracking-tight">Product Images</h3>
        <span className="text-xs font-medium text-subtext uppercase tracking-wider">3 Assets Generated</span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {images.map((image, index) => (
          <div key={index} className="group relative aspect-square overflow-hidden rounded-xl bg-black/20 border border-border">
            <img 
              src={image} 
              alt={`Product ${index}`} 
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            
            <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center gap-3">
              <button className="h-10 w-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors">
                <Download size={18} />
              </button>
              <button className="h-10 w-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors">
                <RefreshCw size={18} />
              </button>
              <button className="h-10 w-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors">
                <ZoomIn size={18} />
              </button>
            </div>

            <div className="absolute bottom-3 left-3">
              <span className="rounded-lg bg-black/60 px-2 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border border-white/10">
                {labels[index] || "Generated Asset"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
