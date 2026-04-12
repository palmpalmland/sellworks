'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import SellworksLogo from '@/components/SellworksLogo'

export default function MarketingNav() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }

    loadUser()
  }, [])

  return (
    <nav className="fixed inset-x-0 top-0 z-[100] w-full border-b border-white/5 bg-background/60 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-12">
        <Link href="/" className="group flex cursor-pointer items-center gap-3">
          <div className="transition-transform duration-500 group-hover:rotate-12">
            <SellworksLogo className="h-10 w-10" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white">
            Sellworks
          </span>
        </Link>

        <div className="hidden items-center gap-10 md:flex">
          <Link href="/#product" className="marketing-nav-link text-sm font-bold uppercase tracking-widest">
            Product
          </Link>
          <Link href="/#demo" className="marketing-nav-link text-sm font-bold uppercase tracking-widest">
            Demo
          </Link>
          <Link href="/pricing" className="marketing-nav-link text-sm font-bold uppercase tracking-widest">
            Pricing
          </Link>

          {user ? (
            <Link
              href="/dashboard"
              className="rounded-2xl bg-white px-7 py-3 text-sm font-black uppercase tracking-widest text-black shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all hover:bg-white/90"
              style={{ color: '#0b1020' }}
            >
              Open Workspace
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-2xl bg-white px-7 py-3 text-sm font-black uppercase tracking-widest text-black shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all hover:bg-white/90"
              style={{ color: '#0b1020' }}
            >
              Start Free
            </Link>
          )}
        </div>

        <button className="text-white/60 transition-colors hover:text-white md:hidden" aria-label="Open navigation">
          <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
    </nav>
  )
}
