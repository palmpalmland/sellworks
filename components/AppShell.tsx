'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import SellworksLogo from '@/components/SellworksLogo'
import type { BrandRecord } from '@/lib/project-types'

type AppShellProps = {
  children: React.ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  const [user, setUser] = useState<User | null>(null)
  const [brand, setBrand] = useState<BrandRecord | null>(null)
  const [accountOpen, setAccountOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const accountMenuRef = useRef<HTMLDivElement | null>(null)

  const displayName = user?.user_metadata?.display_name?.toString().trim() || null
  const initialsSource = displayName || user?.email || 'Sellworks'
  const initials = initialsSource.slice(0, 2).toUpperCase()

  useEffect(() => {
    const init = async () => {
      const cachedBrand = window.sessionStorage.getItem('sellworks-brand')
      if (cachedBrand) {
        try {
          setBrand(JSON.parse(cachedBrand) as BrandRecord)
        } catch {}
      }

      const {
        data: { session },
      } = await supabase.auth.getSession()
      const currentUser = session?.user || null

      if (!currentUser) {
        router.replace('/login')
        return
      }

      setUser(currentUser)

      if (session?.access_token) {
        const brandRes = await fetch('/api/brand', {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        })
        const brandJson = await brandRes.json()
        if (brandJson?.data?.brand) {
          setBrand(brandJson.data.brand)
          window.sessionStorage.setItem('sellworks-brand', JSON.stringify(brandJson.data.brand))
        }
      }
    }

    init()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!accountMenuRef.current?.contains(event.target as Node)) {
        setAccountOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace('/login')
  }

  const links = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/projects', label: 'Projects' },
    { href: '/assets', label: 'Assets' },
    { href: '/brand', label: 'Brand' },
    { href: '/billing', label: 'Account' },
  ]

  const isActiveLink = (href: string) =>
    href === '/projects' ? pathname.startsWith('/projects') : pathname === href

  const linkClassName = (href: string) =>
    isActiveLink(href)
      ? 'rounded-2xl border border-white/10 bg-white/[0.07] px-3.5 py-2.5 text-[13px] text-white'
      : 'rounded-2xl px-3.5 py-2.5 text-[13px] text-white/52 transition hover:bg-white/[0.03] hover:text-white'

  return (
    <div className="h-screen overflow-hidden bg-[#060608]">
      <header className="sticky top-0 z-40 border-b border-white/8 bg-[#090a0f]/92 backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between gap-4 px-4 md:px-5 lg:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-3">
              <SellworksLogo className="h-9 w-9 shrink-0" />
              <div className="min-w-0">
                <div className="truncate text-base font-black tracking-tighter text-white">Sellworks</div>
                <div className="truncate text-[11px] uppercase tracking-[0.22em] text-white/32">
                  {brand?.name || 'Workspace'}
                </div>
              </div>
            </Link>
          </div>

          <div className="hidden min-w-0 items-center gap-3 lg:flex">
            <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white/44">
              Content Workspace
            </div>
            <div className="text-sm text-white/48">
              Projects, assets, and brand systems in one place
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <Link href="/generate" className="cta-primary px-4 py-2.5 text-sm">
              New Project
            </Link>
            <Link href="/" className="cta-secondary hidden px-4 py-2.5 text-sm md:inline-flex">
              View Site
            </Link>

            <div className="relative" ref={accountMenuRef}>
              <button
                type="button"
                onClick={() => setAccountOpen((current) => !current)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-xs font-bold tracking-[0.12em] text-white transition hover:bg-white/[0.08]"
              >
                {initials}
              </button>

              {accountOpen ? (
                <div className="absolute right-0 top-12 z-50 w-[280px] rounded-[1.4rem] border border-white/10 bg-[#0c0d12] p-4 shadow-2xl">
                  <div className="text-xs uppercase tracking-[0.18em] text-white/32">Signed in as</div>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/[0.08] text-xs font-bold tracking-[0.12em] text-white">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-white">
                        {displayName || 'Sellworks user'}
                      </div>
                      <div className="truncate text-xs text-white/42">{user?.email}</div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <Link href="/brand" className="cta-secondary w-full justify-start text-sm">
                      Brand Settings
                    </Link>
                    <Link href="/billing" className="cta-secondary w-full justify-start text-sm">
                      Account Settings
                    </Link>
                    <Link href="/" className="cta-secondary w-full justify-start text-sm md:hidden">
                      View Site
                    </Link>
                    <button onClick={handleLogout} className="cta-secondary w-full justify-start text-sm">
                      Logout
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        <aside className="hidden h-full w-[248px] shrink-0 border-r border-white/8 bg-[#08090d] px-4 py-4 lg:flex lg:flex-col">
          <nav className="flex flex-col gap-1.5 text-sm font-semibold">
            {links.map((item) => (
              <Link key={item.href} href={item.href} className={linkClassName(item.href)}>
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="panel mx-3 mt-3 flex gap-2 overflow-x-auto rounded-[1.4rem] p-2 lg:hidden md:mx-4">
            {links.map((item) => (
              <Link key={item.href} href={item.href} className={`${linkClassName(item.href)} whitespace-nowrap`}>
                {item.label}
              </Link>
            ))}
          </div>

          <div className="h-full overflow-y-auto px-3 py-3 md:px-4 md:py-4 lg:px-5">
            <div className="min-w-0">{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
