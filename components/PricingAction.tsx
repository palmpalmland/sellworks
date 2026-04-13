'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import UpgradeButton from '@/components/UpgradeButton'

type PricingActionProps = {
  planKey?: 'pro' | 'team'
  label?: string
}

export default function PricingAction({ planKey = 'pro', label }: PricingActionProps) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }

    loadUser()
  }, [])

  if (user) {
    return <UpgradeButton planKey={planKey} label={label} />
  }

  return (
    <div className="space-y-3">
      <Link href="/login" className="cta-primary w-full px-6 py-4 text-sm uppercase tracking-[0.18em]">
        Sign Up To Upgrade
      </Link>
      <p className="text-center text-sm text-white/48">
        Pricing is public. Upgrades unlock after login.
      </p>
    </div>
  )
}
