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
    <main className="min-h-screen p-10">
      <h1 className="text-3xl font-bold mb-4">Login</h1>

      <div className="max-w-md space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded-lg px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded-lg px-3 py-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSignIn}
          className="rounded-lg bg-black text-white px-4 py-2"
        >
          Sign In
        </button>

        <button
          onClick={handleSignUp}
          className="rounded-lg border px-4 py-2"
        >
          Sign Up
        </button>

        {message && <p className="text-sm">{message}</p>}
      </div>
    </main>
  )
}