'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type AuthFormProps = {
  onSuccess?: () => void
  compact?: boolean
}

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0">
      <path
        fill="#4285F4"
        d="M21.35 11.1H12v2.98h5.35c-.23 1.5-1.85 4.4-5.35 4.4-3.23 0-5.86-2.67-5.86-5.96s2.63-5.96 5.86-5.96c1.84 0 3.07.79 3.78 1.46l2.58-2.52C16.72 3.98 14.6 3 12 3 7.03 3 3 7.03 3 12s4.03 9 9 9c5.2 0 8.64-3.65 8.64-8.8 0-.59-.07-1.04-.15-1.1Z"
      />
      <path
        fill="#34A853"
        d="M3 7.36 5.45 9.16C6.11 7.32 7.89 6 12 6c1.84 0 3.07.79 3.78 1.46l2.58-2.52C16.72 3.98 14.6 3 12 3 8.52 3 5.51 4.99 3.99 7.9L3 7.36Z"
      />
      <path
        fill="#FBBC05"
        d="M3.99 16.1A8.98 8.98 0 0 0 12 21c2.52 0 4.64-.83 6.19-2.25l-3.02-2.34c-.85.59-1.95.95-3.17.95-3.48 0-5.12-2.35-5.96-4.5l-2.05 1.58Z"
      />
      <path
        fill="#EA4335"
        d="M6.04 12.86A5.9 5.9 0 0 1 5.7 12c0-.3.04-.59.1-.86L3.99 9.56A8.9 8.9 0 0 0 3 12c0 1.41.32 2.74.89 3.9l2.15-1.66Z"
      />
    </svg>
  )
}

export default function AuthForm({ onSuccess, compact = false }: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [emailMode, setEmailMode] = useState<'entry' | 'signin' | 'signup'>('entry')
  const [submittingAction, setSubmittingAction] = useState<'continue' | 'signin' | 'signup' | 'google' | null>(null)
  const router = useRouter()

  const getNextPath = () => {
    if (typeof window === 'undefined') {
      return '/dashboard'
    }

    return new URLSearchParams(window.location.search).get('next') || '/dashboard'
  }

  const handleEmailContinue = async () => {
    const trimmedEmail = email.trim()

    if (!trimmedEmail) {
      setMessage('Please enter your email.')
      return
    }

    try {
      setSubmittingAction('continue')
      setMessage('')

      const response = await fetch('/api/auth/email-state', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: trimmedEmail,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        setMessage(data.error || 'Unable to continue with email right now.')
        return
      }

      const nextMode = data.exists ? 'signin' : 'signup'
      setEmailMode(nextMode)
      setPassword('')
      setMessage(nextMode === 'signin' ? 'Enter your password to sign in.' : 'Set a password to create your account.')
    } finally {
      setSubmittingAction(null)
    }
  }

  const handleSignUp = async () => {
    const trimmedEmail = email.trim()

    if (!trimmedEmail || !password) {
      setMessage('Email and password are required to sign up.')
      return
    }

    try {
      setSubmittingAction('signup')
      setMessage('')

      const nextPath = getNextPath()
      const redirectTarget =
        typeof window === 'undefined'
          ? undefined
          : `${window.location.origin}/login?next=${encodeURIComponent(nextPath)}`

      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          emailRedirectTo: redirectTarget,
        },
      })

      if (error) {
        setMessage(error.message)
      } else if (data.session) {
        onSuccess?.()
        router.push(nextPath)
      } else {
        setMessage('Sign up successful. Check your email to confirm your account, then come back and sign in.')
      }
    } finally {
      setSubmittingAction(null)
    }
  }

  const handleSignIn = async () => {
    const trimmedEmail = email.trim()

    if (!trimmedEmail || !password) {
      setMessage('Email and password are required to sign in.')
      return
    }

    try {
      setSubmittingAction('signin')
      setMessage('')

      const nextPath = getNextPath()
      const { error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      })

      if (error) {
        setMessage(error.message)
      } else {
        onSuccess?.()
        router.push(nextPath)
      }
    } finally {
      setSubmittingAction(null)
    }
  }

  const handleGoogleAuth = async () => {
    try {
      setSubmittingAction('google')
      setMessage('')

      const nextPath = getNextPath()
      const redirectTarget =
        typeof window === 'undefined'
          ? undefined
          : `${window.location.origin}${nextPath}`

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectTarget,
        },
      })

      if (error) {
        setMessage(error.message)
      }
    } finally {
      setSubmittingAction(null)
    }
  }

  const handleEmailChange = (value: string) => {
    setEmail(value)
    if (emailMode !== 'entry') {
      setEmailMode('entry')
      setPassword('')
      setMessage('')
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (emailMode === 'entry') {
      await handleEmailContinue()
      return
    }

    if (emailMode === 'signin') {
      await handleSignIn()
      return
    }

    await handleSignUp()
  }

  return (
    <div className={compact ? '' : 'panel rounded-[2.2rem] p-8 md:p-10'}>
      {!compact ? (
        <>
          <div className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300/76">
            Account access
          </div>
          <div className="mt-3 headline text-3xl font-black text-white">
            Start generating content kits
          </div>
        </>
      ) : null}

      <div className={compact ? '' : 'mt-8'}>
        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={submittingAction !== null}
          className="cta-secondary w-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
        >
          <GoogleIcon />
          {submittingAction === 'google' ? 'Connecting Google...' : 'Continue with Google'}
        </button>
      </div>

      <div className="mt-6 flex items-center gap-4 text-xs uppercase tracking-[0.18em] text-white/34">
        <div className="h-px flex-1 bg-white/8" />
        <span>Or use email</span>
        <div className="h-px flex-1 bg-white/8" />
      </div>

      <form className="mt-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="field"
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
          />

          {emailMode !== 'entry' ? (
            <input
              type="password"
              placeholder={emailMode === 'signin' ? 'Password' : 'Create a password'}
              className="field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          ) : null}
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={submittingAction !== null}
            className="cta-primary w-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
          >
            {emailMode === 'entry'
              ? submittingAction === 'continue'
                ? 'Checking email...'
                : 'Continue with email'
              : emailMode === 'signin'
                ? submittingAction === 'signin'
                  ? 'Signing in...'
                  : 'Sign in'
                : submittingAction === 'signup'
                  ? 'Signing up...'
                  : 'Sign up'}
          </button>
        </div>
      </form>

      {message ? (
        <div className="mt-6 rounded-[1.4rem] border border-white/8 bg-white/4 px-4 py-4 text-sm text-white/58">
          {message}
        </div>
      ) : null}
    </div>
  )
}
