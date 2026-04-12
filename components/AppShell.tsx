'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import SellworksLogo from '@/components/SellworksLogo'

type AppShellProps = {
  children: React.ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  const [user, setUser] = useState<User | null>(null)
  const pathname = usePathname()
  const router = useRouter()
  const displayName = user?.user_metadata?.display_name?.toString().trim() || null
  const initialsSource = displayName || user?.email || 'Sellworks'
  const initials = initialsSource.slice(0, 2).toUpperCase()

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser()
      const currentUser = data.user

      if (!currentUser) {
        router.replace('/login')
        return
      }

      setUser(currentUser)
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

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace('/login')
  }

  const links = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/projects', label: 'Projects' },
    { href: '/assets', label: 'Assets' },
    { href: '/billing', label: 'Account' },
  ]

  const isActiveLink = (href: string) =>
    href === '/projects' ? pathname.startsWith('/projects') : pathname === href

  const linkClassName = (href: string) =>
    isActiveLink(href)
      ? 'rounded-2xl border border-white/10 bg-white/[0.07] px-3.5 py-2.5 text-[13px] text-white'
      : 'rounded-2xl px-3.5 py-2.5 text-[13px] text-white/52 transition hover:bg-white/[0.03] hover:text-white'

  return (
    <div className="min-h-screen">
      <div className="flex min-h-screen">
        <aside className="hidden h-screen w-[248px] shrink-0 border-r border-white/8 bg-[#08090d] px-4 py-4 lg:sticky lg:top-0 lg:flex lg:flex-col">
          <Link href="/dashboard" className="mb-7 flex items-center gap-3">
            <SellworksLogo className="h-10 w-10 shrink-0" />
            <div>
              <div className="text-base font-black tracking-tighter text-white">Sellworks</div>
              <div className="text-xs uppercase tracking-[0.22em] text-white/32">Workspace</div>
            </div>
          </Link>

          <nav className="flex flex-col gap-1.5 text-sm font-semibold">
            {links.map((item) => (
              <Link key={item.href} href={item.href} className={linkClassName(item.href)}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto rounded-[1.4rem] border border-white/8 bg-white/[0.03] p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-white/36">Signed in as</div>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/[0.08] text-xs font-bold tracking-[0.12em] text-white">
                {initials}
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-white">
                  {displayName || 'Sellworks user'}
                </div>
                <div className="truncate text-xs text-white/42">{user?.email}</div>
              </div>
            </div>
            <Link href="/" className="cta-secondary mt-4 w-full text-sm">
              View Site
            </Link>
            <button onClick={handleLogout} className="cta-secondary mt-4 w-full text-sm">
              Logout
            </button>
          </div>
        </aside>

        <div className="min-w-0 flex-1 overflow-x-hidden px-3 py-3 md:px-4 md:py-4 lg:px-5">
          <div className="panel mb-4 flex items-center justify-between rounded-[1.4rem] px-4 py-3 lg:hidden">
            <div className="flex items-center gap-3">
              <SellworksLogo className="h-10 w-10 shrink-0" />
              <div>
                <div className="text-xl font-black tracking-tighter text-white">Sellworks</div>
                <div className="text-xs uppercase tracking-[0.18em] text-white/32">Workspace</div>
              </div>
            </div>
            <button onClick={handleLogout} className="cta-secondary px-4 py-2 text-sm">
              Logout
            </button>
          </div>

          <div className="panel mb-4 flex gap-2 overflow-x-auto rounded-[1.4rem] p-2 lg:hidden">
            {links.map((item) => (
              <Link key={item.href} href={item.href} className={`${linkClassName(item.href)} whitespace-nowrap`}>
                {item.label}
              </Link>
            ))}
          </div>

          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </div>
  )
}
