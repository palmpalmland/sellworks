'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { ProjectRecord } from '@/lib/project-types'

export default function HistoryPage() {
  const [items, setItems] = useState<ProjectRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true)
        setError('')

        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          setError('Please log in first')
          setItems([])
          return
        }

        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        setItems((data as ProjectRecord[]) || [])
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load project history')
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

  return (
    <main className="space-y-6 py-2">
      <section className="panel-strong rounded-[2.2rem] p-8 md:p-10">
        <div className="eyebrow">Project archive</div>
        <h1 className="headline mt-6 text-4xl font-black text-white md:text-6xl">
          Your project history
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-white/62">
          Every project becomes a reusable record. Open any one to see copy, image state, video state,
          and the original project input.
        </p>
      </section>

      {loading && <div className="panel rounded-[1.8rem] p-6 text-white/62">Loading...</div>}
      {error && (
        <div className="rounded-[1.5rem] border border-red-400/20 bg-red-400/10 px-5 py-4 text-sm text-red-100">
          {error}
        </div>
      )}

      <div className="space-y-5">
        {items.map((item) => (
          <Link key={item.id} href={`/projects/${item.id}`} className="block">
            <article className="panel rounded-[2rem] p-6 transition hover:border-white/16 md:p-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.22em] text-white/36">
                    {new Date(item.created_at).toLocaleString()}
                  </div>
                  <h2 className="headline mt-3 text-2xl font-black text-white">
                    {item.product_name}
                  </h2>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-white/58">
                    {item.selling_points}
                  </p>
                </div>

                <div className="flex flex-col gap-3 md:items-end">
                  <div className="rounded-full border border-cyan-300/18 bg-cyan-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-100">
                    {item.platform}
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white/60">
                    {item.status}
                  </div>
                </div>
              </div>
            </article>
          </Link>
        ))}

        {!loading && !error && items.length === 0 && (
          <div className="panel rounded-[2rem] p-8 text-white/62">
            No projects yet.
          </div>
        )}
      </div>
    </main>
  )
}
