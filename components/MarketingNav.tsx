'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export default function MarketingNav() {
  const [user, setUser] = useState<User | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }

    loadUser()
  }, [])

  const links = [
    { href: '/#product', label: 'Product' },
    { href: '/#demo', label: 'Demo' },
    { href: '/pricing', label: 'Pricing' },
  ]

  const isActive = (href: string) =>
    pathname === href || (pathname === '/' && href.startsWith('/#'))

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-[#050816]/60 backdrop-blur-xl">
      <div className="page-shell flex items-center justify-between gap-4 py-5">
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-[linear-gradient(135deg,#6C5CE7_0%,#00D4FF_100%)] transition-transform duration-500 group-hover:rotate-12">
            <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
          <div className="headline text-2xl font-black tracking-tight text-white">
            Sellworks
          </div>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                isActive(item.href)
                  ? 'text-sm font-black uppercase tracking-[0.2em] text-white'
                  : 'text-sm font-black uppercase tracking-[0.2em] text-white/52 transition hover:text-white'
              }
            >
              {item.label}
            </Link>
          ))}
          {user ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-2xl border border-[#d7dced] bg-[#f5f7ff] px-7 py-3 text-sm font-black uppercase tracking-[0.18em] text-[#0b1020] shadow-[0_10px_30px_rgba(255,255,255,0.12)] transition hover:bg-white"
              style={{ color: "#0b1020" }}
            >
              Open Workspace
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-2xl border border-[#d7dced] bg-[#f5f7ff] px-7 py-3 text-sm font-black uppercase tracking-[0.18em] text-[#0b1020] shadow-[0_10px_30px_rgba(255,255,255,0.12)] transition hover:bg-white"
              style={{ color: "#0b1020" }}
            >
              Start Free
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
