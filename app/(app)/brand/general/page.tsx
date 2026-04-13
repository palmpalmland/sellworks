'use client'

import { useEffect, useState } from 'react'
import { useBrandSettings } from '../_lib/use-brand-settings'

export default function BrandGeneralPage() {
  const { brand, loading, message, setMessage, updateBrand } = useBrandSettings()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '',
    description: '',
    website: '',
    voiceTone: '',
    targetAudience: '',
    primaryColor: '#6d7cff',
  })

  useEffect(() => {
    if (!brand) {
      return
    }

    setForm({
      name: brand.name,
      description: brand.description || '',
      website: brand.website || '',
      voiceTone: brand.voice_tone || '',
      targetAudience: brand.target_audience || '',
      primaryColor: brand.primary_color || '#6d7cff',
    })
  }, [brand])

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setMessage('')
      await updateBrand(form)
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : 'Failed to save brand')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      <section className="panel-strong rounded-[1.8rem] p-6 md:p-8">
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">
          Brand Settings
        </div>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">General</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-white/58">
          Define the shared brand identity that will influence future project positioning, prompts,
          and outputs across this workspace.
        </p>
      </section>

      <section className="panel rounded-[1.8rem] p-6 md:p-7">
        <div className="text-2xl font-bold text-white">Brand profile</div>
        <p className="mt-2 text-sm leading-7 text-white/54">
          Update the core context your team works from every day.
        </p>

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
            {message || 'These defaults will become the style source for your team and future projects.'}
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <div className="panel rounded-[1.6rem] p-5">
          <div className="text-xs uppercase tracking-[0.18em] text-white/36">Website</div>
          <div className="mt-2 text-sm font-semibold text-white">
            {brand?.website || form.website || 'Not set yet'}
          </div>
        </div>
        <div className="panel rounded-[1.6rem] p-5">
          <div className="text-xs uppercase tracking-[0.18em] text-white/36">Primary color</div>
          <div className="mt-2 flex items-center gap-3 text-sm font-semibold text-white">
            <span
              className="h-4 w-4 rounded-full border border-white/10"
              style={{ backgroundColor: form.primaryColor || '#6d7cff' }}
            />
            {form.primaryColor || '#6d7cff'}
          </div>
        </div>
      </section>
    </div>
  )
}
