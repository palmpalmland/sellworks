'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }

    getUser()
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const navLinks = [
    { href: '/', label: 'Home', visible: true },
    { href: '/generate', label: 'Generate', visible: true },
    { href: '/pricing', label: 'Pricing', visible: true },
    { href: '/history', label: 'History', visible: Boolean(user) },
    { href: '/dashboard', label: 'Dashboard', visible: Boolean(user) },
  ].filter((item) => item.visible)

  const getLinkClassName = (href: string) => {
    const isActive = pathname === href

    return isActive
      ? 'rounded-full border border-white/12 bg-white/10 px-4 py-2 text-white'
      : 'rounded-full px-4 py-2 text-white/72 transition hover:bg-white/6 hover:text-white'
  }

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/8 bg-[#060917]/70 backdrop-blur-xl">
      <div className="page-shell py-4">
        <div className="flex items-center justify-between gap-4">
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
            {navLinks.map((item) => (
              <Link key={item.href} href={item.href} className={getLinkClassName(item.href)}>
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {!user && (
              <Link
                href="/login"
                className={pathname === '/login' ? 'cta-secondary px-4 py-3 text-sm ring-1 ring-white/18' : 'cta-secondary px-4 py-3 text-sm'}
              >
                Login
              </Link>
            )}

            <Link
              href={user ? '/generate' : '/pricing'}
              className={pathname === (user ? '/generate' : '/pricing') ? 'cta-primary px-4 py-3 text-sm ring-1 ring-white/20' : 'cta-primary px-4 py-3 text-sm'}
            >
              {user ? 'Open Studio' : 'Start Free'}
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/6 text-white md:hidden"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen}
            >
              <span className="text-lg">{mobileOpen ? '×' : '≡'}</span>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="panel mt-4 rounded-[1.6rem] p-3 md:hidden">
            <div className="flex flex-col gap-2 text-sm font-semibold">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={getLinkClassName(item.href)}
                >
                  {item.label}
                </Link>
              ))}
              {!user && (
                <Link href="/login" className={getLinkClassName('/login')}>
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
