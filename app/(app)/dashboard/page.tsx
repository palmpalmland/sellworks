'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { BrandRecord, ProjectRecord } from '@/lib/project-types'

type UsageData = {
  plan?: string
  credits_total: number
  credits_used: number
  credits_remaining: number
}

function MetricSkeleton() {
  return <div className="mt-3 h-10 w-20 animate-pulse rounded bg-white/18" />
}

function ProjectRowSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-[1.4rem] border border-white/8 bg-white/[0.02] px-5 py-4 md:flex-row md:items-center md:justify-between">
      <div>
        <div className="h-5 w-44 animate-pulse rounded bg-white/10" />
        <div className="mt-2 h-4 w-32 animate-pulse rounded bg-white/8" />
      </div>
      <div className="flex items-center gap-3">
        <div className="h-7 w-20 animate-pulse rounded-full bg-white/8" />
        <div className="h-4 w-10 animate-pulse rounded bg-white/8" />
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [brand, setBrand] = useState<BrandRecord | null>(null)
  const [brandReady, setBrandReady] = useState(true)
  const [usage, setUsage] = useState<UsageData | null>(null)
  const [projects, setProjects] = useState<ProjectRecord[]>([])
  const [quickUrl, setQuickUrl] = useState('')
  const [loading, setLoading] = useState(true)

  const displayName = user?.user_metadata?.display_name?.toString().trim() || null
  const initialsSource = displayName || user?.email || 'Sellworks'
  const initials = initialsSource.slice(0, 2).toUpperCase()

  useEffect(() => {
    const cachedBrand = window.sessionStorage.getItem('sellworks-brand')
    if (cachedBrand) {
      try {
        setBrand(JSON.parse(cachedBrand) as BrandRecord)
      } catch {}
    }

    const cachedDashboard = window.sessionStorage.getItem('sellworks-dashboard-cache')
    if (cachedDashboard) {
      try {
        const parsed = JSON.parse(cachedDashboard) as {
          usage: UsageData | null
          projects: ProjectRecord[]
        }
        setUsage(parsed.usage)
        setProjects(parsed.projects || [])
        setLoading(false)
      } catch {}
    }

    const loadDashboard = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        const currentUser = session?.user ?? null
        setUser(currentUser)

        if (!currentUser) return

        const brandPromise = session?.access_token
          ? fetch('/api/brand', {
              headers: {
                Authorization: `Bearer ${session.access_token}`,
              },
            })
              .then((res) => (res.ok ? res.json() : null))
              .catch(() => null)
          : Promise.resolve(null)

        const [brandJson, usageJson, projectsJson] = await Promise.all([
          brandPromise,
          fetch(`/api/usage?userId=${currentUser.id}`).then((res) => res.json()),
          fetch('/api/projects?limit=6', {
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

        if (usageJson?.data) {
          setUsage(usageJson.data)
        }

        const nextProjects = (projectsJson?.data as ProjectRecord[]) || []
        const nextUsage = (usageJson?.data as UsageData | undefined) || null

        setProjects(nextProjects)
        setUsage(nextUsage)
        window.sessionStorage.setItem(
          'sellworks-dashboard-cache',
          JSON.stringify({
            usage: nextUsage,
            projects: nextProjects,
          })
        )
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  const handleQuickCreate = () => {
    const params = new URLSearchParams()
    if (quickUrl.trim()) {
      params.set('productUrl', quickUrl.trim())
    }

    router.push(params.toString() ? `/generate?${params.toString()}` : '/generate')
  }

  return (
    <main className="space-y-5 py-1">
      <section className="overflow-hidden rounded-[1.8rem] bg-[#0a88b8] text-white">
        <div className="flex flex-col gap-7 px-6 py-7 md:px-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/70">
              {brand?.name || 'Workspace Home'}
            </div>
            <h1 className="mt-4 text-3xl font-light uppercase tracking-tight md:text-4xl">
              Welcome back
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-white/88">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/85 text-sm font-bold text-[#0a88b8]">
                {initials}
              </div>
              <div className="text-base font-medium">{displayName || user?.email || 'Sellworks operator'}</div>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-white/70">Recent Projects</div>
              {loading ? <MetricSkeleton /> : <div className="mt-3 text-4xl font-light">{projects.length}</div>}
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-white/70">Active Plan</div>
              {loading ? <MetricSkeleton /> : <div className="mt-3 text-4xl font-light">{usage?.plan || 'Free'}</div>}
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-white/70">Credits Left</div>
              {loading ? (
                <MetricSkeleton />
              ) : (
                <div className="mt-3 text-4xl font-light">{usage?.credits_remaining ?? 0}</div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="panel rounded-[1.8rem] p-6 md:p-7">
        {!brandReady && (
          <div className="mb-5 rounded-[1.2rem] border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
            Brand workspace is not ready yet in this environment, so dashboard is temporarily using your personal projects view.
          </div>
        )}
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-xl font-bold text-white">Quick create</div>
            <p className="mt-2 text-sm leading-7 text-white/58">
              Paste a product URL to jump straight into a new project, or start from a blank brief if you want more control.
            </p>
          </div>
          <Link href="/projects" className="hidden rounded-[1.1rem] border border-white/10 px-4 py-3 text-sm font-semibold text-white/72 transition hover:bg-white/[0.04] hover:text-white md:inline-flex">
            View all projects
          </Link>
        </div>

        <div className="mt-6 flex flex-col gap-4 lg:flex-row">
          <input
            type="url"
            value={quickUrl}
            onChange={(event) => setQuickUrl(event.target.value)}
            placeholder="Paste Amazon, Shopify, Etsy, or TikTok product URL"
            className="field flex-1"
          />
          <button onClick={handleQuickCreate} className="cta-primary whitespace-nowrap px-6 text-sm">
            Quick Create
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/generate" className="cta-secondary text-sm">
            Create Blank Project
          </Link>
          <Link href="/projects" className="cta-secondary text-sm">
            Search Projects
          </Link>
          <Link href="/billing" className="cta-secondary text-sm">
            Account
          </Link>
        </div>
      </section>

      <section className="panel rounded-[1.8rem] p-6 md:p-7">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-xl font-bold text-white">Recent projects</div>
            <p className="mt-2 text-sm leading-7 text-white/58">
              Pick up where you left off, or jump into an older product to generate more assets.
            </p>
          </div>
          <Link href="/projects" className="rounded-[1.1rem] border border-white/10 px-4 py-3 text-sm font-semibold text-white/72 transition hover:bg-white/[0.04] hover:text-white">
            See all
          </Link>
        </div>

        <div className="mt-6 space-y-3">
          {loading
            ? Array.from({ length: 4 }).map((_, index) => <ProjectRowSkeleton key={index} />)
            : projects.slice(0, 5).map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="flex flex-col gap-3 rounded-[1.4rem] border border-white/8 bg-white/[0.02] px-5 py-4 transition hover:border-white/14 hover:bg-white/[0.04] md:flex-row md:items-center md:justify-between"
                >
                  <div className="min-w-0">
                    <div className="text-base font-semibold text-white">{project.product_name}</div>
                    <div className="mt-1 text-sm text-white/50">
                      {project.platform} · {new Date(project.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/60">
                      {project.status}
                    </div>
                    <span className="text-sm font-semibold text-white/70">Open</span>
                  </div>
                </Link>
              ))}

          {!loading && projects.length === 0 && (
            <div className="rounded-[1.4rem] border border-dashed border-white/10 bg-white/[0.02] px-6 py-12 text-center text-white/50">
              No projects yet. Start with Quick Create above.
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
