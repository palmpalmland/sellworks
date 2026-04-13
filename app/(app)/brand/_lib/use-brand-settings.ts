'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import {
  BRAND_CHANGED_EVENT,
  emitBrandChanged,
  getStoredActiveBrandId,
  getStoredBrand,
} from '@/lib/brand-session'
import type { BrandRecord } from '@/lib/project-types'

export type BrandMember = {
  id: string
  user_id: string
  role: string
  created_at: string
  email: string | null
  display_name: string | null
}

export type BrandInvite = {
  id: string
  email: string
  role: string
  status: string
  token: string
  created_at: string
}

type BrandMembership = {
  role: string
}

export function useBrandSettings() {
  const [brand, setBrand] = useState<BrandRecord | null>(null)
  const [members, setMembers] = useState<BrandMember[]>([])
  const [invites, setInvites] = useState<BrandInvite[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [membershipRole, setMembershipRole] = useState<string | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [activeBrandId, setActiveBrandId] = useState<string | null>(null)
  const [hydrationReady, setHydrationReady] = useState(false)

  useEffect(() => {
    const cachedBrand = getStoredBrand()
    if (cachedBrand) {
      setBrand(cachedBrand)
    }

    setActiveBrandId(getStoredActiveBrandId())
    setHydrationReady(true)

    const handleBrandChanged = (event: Event) => {
      const customEvent = event as CustomEvent<{ brandId?: string; brand?: BrandRecord }>
      setActiveBrandId(customEvent.detail?.brandId || getStoredActiveBrandId())
      if (customEvent.detail?.brand) {
        setBrand(customEvent.detail.brand)
      }
    }

    window.addEventListener(BRAND_CHANGED_EVENT, handleBrandChanged as EventListener)
    return () => {
      window.removeEventListener(BRAND_CHANGED_EVENT, handleBrandChanged as EventListener)
    }
  }, [])

  useEffect(() => {
    if (!hydrationReady) {
      return
    }

    const loadBrand = async () => {
      try {
        setLoading(true)
        setMessage('')

        const {
          data: { session },
        } = await supabase.auth.getSession()

        setCurrentUserId(session?.user?.id || null)

        const brandQuery = activeBrandId ? `?brandId=${encodeURIComponent(activeBrandId)}` : ''
        const brandRes = await fetch(`/api/brand${brandQuery}`, {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        })

        const brandJson = await brandRes.json().catch(() => null)

        if (!brandRes.ok || !brandJson?.data?.brand) {
          throw new Error(brandJson?.error || 'Failed to load brand')
        }

        const currentBrand = brandJson.data.brand as BrandRecord
        setBrand(currentBrand)
        emitBrandChanged(currentBrand)
        setMembers((brandJson.data.members as BrandMember[]) || [])
        setInvites((brandJson.data.invites as BrandInvite[]) || [])
        setMembershipRole((brandJson.data.membership as BrandMembership | undefined)?.role || null)
      } catch (error: unknown) {
        setMessage(error instanceof Error ? error.message : 'Failed to load brand')
      } finally {
        setLoading(false)
      }
    }

    loadBrand()
  }, [activeBrandId, hydrationReady])

  const updateBrand = async (payload: {
    name: string
    description: string
    website: string
    voiceTone: string
    targetAudience: string
    primaryColor: string
    enabledPlatforms?: string[]
  }) => {
    if (!brand?.id) {
      setMessage('Select a brand first.')
      return null
    }

    const {
      data: { session },
    } = await supabase.auth.getSession()

    const brandQuery = `?brandId=${encodeURIComponent(brand.id)}`
    const res = await fetch(`/api/brand${brandQuery}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify(payload),
    })

    const json = await res.json()

    if (!res.ok) {
      throw new Error(json.error || 'Failed to save brand')
    }

    const nextBrand = json.data.brand as BrandRecord
    setBrand(nextBrand)
    emitBrandChanged(nextBrand)
    setMessage('Brand workspace updated.')
    return nextBrand
  }

  const createInvite = async (email: string, role: string) => {
    if (!brand?.id) {
      setMessage('Select a brand first.')
      return null
    }

    const {
      data: { session },
    } = await supabase.auth.getSession()

    const res = await fetch('/api/brand/invites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({
        brandId: brand.id,
        email,
        role,
      }),
    })

    const json = await res.json()

    if (!res.ok) {
      throw new Error(json.error || 'Failed to create invite')
    }

    const nextInvite = json.data.invite as BrandInvite
    setInvites((current) => {
      const withoutExisting = current.filter((item) => item.id !== nextInvite.id)
      return [nextInvite, ...withoutExisting]
    })
    setMessage(`Invite saved for ${nextInvite.email}.`)
    return nextInvite
  }

  const copyInviteLink = async (token: string) => {
    try {
      const inviteUrl = `${window.location.origin}/invite/${token}`
      await navigator.clipboard.writeText(inviteUrl)
      setMessage('Invite link copied.')
    } catch {
      setMessage('Could not copy invite link.')
    }
  }

  const updateMemberRole = async (memberId: string, role: string) => {
    if (!brand?.id) {
      return
    }

    const {
      data: { session },
    } = await supabase.auth.getSession()

    const res = await fetch('/api/brand/members', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({
        brandId: brand.id,
        memberId,
        role,
      }),
    })

    const json = await res.json()
    if (!res.ok) {
      throw new Error(json.error || 'Failed to update member role')
    }

    setMembers((current) =>
      current.map((member) => (member.id === memberId ? { ...member, role } : member))
    )
    setMessage('Member role updated.')
  }

  const removeMember = async (memberId: string) => {
    if (!brand?.id) {
      return
    }

    const {
      data: { session },
    } = await supabase.auth.getSession()

    const res = await fetch('/api/brand/members', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({
        brandId: brand.id,
        memberId,
      }),
    })

    const json = await res.json().catch(() => null)
    if (!res.ok) {
      throw new Error(json?.error || 'Failed to remove member')
    }

    setMembers((current) => current.filter((member) => member.id !== memberId))
    setMessage('Member removed.')
  }

  const revokeInvite = async (inviteId: string) => {
    if (!brand?.id) {
      return
    }

    const {
      data: { session },
    } = await supabase.auth.getSession()

    const res = await fetch('/api/brand/invites', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({
        brandId: brand.id,
        inviteId,
      }),
    })

    const json = await res.json().catch(() => null)
    if (!res.ok) {
      throw new Error(json?.error || 'Failed to revoke invite')
    }

    setInvites((current) => current.filter((invite) => invite.id !== inviteId))
    setMessage('Invite revoked.')
  }

  return {
    brand,
    members,
    invites,
    loading,
    message,
    setMessage,
    membershipRole,
    currentUserId,
    updateBrand,
    createInvite,
    copyInviteLink,
    updateMemberRole,
    removeMember,
    revokeInvite,
  }
}
