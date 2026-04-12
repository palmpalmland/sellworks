'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { BrandRecord, ProjectRecord } from '@/lib/project-types'

function ProjectCardSkeleton() {
  return (
    <div className="block rounded-[1.4rem] border border-white/8 bg-white/[0.02] px-5 py-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="h-6 w-48 animate-pulse rounded bg-white/10" />
          <div className="mt-3 h-4 w-full max-w-[420px] animate-pulse rounded bg-white/8" />
          <div className="mt-2 h-4 w-72 animate-pulse rounded bg-white/8" />
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <div className="h-7 w-24 animate-pulse rounded-full bg-white/8" />
          <div className="h-7 w-24 animate-pulse rounded-full bg-white/8" />
          <div className="h-4 w-20 animate-pulse rounded bg-white/8" />
        </div>
      </div>
    </div>
  )
}

export default function ProjectsPage() {
  const [brand, setBrand] = useState<BrandRecord | null>(null)
  const [brandReady, setBrandReady] = useState(true)
  const [projects, setProjects] = useState<ProjectRecord[]>([])
  const [query, setQuery] = useState('')
  const [platformFilter, setPlatformFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const cachedBrand = window.sessionStorage.getItem('sellworks-brand')
    if (cachedBrand) {
      try {
        setBrand(JSON.parse(cachedBrand) as BrandRecord)
      } catch {}
    }

    const cachedProjects = window.sessionStorage.getItem('sellworks-projects-cache')
    if (cachedProjects) {
      try {
        setProjects(JSON.parse(cachedProjects) as ProjectRecord[])
        setLoading(false)
      } catch {}
    }

    const loadProjects = async () => {
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

        const brandPromise = session?.access_token
          ? fetch('/api/brand', {
              headers: {
                Authorization: `Bearer ${session.access_token}`,
              },
            })
              .then((res) => (res.ok ? res.json() : null))
              .catch(() => null)
          : Promise.resolve(null)

        const [brandJson, projectsJson] = await Promise.all([
          brandPromise,
          fetch('/api/projects', {
            headers: {
              Authorization: `Bearer ${session?.access_token}`,
            },
          }).then((res) => res.json()),
        ])

        const currentBrand = brandJson?.data?.brand as BrandRecord | undefined
        setBrand(currentBrand || null)
        setBrandReady(Boolean(currentBrand))

        if (currentBrand) {
          window.sessionStorage.setItem('sellworks-brand', JSON.stringify(currentBrand))
        }

        const nextProjects = (projectsJson.data as ProjectRecord[]) || []
        setProjects(nextProjects)
        window.sessionStorage.setItem('sellworks-projects-cache', JSON.stringify(nextProjects))
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('Failed to load projects')
        }
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [])

  const platforms = useMemo(
    () => ['All', ...new Set(projects.map((project) => project.platform).filter(Boolean))],
    [projects]
  )

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesQuery =
        !query.trim() ||
        project.product_name.toLowerCase().includes(query.toLowerCase()) ||
        project.selling_points.toLowerCase().includes(query.toLowerCase())

      const matchesPlatform = platformFilter === 'All' || project.platform === platformFilter
      const matchesStatus = statusFilter === 'All' || project.status === statusFilter

      return matchesQuery && matchesPlatform && matchesStatus
    })
  }, [platformFilter, projects, query, statusFilter])

  return (
    <main className="space-y-5 py-1">
      <section className="panel rounded-[1.8rem] p-6 md:p-7">
        {!brandReady && (
          <div className="mb-5 rounded-[1.2rem] border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
            Brand workspace tables are not available yet, so this page is showing your existing personal projects.
          </div>
        )}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="text-3xl font-bold text-white">Projects</div>
            <p className="mt-2 text-sm leading-7 text-white/58">
              Search products, open any project, or start a brand new one for {brand?.name || 'this brand'}.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/generate" className="cta-primary text-sm">
              Add New Project
            </Link>
          </div>
        </div>

        <div className="mt-6 grid gap-3 xl:grid-cols-[1fr_auto_auto]">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by project name or product brief"
            className="field"
          />
          <select className="field xl:w-[180px]" value={platformFilter} onChange={(event) => setPlatformFilter(event.target.value)}>
            {platforms.map((platform) => (
              <option key={platform} value={platform}>
                {platform === 'All' ? 'All platforms' : platform}
              </option>
            ))}
          </select>
          <select className="field xl:w-[180px]" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="All">All status</option>
            <option value="draft">Draft</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </section>

      <section className="panel rounded-[1.8rem] p-6 md:p-7">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="text-sm font-semibold text-white">
            {loading ? 'Loading projects...' : `${filteredProjects.length} project${filteredProjects.length === 1 ? '' : 's'}`}
          </div>
        </div>

        {error && (
          <div className="rounded-[1.4rem] border border-red-400/20 bg-red-400/10 px-4 py-4 text-sm text-red-100">
            {error}
          </div>
        )}

        <div className="space-y-3">
          {loading
            ? Array.from({ length: 5 }).map((_, index) => <ProjectCardSkeleton key={index} />)
            : filteredProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="block rounded-[1.4rem] border border-white/8 bg-white/[0.02] px-5 py-5 transition hover:border-white/14 hover:bg-white/[0.04]"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                      <div className="text-lg font-semibold text-white">{project.product_name}</div>
                      <div className="mt-2 line-clamp-2 text-sm leading-7 text-white/58">{project.selling_points}</div>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-2">
                      <div className="rounded-full border border-cyan-300/18 bg-cyan-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-cyan-100">
                        {project.platform}
                      </div>
                      <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-white/60">
                        {project.status}
                      </div>
                      <div className="text-xs uppercase tracking-[0.16em] text-white/35">
                        {new Date(project.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}

          {!loading && !error && filteredProjects.length === 0 && (
            <div className="rounded-[1.4rem] border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center text-white/50">
              No projects match this filter yet.
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
