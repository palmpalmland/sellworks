'use client'

import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import UpgradeButton from '@/components/UpgradeButton'
import { BRAND_CHANGED_EVENT, getStoredActiveBrandId } from '@/lib/brand-session'

type UsageData = {
  plan?: string
  plan_label?: string
  billing_scope?: string
  shared_credit_pool?: boolean
  credits_total: number
  credits_used: number
  credits_remaining: number
  brands_included?: number
  brands_connected?: number
  members_included?: number
}

export default function BillingPage() {
  const [user, setUser] = useState<User | null>(null)
  const [usage, setUsage] = useState<UsageData | null>(null)
  const [displayName, setDisplayName] = useState('')
  const [profileMessage, setProfileMessage] = useState('')
  const [securityMessage, setSecurityMessage] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [activeBrandId, setActiveBrandId] = useState<string | null>(null)

  useEffect(() => {
    setActiveBrandId(getStoredActiveBrandId())

    const handleBrandChanged = (event: Event) => {
      const customEvent = event as CustomEvent<{ brandId?: string }>
      setActiveBrandId(customEvent.detail?.brandId || getStoredActiveBrandId())
    }

    window.addEventListener(BRAND_CHANGED_EVENT, handleBrandChanged as EventListener)

    const load = async () => {
      const { data } = await supabase.auth.getUser()
      const currentUser = data.user
      setUser(currentUser)
      setDisplayName(currentUser?.user_metadata?.display_name?.toString() || '')

      if (!currentUser) return

      const {
        data: { session },
      } = await supabase.auth.getSession()

      const query = activeBrandId
        ? `/api/usage?brandId=${encodeURIComponent(activeBrandId)}`
        : '/api/usage'
      const res = await fetch(query, {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      })
      const json = await res.json()

      if (json?.data) {
        setUsage(json.data)
      }
    }

    load()

    return () => {
      window.removeEventListener(BRAND_CHANGED_EVENT, handleBrandChanged as EventListener)
    }
  }, [activeBrandId])

  const handleSaveProfile = async () => {
    setSavingProfile(true)
    setProfileMessage('')

    const { data, error } = await supabase.auth.updateUser({
      data: {
        display_name: displayName.trim(),
      },
    })

    setSavingProfile(false)

    if (error) {
      setProfileMessage(error.message)
      return
    }

    setUser(data.user)
    setProfileMessage('Profile updated.')
  }

  const handleChangePassword = async () => {
    setSecurityMessage('')

    if (newPassword.length < 6) {
      setSecurityMessage('Password must be at least 6 characters.')
      return
    }

    if (newPassword !== confirmPassword) {
      setSecurityMessage('Passwords do not match.')
      return
    }

    setSavingPassword(true)

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    setSavingPassword(false)

    if (error) {
      setSecurityMessage(error.message)
      return
    }

    setNewPassword('')
    setConfirmPassword('')
    setSecurityMessage('Password updated.')
  }

  return (
    <main className="space-y-5 py-1">
      <section className="panel-strong rounded-[1.8rem] p-6 md:p-8">
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">Account</div>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
          Subscription, billing, and workspace settings
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-white/58">
          Keep credits, plan management, billing decisions, and operator settings here instead of turning dashboard into an accounting page.
        </p>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="panel rounded-[1.8rem] p-6 md:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-2xl font-bold text-white">Current subscription</div>
              <div className="mt-2 text-sm text-white/52">
                {(usage?.plan_label || usage?.plan || 'Free')} plan
              </div>
            </div>
            <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-white/58">
              Active
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.3rem] border border-white/8 bg-white/[0.03] p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-white/36">Credits total</div>
              <div className="mt-3 text-3xl font-bold text-white">{usage?.credits_total ?? 0}</div>
            </div>
            <div className="rounded-[1.3rem] border border-white/8 bg-white/[0.03] p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-white/36">Credits used</div>
              <div className="mt-3 text-3xl font-bold text-white">{usage?.credits_used ?? 0}</div>
            </div>
            <div className="rounded-[1.3rem] border border-white/8 bg-white/[0.03] p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-white/36">Credits left</div>
              <div className="mt-3 text-3xl font-bold text-white">{usage?.credits_remaining ?? 0}</div>
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.3rem] border border-white/8 bg-white/[0.03] p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-white/36">Billing scope</div>
              <div className="mt-3 text-lg font-semibold text-white">
                {usage?.billing_scope === 'organization' ? 'Shared workspace pool' : 'Single brand'}
              </div>
            </div>
            <div className="rounded-[1.3rem] border border-white/8 bg-white/[0.03] p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-white/36">Brands included</div>
              <div className="mt-3 text-lg font-semibold text-white">{usage?.brands_included ?? 1}</div>
            </div>
            <div className="rounded-[1.3rem] border border-white/8 bg-white/[0.03] p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-white/36">Members included</div>
              <div className="mt-3 text-lg font-semibold text-white">{usage?.members_included ?? 1}</div>
            </div>
          </div>

          <div className="mt-6 max-w-sm">
            <UpgradeButton />
          </div>
        </div>

        <div className="panel rounded-[1.8rem] p-6 md:p-7">
          <div className="text-2xl font-bold text-white">Workspace details</div>
          <div className="mt-5 space-y-4">
            <div className="rounded-[1.3rem] border border-white/8 bg-white/[0.03] p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-white/36">Profile</div>
              <div className="mt-4 space-y-3">
                <input
                  type="text"
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  placeholder="Display name"
                  className="field"
                />
                <div className="rounded-[1rem] border border-white/8 bg-white/[0.03] px-4 py-3">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-white/36">Operator email</div>
                  <div className="mt-2 text-sm font-semibold text-white">{user?.email || 'Not available'}</div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button onClick={handleSaveProfile} className="cta-primary text-sm" disabled={savingProfile}>
                    {savingProfile ? 'Saving...' : 'Save profile'}
                  </button>
                  <div className="text-sm text-white/54">
                    {profileMessage || 'Use this name across the workspace instead of the raw email.'}
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-[1.3rem] border border-white/8 bg-white/[0.03] p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-white/36">Security</div>
              <div className="mt-4 space-y-3">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  placeholder="New password"
                  className="field"
                />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Confirm new password"
                  className="field"
                />
                <div className="flex flex-wrap items-center gap-3">
                  <button onClick={handleChangePassword} className="cta-secondary text-sm" disabled={savingPassword}>
                    {savingPassword ? 'Updating...' : 'Change password'}
                  </button>
                  <div className="text-sm text-white/54">
                    {securityMessage || 'Update your workspace password here.'}
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-[1.3rem] border border-white/8 bg-white/[0.03] p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-white/36">Admin tools</div>
              <div className="mt-2 text-sm leading-7 text-white/58">
                Good future fits here: API keys, export defaults, team seats, billing contacts, invoice history, and usage alerts.
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
