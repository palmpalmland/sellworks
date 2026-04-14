'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import UpgradeButton from '@/components/UpgradeButton'
import { useMarketingAuth } from '@/components/MarketingAuth'

type PricingActionProps = {
  planKey?: 'pro' | 'team'
  label?: string
}

export default function PricingAction({ planKey = 'pro', label }: PricingActionProps) {
  const [user, setUser] = useState<User | null>(null)
  const { openAuth } = useMarketingAuth()

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
      <button type="button" onClick={openAuth} className="cta-primary w-full px-6 py-4 text-sm uppercase tracking-[0.18em]">
        Sign Up To Upgrade
      </button>
      <p className="text-center text-sm text-white/48">
        Pricing is public. Upgrades unlock after login.
      </p>
    </div>
  )
}
