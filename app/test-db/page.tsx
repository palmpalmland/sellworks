'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestDbPage() {
  const [items, setItems] = useState<any[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase.from('test_items').select('*')

      if (error) {
        setError(error.message)
        return
      }

      setItems(data || [])
    }

    fetchItems()
  }, [])

  return (
    <main className="min-h-screen p-10">
      <h1 className="text-3xl font-bold mb-4">Test DB</h1>

      {error && <p className="text-red-600 mb-4">Error: {error}</p>}

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="border rounded-lg p-3">
            {item.id} - {item.name}
          </div>
        ))}
      </div>
    </main>
  )
}