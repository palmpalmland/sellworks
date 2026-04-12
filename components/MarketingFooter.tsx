import Link from "next/link";
import SellworksLogo from "@/components/SellworksLogo";

export default function MarketingFooter() {
  return (
    <footer className="border-t border-white/6 bg-[#050816] py-16">
      <div className="page-shell">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <SellworksLogo className="h-9 w-9" />
              <div className="text-2xl font-black tracking-tighter text-white">Sellworks</div>
            </div>
            <p className="max-w-sm text-sm leading-7 text-white/56">
              The first AI content agent built specifically for high-volume ecommerce brands.
            </p>
          </div>

          <div>
            <div className="mb-5 text-xs font-black uppercase tracking-[0.22em] text-white">
              Product
            </div>
            <div className="space-y-3 text-sm text-white/58">
              <Link href="/#product" className="block hover:text-white">
                Features
              </Link>
              <Link href="/#demo" className="block hover:text-white">
                Demo
              </Link>
              <Link href="/pricing" className="block hover:text-white">
                Pricing
              </Link>
            </div>
          </div>

          <div>
            <div className="mb-5 text-xs font-black uppercase tracking-[0.22em] text-white">
              Company
            </div>
            <div className="space-y-3 text-sm text-white/58">
              <span className="block">About</span>
              <span className="block">Blog</span>
              <span className="block">Careers</span>
            </div>
          </div>

          <div>
            <div className="mb-5 text-xs font-black uppercase tracking-[0.22em] text-white">
              Legal
            </div>
            <div className="space-y-3 text-sm text-white/58">
              <span className="block">Privacy</span>
              <span className="block">Terms</span>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-white/6 pt-8 text-center text-xs font-bold uppercase tracking-[0.2em] text-white/34">
          Copyright 2026 Sellworks AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
