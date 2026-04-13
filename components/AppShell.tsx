'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import SellworksLogo from '@/components/SellworksLogo'
import type { BrandRecord } from '@/lib/project-types'
import {
  BRAND_CHANGED_EVENT,
  emitBrandChanged,
  getStoredActiveBrandId,
  getStoredBrand,
  setStoredActiveBrand,
} from '@/lib/brand-session'

type AppShellProps = {
  children: React.ReactNode
}

type BrandMembershipItem = {
  brand: BrandRecord
}

export default function AppShell({ children }: AppShellProps) {
  const [user, setUser] = useState<User | null>(null)
  const [brand, setBrand] = useState<BrandRecord | null>(null)
  const [brands, setBrands] = useState<BrandRecord[]>([])
  const [accountOpen, setAccountOpen] = useState(false)
  const [brandMenuOpen, setBrandMenuOpen] = useState(false)
  const [createBrandOpen, setCreateBrandOpen] = useState(false)
  const [createBrandName, setCreateBrandName] = useState('')
  const [brandActionLoading, setBrandActionLoading] = useState(false)
  const [brandActionMessage, setBrandActionMessage] = useState('')
  const pathname = usePathname()
  const router = useRouter()
  const accountMenuRef = useRef<HTMLDivElement | null>(null)
  const brandMenuRef = useRef<HTMLDivElement | null>(null)

  const displayName = user?.user_metadata?.display_name?.toString().trim() || null
  const initialsSource = displayName || user?.email || 'Sellworks'
  const initials = initialsSource.slice(0, 2).toUpperCase()

  useEffect(() => {
    const init = async () => {
      const cachedBrand = getStoredBrand()
      if (cachedBrand) {
        setBrand(cachedBrand)
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

      if (!session?.access_token) {
        return
      }

      const brandRes = await fetch('/api/brand', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      })

      const brandJson = await brandRes.json().catch(() => null)
      if (!brandJson?.data?.brand) {
        return
      }

      const availableBrands = Array.isArray(brandJson.data.brands)
        ? brandJson.data.brands.map((item: BrandMembershipItem) => item.brand)
        : []
      const cachedBrandId = getStoredActiveBrandId()
      const activeBrand =
        availableBrands.find((item: BrandRecord) => item.id === cachedBrandId) || brandJson.data.brand

      setBrands(availableBrands)
      setBrand(activeBrand)
      setStoredActiveBrand(activeBrand)
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
      if (!brandMenuRef.current?.contains(event.target as Node)) {
        setBrandMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
    }
  }, [])

  useEffect(() => {
    const handleBrandChanged = (event: Event) => {
      const customEvent = event as CustomEvent<{ brand?: BrandRecord }>
      if (customEvent.detail?.brand) {
        setBrand(customEvent.detail.brand)
      }
    }

    window.addEventListener(BRAND_CHANGED_EVENT, handleBrandChanged as EventListener)
    return () => {
      window.removeEventListener(BRAND_CHANGED_EVENT, handleBrandChanged as EventListener)
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace('/login')
  }

  const handleBrandSelect = (selectedBrand: BrandRecord) => {
    setBrand(selectedBrand)
    setBrandMenuOpen(false)
    setCreateBrandOpen(false)
    setBrandActionMessage('')
    emitBrandChanged(selectedBrand)
  }

  const handleCreateBrand = async () => {
    try {
      if (!createBrandName.trim()) {
        setBrandActionMessage('Brand name is required.')
        return
      }

      setBrandActionLoading(true)
      setBrandActionMessage('')

      const {
        data: { session },
      } = await supabase.auth.getSession()

      const res = await fetch('/api/brand', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          name: createBrandName.trim(),
        }),
      })

      const json = await res.json()
      if (!res.ok) {
        throw new Error(json.error || 'Failed to create brand')
      }

      const nextBrand = json.data.brand as BrandRecord
      const nextBrands = Array.isArray(json.data.brands)
        ? json.data.brands.map((item: BrandMembershipItem) => item.brand)
        : [nextBrand]

      setBrands(nextBrands)
      setBrand(nextBrand)
      emitBrandChanged(nextBrand)
      setCreateBrandName('')
      setCreateBrandOpen(false)
      setBrandMenuOpen(false)
      setBrandActionMessage('Brand workspace created.')
      router.push('/brand/general')
    } catch (error: unknown) {
      setBrandActionMessage(error instanceof Error ? error.message : 'Failed to create brand')
    } finally {
      setBrandActionLoading(false)
    }
  }

  const links = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/projects', label: 'Projects' },
    { href: '/assets', label: 'Assets' },
    { href: '/billing', label: 'Account' },
  ]

  const isBrandSettingsRoute = pathname.startsWith('/brand')

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
            <div className="hidden lg:flex">
              <Link href="/dashboard" className="flex items-center gap-3">
                <SellworksLogo className="h-9 w-9 shrink-0" />
              </Link>
            </div>

            <div className="relative" ref={brandMenuRef}>
              <button
                type="button"
                onClick={() => setBrandMenuOpen((current) => !current)}
                className="flex min-w-[220px] items-center gap-3 rounded-[1rem] border border-white/10 bg-white/[0.04] px-3 py-2.5 text-left transition hover:bg-white/[0.07]"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[0.8rem] bg-white/[0.08] text-sm font-bold text-white">
                  {(brand?.name || 'B').slice(0, 1).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-white">
                    {brand?.name || 'My Brand'}
                  </div>
                </div>
                <div className="text-xs text-white/44">v</div>
              </button>

              {brandMenuOpen ? (
                <div className="absolute left-0 top-14 z-50 w-[340px] rounded-[1.4rem] border border-white/10 bg-[#111217] p-4 shadow-2xl">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[0.9rem] bg-white/[0.08] text-lg font-bold text-white">
                      {(brand?.name || 'B').slice(0, 1).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-lg font-semibold text-white">{brand?.name || 'My Brand'}</div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Link href="/brand/general" className="cta-secondary w-full text-sm" onClick={() => setBrandMenuOpen(false)}>
                      Settings
                    </Link>
                  </div>

                  {brands.length > 1 ? (
                    <div className="mt-4 border-t border-white/8 pt-4">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <div className="text-xs uppercase tracking-[0.18em] text-white/32">Switch brand</div>
                        <div className="text-[11px] uppercase tracking-[0.16em] text-white/28">
                          {brands.length} connected
                        </div>
                      </div>
                      <div className="space-y-2">
                        {brands.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleBrandSelect(item)}
                            className={`flex w-full items-center gap-3 rounded-[1rem] px-3 py-2.5 text-left transition ${
                              brand?.id === item.id
                                ? 'bg-white/[0.08] text-white'
                                : 'text-white/72 hover:bg-white/[0.05]'
                            }`}
                          >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[0.75rem] bg-white/[0.08] text-xs font-bold text-white">
                              {item.name.slice(0, 1).toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1 truncate text-sm font-medium">{item.name}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  <div className="mt-4 border-t border-white/8 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setCreateBrandOpen(true)
                        setBrandActionMessage('')
                      }}
                      className="flex w-full items-center gap-3 rounded-[1rem] px-3 py-2.5 text-left text-white/38 transition hover:bg-white/[0.04] hover:text-white/70"
                    >
                      <span className="text-lg leading-none">+</span>
                      <span className="text-sm font-medium">Create new brand space</span>
                    </button>
                  </div>

                  {createBrandOpen ? (
                    <div className="mt-4 border-t border-white/8 pt-4">
                      <div className="text-xs uppercase tracking-[0.18em] text-white/32">New brand</div>
                      <input
                        type="text"
                        value={createBrandName}
                        onChange={(event) => setCreateBrandName(event.target.value)}
                        placeholder="Brand name"
                        className="field mt-3"
                      />
                      <div className="mt-3 flex gap-2">
                        <button type="button" onClick={handleCreateBrand} disabled={brandActionLoading} className="cta-primary w-full text-sm">
                          {brandActionLoading ? 'Creating...' : 'Create'}
                        </button>
                        <button type="button" onClick={() => setCreateBrandOpen(false)} className="cta-secondary w-full text-sm">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : null}

                  {brandActionMessage ? (
                    <div className="mt-4 rounded-[1rem] border border-white/8 bg-white/[0.03] px-3 py-3 text-sm text-white/62">
                      {brandActionMessage}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <Link href="/generate" className="cta-primary px-4 py-2.5 text-sm">
              New Project
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
                    <Link href="/brand/general" className="cta-secondary w-full justify-start text-sm" onClick={() => setAccountOpen(false)}>
                      Brand Settings
                    </Link>
                    <Link href="/billing" className="cta-secondary w-full justify-start text-sm" onClick={() => setAccountOpen(false)}>
                      Account Settings
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
        {!isBrandSettingsRoute ? (
        <aside className="hidden h-full w-[248px] shrink-0 border-r border-white/8 bg-[#08090d] px-4 py-4 lg:flex lg:flex-col">
          <nav className="flex flex-col gap-1.5 text-sm font-semibold">
            {links.map((item) => (
              <Link key={item.href} href={item.href} className={linkClassName(item.href)}>
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        ) : null}

        <div className="min-w-0 flex-1 overflow-hidden">
          {!isBrandSettingsRoute ? (
          <div className="panel mx-3 mt-3 flex gap-2 overflow-x-auto rounded-[1.4rem] p-2 md:mx-4 lg:hidden">
            {links.map((item) => (
              <Link key={item.href} href={item.href} className={`${linkClassName(item.href)} whitespace-nowrap`}>
                {item.label}
              </Link>
            ))}
          </div>
          ) : null}

          <div className={`h-full overflow-y-auto ${isBrandSettingsRoute ? 'px-0 py-0' : 'px-3 py-3 md:px-4 md:py-4 lg:px-5'}`}>
            <div className="min-w-0">{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
