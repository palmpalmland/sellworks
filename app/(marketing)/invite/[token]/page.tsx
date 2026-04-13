'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { BrandRecord } from '@/lib/project-types'
import { emitBrandChanged } from '@/lib/brand-session'

type InviteRecord = {
  id: string
  email: string
  role: string
  status: string
  token: string
}

export default function InvitePage() {
  const params = useParams<{ token: string }>()
  const router = useRouter()
  const token = params?.token
  const [brand, setBrand] = useState<BrandRecord | null>(null)
  const [invite, setInvite] = useState<InviteRecord | null>(null)
  const [sessionEmail, setSessionEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [accepting, setAccepting] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const loadInvite = async () => {
      try {
        setLoading(true)

        const {
          data: { session },
        } = await supabase.auth.getSession()
        setSessionEmail(session?.user?.email?.trim().toLowerCase() || null)

        const res = await fetch(`/api/brand/invites/${token}`)
        const json = await res.json()

        if (!res.ok) {
          throw new Error(json.error || 'Invite not found')
        }

        setBrand((json.data.brand as BrandRecord) || null)
        setInvite((json.data.invite as InviteRecord) || null)
      } catch (error: unknown) {
        setMessage(error instanceof Error ? error.message : 'Failed to load invite')
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      loadInvite()
    }
  }, [token])

  const handleAccept = async () => {
    try {
      setAccepting(true)
      setMessage('')

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.access_token) {
        router.push(`/login?next=${encodeURIComponent(`/invite/${token}`)}`)
        return
      }

      const res = await fetch(`/api/brand/invites/${token}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      })
      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error || 'Failed to accept invite')
      }

      const nextBrand = json.data.brand as BrandRecord
      if (nextBrand) {
        emitBrandChanged(nextBrand)
      }

      setInvite((current) =>
        current
          ? {
              ...current,
              status: 'accepted',
            }
          : current
      )
      setMessage(`You joined ${nextBrand?.name || 'this brand'} successfully.`)
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : 'Failed to accept invite')
    } finally {
      setAccepting(false)
    }
  }

  const loginPath = `/login?next=${encodeURIComponent(`/invite/${token}`)}`
  const emailMismatch =
    sessionEmail && invite?.email ? sessionEmail !== invite.email.trim().toLowerCase() : false

  return (
    <div className="section-space">
      <div className="page-shell">
        <section className="panel-strong rounded-[2.2rem] p-8 md:p-10">
          <div className="eyebrow">Brand Invite</div>
          <h1 className="headline mt-6 text-4xl font-black text-white md:text-6xl">
            Join {brand?.name || 'this brand workspace'}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/62">
            Accept this invite to collaborate on shared projects, generated assets, and future content output inside the same Sellworks brand workspace.
          </p>
        </section>

        <section className="panel mt-6 rounded-[2.2rem] p-8 md:p-10">
          {loading ? (
            <div className="text-sm text-white/58">Loading invite...</div>
          ) : invite ? (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-[1.3rem] border border-white/8 bg-white/[0.03] p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-white/36">Brand</div>
                  <div className="mt-2 text-sm font-semibold text-white">{brand?.name || 'Workspace'}</div>
                </div>
                <div className="rounded-[1.3rem] border border-white/8 bg-white/[0.03] p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-white/36">Role</div>
                  <div className="mt-2 text-sm font-semibold uppercase text-white">{invite.role}</div>
                </div>
                <div className="rounded-[1.3rem] border border-white/8 bg-white/[0.03] p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-white/36">Invited email</div>
                  <div className="mt-2 text-sm font-semibold text-white">{invite.email}</div>
                </div>
              </div>

              {invite.status === 'accepted' ? (
                <div className="rounded-[1.4rem] border border-emerald-400/20 bg-emerald-400/10 px-4 py-4 text-sm text-emerald-100">
                  This invite has already been accepted. You can go straight to the workspace.
                </div>
              ) : null}

              {emailMismatch ? (
                <div className="rounded-[1.4rem] border border-amber-300/20 bg-amber-300/10 px-4 py-4 text-sm text-amber-100">
                  You are signed in as {sessionEmail}, but this invite is reserved for {invite.email}. Sign in with the invited email before accepting.
                </div>
              ) : null}

              {message ? (
                <div className="rounded-[1.4rem] border border-white/8 bg-white/[0.03] px-4 py-4 text-sm text-white/72">
                  {message}
                </div>
              ) : null}

              <div className="flex flex-wrap gap-3">
                {!sessionEmail ? (
                  <>
                    <Link href={loginPath} className="cta-primary">
                      Sign in to accept
                    </Link>
                    <Link href={loginPath} className="cta-secondary">
                      Create account
                    </Link>
                  </>
                ) : invite.status === 'accepted' ? (
                  <Link href="/dashboard" className="cta-primary">
                    Open workspace
                  </Link>
                ) : (
                  <button onClick={handleAccept} disabled={accepting || emailMismatch} className="cta-primary disabled:cursor-not-allowed disabled:opacity-60">
                    {accepting ? 'Joining...' : 'Accept invite'}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-[1.4rem] border border-red-400/20 bg-red-400/10 px-4 py-4 text-sm text-red-100">
              {message || 'Invite not found.'}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
