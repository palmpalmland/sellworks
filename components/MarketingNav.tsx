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
    { href: '/#overview', label: 'Overview' },
    { href: '/#features', label: 'Features' },
    { href: '/#categories', label: 'Categories' },
    { href: '/pricing', label: 'Pricing' },
  ]

  const linkClassName = (href: string) =>
    pathname === href || (pathname === '/' && href !== '/pricing' && href.startsWith('/#'))
      ? 'rounded-full border border-white/12 bg-white/10 px-4 py-2 text-white'
      : 'rounded-full px-4 py-2 text-white/72 transition hover:bg-white/6 hover:text-white'

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/8 bg-[#060917]/70 backdrop-blur-xl">
      <div className="page-shell flex items-center justify-between gap-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#32c8ff_0%,#6d7cff_48%,#9c6bff_100%)] text-lg font-black text-white shadow-[0_12px_30px_rgba(109,124,255,0.35)]">
            AC
          </div>
          <div>
            <div className="headline text-lg font-black text-white md:text-xl">
              AI Content Engine
            </div>
            <div className="text-xs uppercase tracking-[0.24em] text-white/45">
              Ecommerce content stack
            </div>
          </div>
        </Link>

        <div className="hidden items-center gap-2 text-sm font-semibold md:flex">
          {links.map((item) => (
            <Link key={item.href} href={item.href} className={linkClassName(item.href)}>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <Link href="/dashboard" className="cta-primary px-4 py-3 text-sm">
              Open Workspace
            </Link>
          ) : (
            <>
              <Link href="/login" className={pathname === '/login' ? 'cta-secondary px-4 py-3 text-sm ring-1 ring-white/18' : 'cta-secondary px-4 py-3 text-sm'}>
                Login
              </Link>
              <Link href="/pricing" className="cta-primary px-4 py-3 text-sm">
                Start Free
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
