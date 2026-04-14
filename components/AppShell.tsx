'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import SellworksLogo from '@/components/SellworksLogo'
import type { BrandRecord } from '@/lib/project-types'
import { useTheme } from '@/components/ThemeProvider'
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

const SIDEBAR_COLLAPSED_STORAGE_KEY = 'sellworks-sidebar-collapsed'

type NavLinkItem = {
  href: string
  label: string
  icon: React.ReactNode
}

function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className="h-[18px] w-[18px]">
      <rect x="3" y="3" width="8" height="8" rx="2" />
      <rect x="13" y="3" width="8" height="5" rx="2" />
      <rect x="13" y="10" width="8" height="11" rx="2" />
      <rect x="3" y="13" width="8" height="8" rx="2" />
    </svg>
  )
}

function ProjectsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className="h-[18px] w-[18px]">
      <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H10l1.6 2H18.5A2.5 2.5 0 0 1 21 9.5v8A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5z" />
      <path d="M3 9h18" />
    </svg>
  )
}

function AssetsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className="h-[18px] w-[18px]">
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <path d="M3 10h18" />
      <path d="M9 4v16" />
    </svg>
  )
}

function AccountIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className="h-[18px] w-[18px]">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 19a7 7 0 0 1 14 0" />
    </svg>
  )
}

