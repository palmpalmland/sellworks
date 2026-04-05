'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }

    getUser()
  }, [])

  return (
    <nav className="w-full border-b border-gray-700 px-8 py-5">
      <div className="flex gap-8 text-white text-lg">
        <Link href="/">Home</Link>
        {!user && <Link href="/login">Login</Link>}
        {user && <Link href="/dashboard">Dashboard</Link>}
        {user && <Link href="/generate">Generate</Link>}
        {user && <Link href="/history">History</Link>}
        <Link href="/pricing">Pricing</Link>
      </div>
    </nav>
  )
}