'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type UsageData = {
  plan?: string
  credits_total: number
  credits_used: number
  credits_remaining: number
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [usage, setUsage] = useState<UsageData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        console.log('step 1: start loadDashboard')

        const { data, error } = await supabase.auth.getUser()
        console.log('step 2: getUser result =', data, error)

        const currentUser = data.user
        setUser(currentUser)

        if (!currentUser) {
          console.log('step 3: no currentUser')
          return
        }

        console.log('step 4: currentUser.id =', currentUser.id)

        const res = await fetch(`/api/usage?userId=${currentUser.id}`)
        console.log('step 5: fetch response status =', res.status)

        const json = await res.json()
        console.log('step 6: usage json =', json)

        if (json.data) {
          setUsage(json.data)
        }
      } catch (error) {
        console.error('Failed to load dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    location.reload()
  }

  if (loading) {
    return <main className="min-h-screen p-10">Loading dashboard...</main>
  }

  return (
    <main className="min-h-screen p-10 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {user ? (
        <>
          <div className="space-y-2">
            <p>Logged in as: {user.email}</p>

            <button
              onClick={handleLogout}
              className="rounded-lg bg-black text-white px-4 py-2"
            >
              Logout
            </button>
          </div>

          {usage ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="rounded-xl border p-4">
                <p className="text-sm text-gray-500">Current Plan</p>
                <p className="text-xl font-semibold">{usage.plan || 'Free'}</p>
              </div>

              <div className="rounded-xl border p-4">
                <p className="text-sm text-gray-500">Total Credits</p>
                <p className="text-xl font-semibold">{usage.credits_total}</p>
              </div>

              <div className="rounded-xl border p-4">
                <p className="text-sm text-gray-500">Used Credits</p>
                <p className="text-xl font-semibold">{usage.credits_used}</p>
              </div>

              <div className="rounded-xl border p-4">
                <p className="text-sm text-gray-500">Remaining Credits</p>
                <p className="text-xl font-semibold">{usage.credits_remaining}</p>
              </div>
            </div>
          ) : (
            <p>No usage data found.</p>
          )}
        </>
      ) : (
        <p>Not logged in</p>
      )}
    </main>
  )
}