export default function AppShell({ children }: AppShellProps) {
  const [user, setUser] = useState<User | null>(null)
  const [brand, setBrand] = useState<BrandRecord | null>(null)
  const [brands, setBrands] = useState<BrandRecord[]>([])
  const [accountOpen, setAccountOpen] = useState(false)
  const [themeMenuOpen, setThemeMenuOpen] = useState(false)
  const [brandMenuOpen, setBrandMenuOpen] = useState(false)
  const [createMenuOpen, setCreateMenuOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [createBrandOpen, setCreateBrandOpen] = useState(false)
  const [createBrandName, setCreateBrandName] = useState('')
  const [brandActionLoading, setBrandActionLoading] = useState(false)
  const [brandActionMessage, setBrandActionMessage] = useState('')
  const pathname = usePathname()
  const router = useRouter()
  const accountMenuRef = useRef<HTMLDivElement | null>(null)
  const brandMenuRef = useRef<HTMLDivElement | null>(null)
  const createMenuRef = useRef<HTMLDivElement | null>(null)
  const { themePreference, setThemePreference } = useTheme()

  const displayName = user?.user_metadata?.display_name?.toString().trim() || null
  const initialsSource = displayName || user?.email || 'Sellworks'
  const initials = initialsSource.slice(0, 2).toUpperCase()

  useEffect(() => {
    const storedCollapsed = window.localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY)
    setSidebarCollapsed(storedCollapsed === 'true')

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
    window.localStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, String(sidebarCollapsed))
  }, [sidebarCollapsed])

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!accountMenuRef.current?.contains(event.target as Node)) {
        setAccountOpen(false)
        setThemeMenuOpen(false)
      }
      if (!brandMenuRef.current?.contains(event.target as Node)) {
        setBrandMenuOpen(false)
      }
      if (!createMenuRef.current?.contains(event.target as Node)) {
        setCreateMenuOpen(false)
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

  const legacyLinks: NavLinkItem[] = [
    { href: '/dashboard', label: 'Dashboard', icon: '⌂' },
    { href: '/projects', label: 'Projects', icon: '▣' },
    { href: '/assets', label: 'Assets', icon: '◫' },
    { href: '/billing', label: 'Account', icon: '○' },
  ]

  const links: NavLinkItem[] = [
    { href: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { href: '/projects', label: 'Projects', icon: <ProjectsIcon /> },
    { href: '/assets', label: 'Assets', icon: <AssetsIcon /> },
    { href: '/billing', label: 'Account', icon: <AccountIcon /> },
  ]

  const isBrandSettingsRoute = pathname.startsWith('/brand')

  const isActiveLink = (href: string) =>
    href === '/projects' ? pathname.startsWith('/projects') : pathname === href

  const linkClassName = (href: string) =>
    isActiveLink(href)
      ? 'rounded-2xl border border-white/10 bg-white/[0.07] px-3.5 py-2.5 text-[13px] text-white'
      : 'rounded-2xl px-3.5 py-2.5 text-[13px] text-white/52 transition hover:bg-white/[0.03] hover:text-white'

  return (
    <div className="h-screen overflow-hidden app-theme-bg">
      <header className="theme-header sticky top-0 z-40 border-b backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between gap-4 px-4 md:px-5 lg:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="hidden lg:flex">
              <Link href="/dashboard" className="flex items-center gap-3">
                <SellworksLogo className="h-8 w-8 shrink-0" />
              </Link>
            </div>

            <div className="relative" ref={brandMenuRef}>
              <button
                type="button"
                onClick={() => setBrandMenuOpen((current) => !current)}
                className="theme-subtle-hover flex h-10 min-w-[220px] cursor-pointer items-center gap-2.5 rounded-full border px-3 text-left transition"
              >
                <div className="theme-subtle flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold theme-text">
                  {(brand?.name || 'B').slice(0, 1).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-semibold theme-text">
                    {brand?.name || 'My Brand'}
                  </div>
                </div>
                <div className="text-[10px] theme-text-muted">v</div>
              </button>

              {brandMenuOpen ? (
                <div className="theme-surface absolute left-0 top-14 z-50 w-[340px] rounded-[1.4rem] border p-4 shadow-2xl">
                  <div className="flex items-center gap-3">
                    <div className="theme-subtle flex h-11 w-11 shrink-0 items-center justify-center rounded-[0.9rem] text-lg font-bold theme-text">
                      {(brand?.name || 'B').slice(0, 1).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-lg font-semibold theme-text">{brand?.name || 'My Brand'}</div>
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
                        <div className="text-xs uppercase tracking-[0.18em] theme-text-muted">Switch brand</div>
                        <div className="text-[11px] uppercase tracking-[0.16em] theme-text-muted">
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
                                ? 'theme-subtle theme-text'
                                : 'theme-text-muted hover:bg-white/[0.05]'
                            }`}
                          >
                            <div className="theme-subtle flex h-8 w-8 shrink-0 items-center justify-center rounded-[0.75rem] text-xs font-bold theme-text">
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
                      className="theme-text-muted flex w-full cursor-pointer items-center gap-3 rounded-[1rem] px-3 py-2.5 text-left transition hover:bg-white/[0.04] hover:text-white/70"
                    >
                      <span className="text-lg leading-none">+</span>
                      <span className="text-sm font-medium">Create new brand space</span>
                    </button>
                  </div>

                  {createBrandOpen ? (
                    <div className="mt-4 border-t border-white/8 pt-4">
                      <div className="text-xs uppercase tracking-[0.18em] theme-text-muted">New brand</div>
                      <input
                        type="text"
                        value={createBrandName}
                        onChange={(event) => setCreateBrandName(event.target.value)}
                        placeholder="Brand name"
                        className="field mt-3"
                      />
                      <div className="mt-3 flex gap-2">
                        <button type="button" onClick={handleCreateBrand} disabled={brandActionLoading} className="cta-primary w-full cursor-pointer text-sm">
                          {brandActionLoading ? 'Creating...' : 'Create'}
                        </button>
                        <button type="button" onClick={() => setCreateBrandOpen(false)} className="cta-secondary w-full cursor-pointer text-sm">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : null}

                  {brandActionMessage ? (
                    <div className="mt-4 rounded-[1rem] border border-white/8 bg-white/[0.03] px-3 py-3 text-sm theme-text-muted">
                      {brandActionMessage}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <div className="relative" ref={createMenuRef}>
              <button
                type="button"
                onClick={() => setCreateMenuOpen((current) => !current)}
                className="cta-primary h-10 cursor-pointer gap-2 rounded-full px-4 text-sm"
              >
                <span className="text-base leading-none">+</span>
                <span>New</span>
              </button>

                {createMenuOpen ? (
                  <div className="theme-surface absolute right-0 top-12 z-50 w-[220px] rounded-[1rem] border p-1 shadow-2xl">
                    <Link
                      href="/generate"
                      onClick={() => setCreateMenuOpen(false)}
                      className="theme-text flex w-full cursor-pointer items-center justify-between rounded-[0.75rem] px-3 py-2 text-sm font-medium transition hover:bg-[color:var(--menu-item-bg)]"
                    >
                      <span>New project</span>
                      <span className="theme-text-muted text-xs">Generate</span>
                    </Link>
                    <Link
                      href="/assets"
                      onClick={() => setCreateMenuOpen(false)}
                      className="theme-text flex w-full cursor-pointer items-center justify-between rounded-[0.75rem] px-3 py-2 text-sm font-medium transition hover:bg-[color:var(--menu-item-bg)]"
                    >
                      <span>New asset</span>
                      <span className="theme-text-muted text-xs">Library</span>
                    </Link>
                  </div>
              ) : null}
            </div>

            <div className="relative" ref={accountMenuRef}>
              <button
                type="button"
                onClick={() => setAccountOpen((current) => !current)}
                className="theme-subtle-hover flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border text-xs font-bold tracking-[0.12em] theme-text transition"
              >
                {initials}
              </button>

              {accountOpen ? (
                <div className="theme-surface-alt absolute right-0 top-12 z-50 w-[300px] rounded-[1.4rem] border p-4 shadow-2xl">
                  <div className="text-xs uppercase tracking-[0.18em] theme-text-muted">Signed in as</div>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="theme-subtle flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xs font-bold tracking-[0.12em] theme-text">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold theme-text">
                        {displayName || 'Sellworks user'}
                      </div>
                      <div className="truncate text-xs theme-text-muted">{user?.email}</div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <Link href="/billing" className="cta-secondary w-full justify-start text-sm" onClick={() => setAccountOpen(false)}>
                      Account Settings
                    </Link>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setThemeMenuOpen((current) => !current)}
                        className="cta-secondary w-full cursor-pointer justify-between text-sm"
                      >
                        <span>Theme</span>
                        <span className="theme-text-muted text-xs">
                          {themePreference === 'system'
                            ? 'System'
                            : themePreference === 'light'
                              ? 'Light'
                              : 'Dark'}
                        </span>
                      </button>

                      {themeMenuOpen ? (
                        <div className="theme-surface absolute right-[calc(100%+0.75rem)] top-0 z-50 w-[220px] rounded-[1rem] border p-1 shadow-2xl">
                          {([
                            { value: 'light', label: 'Light' },
                            { value: 'dark', label: 'Dark' },
                            { value: 'system', label: 'Sync with system' },
                          ] as const).map((option) => {
                            const active = themePreference === option.value
                            return (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                  setThemePreference(option.value)
                                  setThemeMenuOpen(false)
                                }}
                                className={`flex w-full cursor-pointer items-center justify-between rounded-[0.75rem] px-3 py-2 text-sm transition ${
                                  active
                                    ? 'theme-subtle theme-text'
                                    : 'theme-text-muted hover:bg-[color:var(--menu-item-bg)] hover:text-white'
                                }`}
                              >
                                <span>{option.label}</span>
                                <span className={active ? 'theme-text' : 'opacity-0'}>✓</span>
                              </button>
                            )
                          })}
                        </div>
                      ) : null}
                    </div>
                    <button onClick={handleLogout} className="cta-secondary w-full cursor-pointer justify-start text-sm">
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
        <aside
          className={`theme-sidebar hidden h-full shrink-0 border-r px-3 py-4 transition-[width] duration-200 lg:flex lg:flex-col ${
            sidebarCollapsed ? 'w-[76px]' : 'w-[220px]'
          }`}
        >
          <div className="hidden">
            <button
              type="button"
              onClick={() => setSidebarCollapsed((current) => !current)}
              className="theme-subtle theme-subtle-hover flex h-9 w-9 items-center justify-center rounded-[0.9rem] text-sm theme-text transition"
              aria-label={sidebarCollapsed ? 'Open sidebar' : 'Close sidebar'}
              title={sidebarCollapsed ? 'Open sidebar' : 'Close sidebar'}
            >
              {sidebarCollapsed ? '→' : '←'}
            </button>
          </div>

          <nav className="flex flex-1 flex-col gap-1.5 text-sm font-semibold">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${linkClassName(item.href)} ${sidebarCollapsed ? 'flex justify-center px-0' : 'flex items-center gap-3'}`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <span className={`${sidebarCollapsed ? 'text-base' : 'text-sm'} leading-none`}>
                  {item.icon}
                </span>
                {!sidebarCollapsed ? <span>{item.label}</span> : null}
              </Link>
            ))}
          </nav>
          <div className={`mt-4 flex border-t border-white/8 pt-3 ${sidebarCollapsed ? 'justify-center' : 'justify-start'}`}>
            <button
              type="button"
              onClick={() => setSidebarCollapsed((current) => !current)}
              className="theme-subtle theme-subtle-hover flex h-9 w-9 cursor-pointer items-center justify-center rounded-[0.8rem] theme-text transition"
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <span className="flex h-4 w-4 items-center gap-[3px]">
                <span className="block h-4 w-[5px] rounded-[2px] border border-current opacity-90" />
                <span className="block h-4 w-[8px] rounded-[2px] border border-current opacity-55" />
              </span>
            </button>
          </div>
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
