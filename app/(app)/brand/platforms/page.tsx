'use client'

import { useEffect, useState } from 'react'
import { useBrandSettings } from '../_lib/use-brand-settings'

const platformOptions = ['Amazon', 'Shopify', 'Etsy', 'TikTok']

export default function BrandPlatformsPage() {
  const { brand, loading, message, setMessage, updateBrand } = useBrandSettings()
  const [saving, setSaving] = useState(false)
  const [enabledPlatforms, setEnabledPlatforms] = useState<string[]>([])

  useEffect(() => {
    if (!brand) {
      return
    }

    setEnabledPlatforms(brand.enabled_platforms || [])
  }, [brand])

  const persistPlatforms = async (nextEnabledPlatforms: string[]) => {
    if (!brand) {
      return
    }

    try {
      setSaving(true)
      setMessage('')
      await updateBrand({
        name: brand.name,
        description: brand.description || '',
        website: brand.website || '',
        voiceTone: brand.voice_tone || '',
        targetAudience: brand.target_audience || '',
        primaryColor: brand.primary_color || '#6d7cff',
        enabledPlatforms: nextEnabledPlatforms,
      })
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : 'Failed to save platforms')
    } finally {
      setSaving(false)
    }
  }

  const togglePlatform = async (platform: string) => {
    const nextEnabledPlatforms = enabledPlatforms.includes(platform)
      ? enabledPlatforms.filter((item) => item !== platform)
      : [...enabledPlatforms, platform]

    setEnabledPlatforms(nextEnabledPlatforms)
    await persistPlatforms(nextEnabledPlatforms)
  }

  return (
    <div className="space-y-5">
      <section className="panel-strong rounded-[1.8rem] p-6 md:p-8">
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">
          Brand Settings
        </div>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
          Platforms
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-white/58">
          Decide which ecommerce channels this brand actively uses. Projects will only show enabled
          platforms in their output workspace.
        </p>
      </section>

      <section className="panel rounded-[1.8rem] p-6 md:p-7">
        <div className="text-2xl font-bold text-white">Enabled platforms</div>
        <p className="mt-2 text-sm leading-7 text-white/54">
          Turn platforms on only when this brand actually sells there. This keeps project outputs
          cleaner and more focused.
        </p>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {platformOptions.map((platform) => {
            const active = enabledPlatforms.includes(platform)

            return (
              <button
                key={platform}
                type="button"
                onClick={() => void togglePlatform(platform)}
                disabled={saving}
                className={
                  active
                    ? 'theme-subtle flex items-center justify-between rounded-[1.2rem] border px-4 py-4 text-left transition'
                    : 'flex items-center justify-between rounded-[1.2rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-left transition hover:bg-white/[0.05]'
                }
              >
                <div>
                  <div className={active ? 'text-sm font-semibold theme-text' : 'text-sm font-semibold text-white/72'}>
                    {platform}
                  </div>
                  <div
                    className={
                      active
                        ? 'mt-1 text-xs uppercase tracking-[0.16em] text-emerald-300'
                        : 'mt-1 text-xs uppercase tracking-[0.16em] text-white/35'
                    }
                  >
                    {active ? 'Enabled' : 'Disabled'}
                  </div>
                </div>

                <div
                  className={
                    active
                      ? 'flex h-9 w-9 items-center justify-center rounded-full bg-emerald-400/18 text-sm font-bold text-emerald-300'
                      : 'flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-sm font-bold text-white/35'
                  }
                >
                  {active ? '✓' : '—'}
                </div>
              </button>
            )
          })}
        </div>

        <div className="mt-5 text-sm text-white/54">
          {saving
            ? 'Saving platform settings...'
            : message || 'Platform changes save automatically and control which output sections appear in projects.'}
        </div>
      </section>
    </div>
  )
}
