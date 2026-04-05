'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

type AppShellProps = {
  children: React.ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser()
      const currentUser = data.user

      if (!currentUser) {
        router.replace('/login')
        return
      }

      setUser(currentUser)
      setLoading(false)
    }

    init()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace('/login')
  }

  const links = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/generate', label: 'Generate' },
    { href: '/history', label: 'History' },
    { href: '/billing', label: 'Pricing' },
  ]

  const linkClassName = (href: string) =>
    pathname === href
      ? 'rounded-2xl border border-white/12 bg-white/10 px-4 py-3 text-white'
      : 'rounded-2xl px-4 py-3 text-white/70 transition hover:bg-white/6 hover:text-white'

  if (loading) {
    return <main className="page-shell py-16 text-white/60">Loading workspace...</main>
  }

  return (
    <div className="min-h-screen">
      <div className="page-shell flex min-h-screen gap-6 py-6">
        <aside className="panel hidden w-72 shrink-0 rounded-[2rem] p-5 lg:flex lg:flex-col">
          <Link href="/dashboard" className="mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#32c8ff_0%,#6d7cff_48%,#9c6bff_100%)] text-lg font-black text-white shadow-[0_12px_30px_rgba(109,124,255,0.35)]">
              AC
            </div>
            <div>
              <div className="headline text-lg font-black text-white">Workspace</div>
              <div className="text-xs uppercase tracking-[0.22em] text-white/38">Operator mode</div>
            </div>
          </Link>

          <nav className="flex flex-col gap-2 text-sm font-semibold">
            {links.map((item) => (
              <Link key={item.href} href={item.href} className={linkClassName(item.href)}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto rounded-[1.6rem] border border-white/8 bg-white/5 p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-white/36">Signed in as</div>
            <div className="mt-2 break-all text-sm font-semibold text-white">{user?.email}</div>
            <Link href="/" className="cta-secondary mt-4 w-full text-sm">
              View Site
            </Link>
            <button onClick={handleLogout} className="cta-secondary mt-4 w-full text-sm">
              Logout
            </button>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="panel mb-5 flex items-center justify-between rounded-[1.6rem] px-4 py-3 lg:hidden">
            <div>
              <div className="headline text-xl font-black text-white">Workspace</div>
              <div className="text-xs uppercase tracking-[0.18em] text-white/38">Operator mode</div>
            </div>
            <button onClick={handleLogout} className="cta-secondary px-4 py-2 text-sm">
              Logout
            </button>
          </div>

          <div className="panel mb-5 flex gap-2 overflow-x-auto rounded-[1.6rem] p-2 lg:hidden">
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
