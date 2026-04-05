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
      } catch (err: any) {
        setError(err.message || 'Failed to load history')
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

  return (
    <main className="min-h-screen p-10">
      <h1 className="text-3xl font-bold mb-6">History</h1>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}

      <div className="space-y-4 max-w-4xl">
        {items.map((item) => (
          <div key={item.id} className="border rounded-xl p-4">
            <div className="text-sm opacity-70 mb-2">
              {new Date(item.created_at).toLocaleString()}
            </div>
            <h2 className="text-xl font-semibold mb-2">{item.product_name}</h2>
            <div className="mb-2"><strong>Platform:</strong> {item.platform}</div>
            <div className="mb-2 whitespace-pre-wrap"><strong>Prompt:</strong> {item.prompt}</div>
            <div className="whitespace-pre-wrap"><strong>Result:</strong> {item.result}</div>
          </div>
        ))}
      </div>
    </main>
  )
}