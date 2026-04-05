'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Generation = {
  id: string
  product_name: string
  prompt: string
  platform: string
  result: string
  created_at: string
}

export default function HistoryPage() {
  const [items, setItems] = useState<Generation[]>([])
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
          .from('generations')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) {
          throw error
        }

        setItems(data || [])
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load history')
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

  return (
    <main className="section-space">
      <div className="page-shell">
        <section className="mb-8">
          <div className="eyebrow">Generation archive</div>
          <h1 className="headline mt-6 text-4xl font-black text-white md:text-6xl">
            Your output history
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/62">
            Review the prompts you tested, the platform each one targeted, and the
            generated result that came back from the engine.
          </p>
        </section>

        {loading && <div className="panel rounded-[1.8rem] p-6 text-white/62">Loading...</div>}
        {error && (
          <div className="mb-6 rounded-[1.5rem] border border-red-400/20 bg-red-400/10 px-5 py-4 text-sm text-red-100">
            {error}
          </div>
        )}

        <div className="space-y-5">
          {items.map((item) => (
            <article key={item.id} className="panel rounded-[2rem] p-6 md:p-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.22em] text-white/36">
                    {new Date(item.created_at).toLocaleString()}
                  </div>
                  <h2 className="headline mt-3 text-2xl font-black text-white">
                    {item.product_name}
                  </h2>
                </div>

                <div className="rounded-full border border-cyan-300/18 bg-cyan-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-100">
                  {item.platform}
                </div>
              </div>

              <div className="mt-6 grid gap-5 lg:grid-cols-2">
                <div className="rounded-[1.5rem] border border-white/8 bg-white/4 p-5">
                  <div className="text-xs uppercase tracking-[0.2em] text-white/36">Prompt</div>
                  <div className="mt-4 whitespace-pre-wrap text-sm leading-7 text-white/64">
                    {item.prompt}
                  </div>
                </div>
                <div className="rounded-[1.5rem] border border-white/8 bg-white/4 p-5">
                  <div className="text-xs uppercase tracking-[0.2em] text-white/36">Result</div>
                  <div className="mt-4 whitespace-pre-wrap text-sm leading-7 text-white/74">
                    {item.result}
                  </div>
                </div>
              </div>
            </article>
          ))}

          {!loading && !error && items.length === 0 && (
            <div className="panel rounded-[2rem] p-8 text-white/62">
              No generations yet.
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
