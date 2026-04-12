'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: name.trim(),
        },
      },
    })

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Check your email to confirm')
    }
  }

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMessage(error.message)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="section-space">
      <div className="page-shell grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
        <section className="panel-strong rounded-[2.2rem] p-8 md:p-10">
          <div className="eyebrow">Access Sellworks</div>
          <h1 className="headline mt-6 text-4xl font-black text-white md:text-6xl">
            Sign in to your Sellworks workspace
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-white/62">
            Public pages explain the product. Your private Sellworks workspace is where
            you generate product listing copy, Amazon-ready images, and TikTok ad creatives.
          </p>
        </section>

        <section className="panel rounded-[2.2rem] p-8 md:p-10">
          <div className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300/76">
            Account access
          </div>
          <div className="mt-3 headline text-3xl font-black text-white">
            Start generating content kits
          </div>

          <div className="mt-8 space-y-4">
            <input
              type="text"
              placeholder="Full name"
              className="field"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="email"
              placeholder="Email"
              className="field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button onClick={handleSignIn} className="cta-primary w-full">
              Sign In
            </button>
            <button onClick={handleSignUp} className="cta-secondary w-full">
              Create Account
            </button>
          </div>

          <div className="mt-6 rounded-[1.4rem] border border-white/8 bg-white/4 px-4 py-4 text-sm text-white/58">
            {message || "Use a real email if you want to test signup and confirmation flow."}
          </div>
        </section>
      </div>
    </div>
  )
}
