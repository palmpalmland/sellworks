'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
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
      setMessage('Login successful')
    }
  }

  return (
    <div className="section-space">
      <div className="page-shell grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
        <section className="panel-strong rounded-[2.2rem] p-8 md:p-10">
          <div className="eyebrow">Access your workspace</div>
          <h1 className="headline mt-6 text-4xl font-black text-white md:text-6xl">
            Sign in to your content engine
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-white/62">
            Keep generation, billing, and usage tracking inside one clean account flow.
            Use sign in if you already have an account, or create one to start testing.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="panel rounded-[1.5rem] p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-white/36">Auth</div>
              <div className="mt-2 text-lg font-bold text-white">Supabase</div>
            </div>
            <div className="panel rounded-[1.5rem] p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-white/36">Billing</div>
              <div className="mt-2 text-lg font-bold text-white">Stripe-ready</div>
            </div>
            <div className="panel rounded-[1.5rem] p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-white/36">Flow</div>
              <div className="mt-2 text-lg font-bold text-white">MVP to launch</div>
            </div>
          </div>
        </section>

        <section className="panel rounded-[2.2rem] p-8 md:p-10">
          <div className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300/76">
            Account access
          </div>
          <div className="mt-3 headline text-3xl font-black text-white">
            Continue building momentum
          </div>

          <div className="mt-8 space-y-4">
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
