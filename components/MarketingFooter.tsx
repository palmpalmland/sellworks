import Link from "next/link";
import SellworksLogo from "@/components/SellworksLogo";

export default function MarketingFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-[color:var(--panel-strong)] py-16">
      <div className="page-shell">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <SellworksLogo className="h-9 w-9" />
              <div className="text-2xl font-black tracking-tighter theme-text">Sellworks</div>
            </div>
            <p className="max-w-sm text-sm leading-7 theme-text-muted">
              The first AI content agent built specifically for high-volume ecommerce brands.
            </p>
          </div>

          <div>
            <div className="mb-5 text-xs font-black uppercase tracking-[0.22em] theme-text">
              Product
            </div>
            <div className="space-y-3 text-sm theme-text-muted">
              <Link href="/#product" className="block hover:text-[color:var(--foreground)]">
                Features
              </Link>
              <Link href="/#demo" className="block hover:text-[color:var(--foreground)]">
                Demo
              </Link>
              <Link href="/pricing" className="block hover:text-[color:var(--foreground)]">
                Pricing
              </Link>
            </div>
          </div>

          <div>
            <div className="mb-5 text-xs font-black uppercase tracking-[0.22em] theme-text">
              Company
            </div>
            <div className="space-y-3 text-sm theme-text-muted">
              <span className="block">About</span>
              <span className="block">Blog</span>
              <span className="block">Careers</span>
            </div>
          </div>

          <div>
            <div className="mb-5 text-xs font-black uppercase tracking-[0.22em] theme-text">
              Legal
            </div>
            <div className="space-y-3 text-sm theme-text-muted">
              <span className="block">Privacy</span>
              <span className="block">Terms</span>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-[var(--border)] pt-8 text-center text-xs font-bold uppercase tracking-[0.2em] theme-text-muted">
          Copyright 2026 Sellworks AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
