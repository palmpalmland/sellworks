"use client";

import Link from "next/link";

export default function MarketingUpgradeBar() {
  return (
    <div className="fixed bottom-8 left-1/2 z-[90] w-full max-w-2xl -translate-x-1/2 px-4">
      <div className="panel flex items-center justify-between gap-4 border-[#6C5CE7]/30 bg-black/80 p-4 shadow-[0_0_40px_rgba(108,92,231,0.2)] backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6C5CE7]/20 text-[#6C5CE7]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path d="M12 3l1.8 4.6L18 9.4l-4.2 1.8L12 16l-1.8-4.8L6 9.4l4.2-1.8L12 3Z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-white">Unlock full content kit</p>
            <p className="text-xs text-white/50">Get high-res assets and unlimited generations.</p>
          </div>
        </div>

        <Link
          href="/pricing"
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[linear-gradient(90deg,#6C5CE7_0%,#00D4FF_100%)] px-6 py-2.5 text-sm font-bold text-white transition hover:scale-[1.02]"
        >
          Upgrade to Pro
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
