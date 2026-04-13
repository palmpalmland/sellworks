'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import {
  BRAND_CHANGED_EVENT,
  getBrandScopedCacheKey,
  getStoredActiveBrandId,
  getStoredBrand,
} from '@/lib/brand-session'
import type { BrandRecord } from '@/lib/project-types'

type AssetRow = {
  id: string
  projectId: string
  projectName: string
  platform: string
  kind: 'Copy' | 'Images' | 'Video'
  title: string
  preview: string
  createdAt: string
  thumbnail?: string
}

function AssetRowSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-[1.4rem] border border-white/8 bg-white/[0.02] px-5 py-4 md:flex-row md:items-start">
      <div className="h-16 w-16 shrink-0 animate-pulse rounded-[1rem] bg-white/8" />
      <div className="min-w-0 flex-1">
        <div className="flex gap-2">
          <div className="h-6 w-16 animate-pulse rounded-full bg-white/8" />
          <div className="h-6 w-20 animate-pulse rounded-full bg-white/8" />
        </div>
        <div className="mt-3 h-5 w-40 animate-pulse rounded bg-white/10" />
        <div className="mt-2 h-4 w-28 animate-pulse rounded bg-white/8" />
      </div>
      <div className="flex shrink-0 flex-col gap-3 md:items-end">
        <div className="h-4 w-20 animate-pulse rounded bg-white/8" />
        <div className="flex gap-2">
          <div className="h-9 w-24 animate-pulse rounded-[1rem] bg-white/8" />
          <div className="h-9 w-20 animate-pulse rounded-[1rem] bg-white/8" />
        </div>
      </div>
    </div>
  )
}

export default function AssetsPage() {
  const [brand, setBrand] = useState<BrandRecord | null>(null)
  const [rows, setRows] = useState<AssetRow[]>([])
  const [query, setQuery] = useState('')
  const [projectQuery, setProjectQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
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

    const cacheKey = getBrandScopedCacheKey('sellworks-assets-cache', activeBrandId)
    const cachedAssets = window.sessionStorage.getItem(cacheKey)

    if (cachedAssets) {
      try {
        setRows(JSON.parse(cachedAssets) as AssetRow[])
        setLoading(false)
      } catch {}
    } else {
      setLoading(true)
    }

    const loadAssets = async () => {
      try {
        setError('')

        const {
          data: { session },
        } = await supabase.auth.getSession()
        const user = session?.user ?? null

        if (!user) {
          setError('Please log in first')
          return
        }

        const brandQuery = activeBrandId ? `?brandId=${encodeURIComponent(activeBrandId)}` : ''

        const [brandJson, assetsJson] = await Promise.all([
          fetch(`/api/brand${brandQuery}`, {
            headers: {
              Authorization: `Bearer ${session?.access_token}`,
            },
          }).then((res) => (res.ok ? res.json() : null)),
          fetch(`/api/assets${brandQuery}`, {
            headers: {
              Authorization: `Bearer ${session?.access_token}`,
            },
          }).then((res) => res.json()),
        ])

        const currentBrand = brandJson?.data?.brand as BrandRecord | undefined
        if (currentBrand) {
          setBrand(currentBrand)
        }

        const nextRows = (assetsJson.data as AssetRow[]) || []
        setRows(nextRows)
        window.sessionStorage.setItem(cacheKey, JSON.stringify(nextRows))
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load assets')
      } finally {
        setLoading(false)
      }
    }

    loadAssets()
  }, [activeBrandId])

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchesType = typeFilter === 'All' || row.kind === typeFilter
      const assetHaystack = `${row.title} ${row.preview} ${row.platform}`.toLowerCase()
      const matchesQuery = !query.trim() || assetHaystack.includes(query.toLowerCase())
      const matchesProject =
        !projectQuery.trim() || row.projectName.toLowerCase().includes(projectQuery.toLowerCase())

      return matchesType && matchesQuery && matchesProject
    })
  }, [projectQuery, query, rows, typeFilter])

  return (
    <main className="space-y-5 py-1">
      <section className="panel rounded-[1.8rem] p-6 md:p-7">
        <div className="text-2xl font-bold text-white">Assets</div>
        <p className="mt-2 text-sm leading-7 text-white/58">
          Search everything already generated for {brand?.name || 'this brand'}: copy, images, and video outputs.
        </p>

        <div className="mt-6 grid gap-3 xl:grid-cols-[1fr_1fr_auto]">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by asset title, platform, or prompt"
            className="field"
          />
          <input
            value={projectQuery}
            onChange={(event) => setProjectQuery(event.target.value)}
            placeholder="Filter by project name"
            className="field"
          />
          <select className="field xl:w-[180px]" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
            <option value="All">All assets</option>
            <option value="Copy">Copy</option>
            <option value="Images">Images</option>
            <option value="Video">Video</option>
          </select>
        </div>
      </section>

      <section className="panel rounded-[1.8rem] p-6 md:p-7">
        <div className="mb-5 text-sm font-semibold text-white">
          {loading ? 'Loading assets...' : `${filteredRows.length} asset${filteredRows.length === 1 ? '' : 's'}`}
        </div>

        {error && (
          <div className="rounded-[1.4rem] border border-red-400/20 bg-red-400/10 px-4 py-4 text-sm text-red-100">
            {error}
          </div>
        )}

        <div className="space-y-3">
          {loading
            ? Array.from({ length: 5 }).map((_, index) => <AssetRowSkeleton key={index} />)
            : filteredRows.map((row) => (
                <article
                  key={row.id}
                  className="flex flex-col gap-4 rounded-[1.4rem] border border-white/8 bg-white/[0.02] px-5 py-3.5 transition hover:border-white/14 hover:bg-white/[0.04] md:flex-row md:items-center"
                >
                  <Link
                    href={`/projects/${row.projectId}`}
                    className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[1rem] border border-white/8 bg-black/20"
                  >
                    {row.thumbnail ? (
                      row.kind === 'Video' ? (
                        <video src={row.thumbnail} className="h-full w-full object-cover" muted />
                      ) : (
                        <img src={row.thumbnail} alt={row.title} className="h-full w-full object-cover" />
                      )
                    ) : (
                      <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">{row.kind}</div>
                    )}
                  </Link>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/58">
                        {row.kind}
                      </div>
                      <div className="rounded-full border border-cyan-300/18 bg-cyan-300/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-100">
                        {row.platform}
                      </div>
                    </div>
                    <div className="mt-3 text-base font-semibold text-white">{row.title}</div>
                    <div className="mt-1 text-sm text-white/46">{row.projectName}</div>
                  </div>

                  <div className="flex shrink-0 flex-col items-start gap-3 md:items-end">
                    <div className="text-[11px] uppercase tracking-[0.16em] text-white/35">
                      {new Date(row.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/projects/${row.projectId}`}
                        className="rounded-[1rem] border border-white/10 px-3 py-2 text-xs font-semibold text-white/72 transition hover:bg-white/[0.04] hover:text-white"
                      >
                        Open project
                      </Link>
                      {row.thumbnail ? (
                        <a
                          href={row.thumbnail}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-[1rem] border border-white/10 px-3 py-2 text-xs font-semibold text-white/72 transition hover:bg-white/[0.04] hover:text-white"
                        >
                          Open asset
                        </a>
                      ) : null}
                    </div>
                  </div>
                </article>
              ))}

          {!loading && !error && filteredRows.length === 0 && (
            <div className="rounded-[1.4rem] border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center text-white/50">
              No assets match this search yet.
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
