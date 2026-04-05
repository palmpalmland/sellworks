'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function GeneratePage() {
  const [productName, setProductName] = useState('')
  const [prompt, setPrompt] = useState('')
  const [platform, setPlatform] = useState('Amazon')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const [remaining, setRemaining] = useState<number | null>(null)

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      setUserId(user?.id || null)
    }

    loadUser()
  }, [])

  useEffect(() => {
    async function loadUsage() {
      if (!userId) return

      const res = await fetch(`/api/usage?userId=${userId}`)
      const json = await res.json()

      if (res.ok && json.data) {
        const usage = json.data
        setRemaining(usage.credits_total - usage.credits_used)
      }
    }

    loadUsage()
  }, [userId])

  const handleGenerate = async () => {
    try {
      setLoading(true)
      setError('')
      setResult('')

      if (!productName.trim() || !prompt.trim() || !platform.trim()) {
        setError('Please fill in all required fields')
        return
      }

      const {
        data: { session },
      } = await supabase.auth.getSession()

      const accessToken = session?.access_token

      if (!accessToken) {
        throw new Error('Please log in first')
      }

      const res = await fetch('/api/generate-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          title: productName,
          description: prompt,
          platform,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong')
        return
      }

      setResult(data.data || 'No result')

      if (userId) {
        const usageRes = await fetch(`/api/usage?userId=${userId}`)
        const usageJson = await usageRes.json()

        if (usageRes.ok && usageJson.data) {
          const usage = usageJson.data
          setRemaining(usage.credits_total - usage.credits_used)
        }
      }
    } catch (err: unknown) {
      console.error('Frontend generate error:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="space-y-6 py-2">
      <section className="panel-strong rounded-[2.2rem] p-8 md:p-10">
        <div className="eyebrow">Generation studio</div>
        <h1 className="headline mt-6 text-4xl font-black text-white md:text-6xl">
          Generate launch-ready product copy
        </h1>
        <p className="mt-6 text-lg leading-8 text-white/62">
          This page belongs to the private workspace. Public visitors see the marketing site, not the tool.
        </p>

        <div className="mt-8 rounded-[1.6rem] border border-white/10 bg-white/5 px-5 py-4">
          <div className="text-xs uppercase tracking-[0.2em] text-white/36">Credit status</div>
          <div className="mt-2 headline text-3xl font-black text-white">
            {remaining !== null ? `${remaining} credits left` : 'Loading...'}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <section className="panel rounded-[2.2rem] p-8 md:p-10">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Product name"
              className="field"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />

            <textarea
              placeholder="Describe your product, audience, benefits, and selling points"
              className="field min-h-[180px]"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />

            <select
              className="field"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
            >
              <option value="Amazon">Amazon</option>
              <option value="TikTok">TikTok</option>
              <option value="Xiaohongshu">Xiaohongshu</option>
              <option value="Shopify">Shopify</option>
            </select>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="cta-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Generating...' : 'Generate Content'}
            </button>
          </div>

          {error && (
            <div className="mt-5 rounded-[1.4rem] border border-red-400/20 bg-red-400/10 px-4 py-4 text-sm text-red-100">
              {error}
            </div>
          )}
        </section>

        <section className="panel rounded-[2.2rem] p-8 md:p-10">
          <div className="text-xs uppercase tracking-[0.2em] text-white/36">Result</div>
          <div className="mt-4 min-h-[320px] whitespace-pre-wrap rounded-[1.8rem] border border-white/10 bg-black/18 p-5 text-sm leading-7 text-white/72">
            {result || 'Your generated content will appear here.'}
          </div>
        </section>
      </section>
    </main>
  )
}
