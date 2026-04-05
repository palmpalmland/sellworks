'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

type UsageData = {
  plan?: string
  credits_total: number
  credits_used: number
  credits_remaining: number
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [usage, setUsage] = useState<UsageData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const { data } = await supabase.auth.getUser()
        const currentUser = data.user
        setUser(currentUser)

        if (!currentUser) return

        const res = await fetch(`/api/usage?userId=${currentUser.id}`)
        const json = await res.json()

        if (json.data) setUsage(json.data)
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  if (loading) {
    return <main className="py-10 text-white/60">Loading dashboard...</main>
  }

  return (
    <main className="space-y-8 py-2">
      <section className="panel-strong rounded-[2.2rem] p-8 md:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="eyebrow">Workspace overview</div>
            <h1 className="headline mt-6 text-4xl font-black text-white md:text-6xl">
              Your AI content control panel
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/62">
              This is the operator side of the product. Public visitors do not see this shell.
            </p>
          </div>

          {user && (
            <div className="rounded-[1.6rem] border border-white/10 bg-white/6 px-5 py-4 text-sm text-white/60">
              Logged in as
              <div className="mt-1 text-base font-semibold text-white">{user.email}</div>
            </div>
          )}
        </div>
      </section>

      {usage ? (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <div className="panel rounded-[1.8rem] p-6">
            <div className="text-xs uppercase tracking-[0.2em] text-white/38">Current Plan</div>
            <div className="headline mt-3 text-3xl font-black text-white">
              {usage.plan || 'free'}
            </div>
          </div>
          <div className="panel rounded-[1.8rem] p-6">
            <div className="text-xs uppercase tracking-[0.2em] text-white/38">Total Credits</div>
            <div className="headline mt-3 text-3xl font-black text-white">
              {usage.credits_total}
            </div>
          </div>
          <div className="panel rounded-[1.8rem] p-6">
            <div className="text-xs uppercase tracking-[0.2em] text-white/38">Used Credits</div>
            <div className="headline mt-3 text-3xl font-black text-white">
              {usage.credits_used}
            </div>
          </div>
          <div className="panel rounded-[1.8rem] p-6">
            <div className="text-xs uppercase tracking-[0.2em] text-white/38">Remaining</div>
            <div className="headline mt-3 text-3xl font-black text-white">
              {usage.credits_remaining}
            </div>
          </div>
        </section>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="panel rounded-[2rem] p-8">
          <div className="text-xs uppercase tracking-[0.2em] text-white/36">Next actions</div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Link href="/generate" className="cta-primary text-sm">
              Generate New Copy
            </Link>
                  <Link href="/history" className="cta-secondary text-sm">
                    View History
                  </Link>
                  <Link href="/billing" className="cta-secondary text-sm">
                    Manage Plan
                  </Link>
                </div>
              </div>

        <div className="panel rounded-[2rem] p-8">
          <div className="text-xs uppercase tracking-[0.2em] text-white/36">Workspace rule</div>
          <p className="mt-4 text-base leading-8 text-white/62">
            Free users and paid users both land here after signup. The difference is plan
            and credits, not whether they can see the operator shell.
          </p>
        </div>
      </section>
    </main>
  )
}
