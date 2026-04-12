'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { BrandRecord } from '@/lib/project-types'

type BrandMember = {
  id: string
  user_id: string
  role: string
  created_at: string
}

export default function BrandPage() {
  const [brand, setBrand] = useState<BrandRecord | null>(null)
  const [members, setMembers] = useState<BrandMember[]>([])
  const [loading, setLoading] = useState(true)
  const [brandReady, setBrandReady] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({
    name: '',
    description: '',
    website: '',
    voiceTone: '',
    targetAudience: '',
    primaryColor: '#6d7cff',
  })

  useEffect(() => {
    const loadBrand = async () => {
      try {
        setLoading(true)

        const {
          data: { session },
        } = await supabase.auth.getSession()

        const brandRes = await fetch('/api/brand', {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        })

        if (!brandRes.ok) {
          setBrandReady(false)
          const brandJson = await brandRes.json().catch(() => null)
          throw new Error(brandJson?.error || 'Brand workspace is not available yet')
        }

        const brandJson = await brandRes.json()
        const currentBrand = brandJson?.data?.brand as BrandRecord | undefined

        if (!currentBrand) {
          setBrandReady(false)
          throw new Error(brandJson?.error || 'Brand workspace is not available yet')
        }

        setBrand(currentBrand)
        setForm({
          name: currentBrand.name,
          description: currentBrand.description || '',
          website: currentBrand.website || '',
          voiceTone: currentBrand.voice_tone || '',
          targetAudience: currentBrand.target_audience || '',
          primaryColor: currentBrand.primary_color || '#6d7cff',
        })

        const membersRes = await supabase
          .from('brand_members')
          .select('*')
          .eq('brand_id', currentBrand.id)
          .order('created_at', { ascending: true })

        if (!membersRes.error) {
          setMembers((membersRes.data as BrandMember[]) || [])
        }
      } catch (error: unknown) {
        setMessage(error instanceof Error ? error.message : 'Failed to load brand')
      } finally {
        setLoading(false)
      }
    }

    loadBrand()
  }, [])

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    if (!brandReady) {
      setMessage('Run the brand migration first, then save this workspace.')
      return
    }

    try {
      setSaving(true)
      setMessage('')

      const {
        data: { session },
      } = await supabase.auth.getSession()

      const res = await fetch('/api/brand', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify(form),
      })

      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error || 'Failed to save brand')
      }

      setBrand(json.data.brand as BrandRecord)
      setMessage('Brand workspace updated.')
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : 'Failed to save brand')
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="space-y-5 py-1">
      <section className="panel-strong rounded-[1.8rem] p-6 md:p-8">
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">Brand Workspace</div>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
          Define how {brand?.name || 'your brand'} should look and sound
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-white/58">
          Your brand workspace shapes the voice, positioning, and visual direction used across projects, generated assets, and future team collaboration.
        </p>
      </section>

      {!brandReady && (
        <section className="rounded-[1.6rem] border border-amber-300/20 bg-amber-300/10 px-5 py-4 text-sm leading-7 text-amber-100">
          Brand workspace is not available in this environment yet. Run the migration in
          {' '}
          <span className="font-semibold">C:/Users/zzjac/ai-content-factory/supabase/migrations/20260411_create_brands.sql</span>
          {' '}
          and refresh this page.
        </section>
      )}

      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="panel rounded-[1.8rem] p-6 md:p-7">
          <div className="text-2xl font-bold text-white">Brand concept</div>
          <div className="mt-5 grid gap-4">
            <input
              type="text"
              className="field"
              value={form.name}
              onChange={(event) => handleChange('name', event.target.value)}
              placeholder="Brand name"
            />
            <textarea
              className="field min-h-[140px]"
              value={form.description}
              onChange={(event) => handleChange('description', event.target.value)}
              placeholder="Brand description"
            />
            <input
              type="url"
              className="field"
              value={form.website}
              onChange={(event) => handleChange('website', event.target.value)}
              placeholder="Website"
            />
            <input
              type="text"
              className="field"
              value={form.voiceTone}
              onChange={(event) => handleChange('voiceTone', event.target.value)}
              placeholder="Voice and tone"
            />
            <input
              type="text"
              className="field"
              value={form.targetAudience}
              onChange={(event) => handleChange('targetAudience', event.target.value)}
              placeholder="Target audience"
            />
            <input
              type="text"
              className="field"
              value={form.primaryColor}
              onChange={(event) => handleChange('primaryColor', event.target.value)}
              placeholder="Primary color hex"
            />
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button onClick={handleSave} disabled={saving || loading} className="cta-primary text-sm">
              {saving ? 'Saving...' : 'Save brand'}
            </button>
            <div className="text-sm text-white/54">
              {message || 'This brand concept will become the shared style source for future projects.'}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <section className="panel rounded-[1.8rem] p-6 md:p-7">
            <div className="text-2xl font-bold text-white">Workspace snapshot</div>
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-[1.3rem] border border-white/8 bg-white/[0.03] p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-white/36">Website</div>
                <div className="mt-2 text-sm font-semibold text-white">
                  {brand?.website || form.website || 'Not set yet'}
                </div>
              </div>
              <div className="rounded-[1.3rem] border border-white/8 bg-white/[0.03] p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-white/36">Primary color</div>
                <div className="mt-2 flex items-center gap-3 text-sm font-semibold text-white">
                  <span
                    className="h-4 w-4 rounded-full border border-white/10"
                    style={{ backgroundColor: form.primaryColor || '#6d7cff' }}
                  />
                  {form.primaryColor || '#6d7cff'}
                </div>
              </div>
            </div>
          </section>

          <section className="panel rounded-[1.8rem] p-6 md:p-7">
            <div className="flex items-center justify-between gap-3">
              <div className="text-2xl font-bold text-white">Members</div>
              <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-white/58">
                {members.length} total
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="rounded-[1.2rem] border border-white/8 bg-white/[0.03] px-4 py-3"
                >
                  <div className="text-sm font-semibold text-white">{member.user_id}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.18em] text-white/38">
                    {member.role}
                  </div>
                </div>
              ))}

              {!loading && members.length === 0 && (
                <div className="rounded-[1.2rem] border border-dashed border-white/10 bg-white/[0.02] px-4 py-8 text-sm text-white/46">
                  Brand members will show up here once you start inviting collaborators.
                </div>
              )}
            </div>

            <div className="mt-5 rounded-[1.3rem] border border-white/8 bg-white/[0.03] p-4 text-sm leading-7 text-white/58">
              Next step after this foundation: invite teammates by email, assign roles like owner/admin/editor, and let everyone work inside the same brand workspace.
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}
