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
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      console.log('current user:', user)
      setUserId(user?.id || null)
    }

    loadUser()
  }, [])

  useEffect(() => {
    async function fetchUsage() {
      if (!userId) return;

      const res = await fetch(`/api/usage?userId=${userId}`);
      const json = await res.json();

      if (res.ok && json.data) {
        const usage = json.data;
        setRemaining(usage.credits_total - usage.credits_used);
      }
    }

    fetchUsage();
  }, [userId]);

  async function fetchUsage(currentUserId: string) {
    const res = await fetch(`/api/usage?userId=${currentUserId}`);
    const json = await res.json();

    const usage = json.data;
    setRemaining(usage.credits_total - usage.credits_used);
  }

  const handleGenerate = async () => {
    try {
      setLoading(true)
      setError('')
      setResult('')

      console.log('Submitting request:', {
        title: productName,
        description: prompt,
        platform,
      })

      if (!productName.trim() || !prompt.trim() || !platform.trim()) {
        setError('Please fill in all required fields')
        return
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      const accessToken = session?.access_token;

      if (!accessToken) {
        throw new Error("Please log in first");
      }

      const res = await fetch('/api/generate-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`, // ⭐关键
        },
        body: JSON.stringify({
          title: productName,
          description: prompt,
          platform,
          // ❌ 不再传 userId
        }),
      })

      console.log('Response status:', res.status)

      const data = await res.json()
      console.log('Response data:', data)

      if (!res.ok) {
        setError(data.error || 'Something went wrong')
        return
      }

      setResult(data.data || 'No result')
      if (userId) {
        const usageRes = await fetch(`/api/usage?userId=${userId}`);
        const usageJson = await usageRes.json();

        if (usageRes.ok && usageJson.data) {
          const usage = usageJson.data;
          setRemaining(usage.credits_total - usage.credits_used);
        }
      }
      
    } catch (err: any) {
      console.error('Frontend generate error:', err)
      setError(err.message || 'Failed to generate')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen p-10">
      <h1 className="text-3xl font-bold mb-6">Generate Content</h1>
      
      {remaining !== null && (
        <p>You have {remaining} credits left</p>
      )}

      <div className="max-w-2xl space-y-4">
        <input
          type="text"
          placeholder="Product name"
          className="w-full border rounded-lg px-3 py-2"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />

        <textarea
          placeholder="Describe your product and selling points"
          className="w-full border rounded-lg px-3 py-2 min-h-[140px]"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <select
          className="w-full border rounded-lg px-3 py-2"
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
          className="rounded-lg bg-black text-white px-4 py-2 disabled:opacity-60"
        >
          {loading ? 'Generating...' : 'Generate'}
        </button>

        {error && (
          <div className="text-red-500 mt-2">
            {error}
          </div>
        )}

        {result && (
          <div className="border rounded-xl p-4 mt-6 whitespace-pre-wrap">
            <h2 className="font-semibold mb-2">Result</h2>
            <p>{result}</p>
          </div>
        )}
      </div>
    </main>
  )
}