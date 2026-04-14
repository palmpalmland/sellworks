'use client'

import { createContext, useContext, useMemo, useState } from 'react'
import AuthForm from '@/components/AuthForm'

type MarketingAuthContextValue = {
  openAuth: () => void
  closeAuth: () => void
}

const MarketingAuthContext = createContext<MarketingAuthContextValue | null>(null)

export function MarketingAuthProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  const value = useMemo(
    () => ({
      openAuth: () => setOpen(true),
      closeAuth: () => setOpen(false),
    }),
    []
  )

  return (
    <MarketingAuthContext.Provider value={value}>
      {children}
      {open ? <MarketingAuthModal onClose={() => setOpen(false)} /> : null}
    </MarketingAuthContext.Provider>
  )
}

export function useMarketingAuth() {
  const context = useContext(MarketingAuthContext)

  if (!context) {
    throw new Error('useMarketingAuth must be used within MarketingAuthProvider')
  }

  return context
}

function MarketingAuthModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 px-4 py-10 backdrop-blur-sm">
      <div className="panel-strong relative w-full max-w-xl rounded-[2rem] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
        <button
          type="button"
          onClick={onClose}
          className="theme-subtle theme-subtle-hover absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] theme-text-muted transition-colors"
          aria-label="Close auth dialog"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>

        <div className="pr-12">
          <div className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300/76">
            Account access
          </div>
          <div className="mt-3 headline text-3xl font-black text-white">
            Sign in to Sellworks
          </div>
          <p className="mt-3 text-sm leading-7 text-white/56">
            Continue with Google or use your email to sign in or create an account.
          </p>
        </div>

        <div className="mt-8">
          <AuthForm compact onSuccess={onClose} />
        </div>
      </div>
    </div>
  )
}
