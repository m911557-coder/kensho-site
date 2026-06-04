'use client'

import { useEffect, useState } from 'react'
import { supabase, Kensho } from '@/lib/supabase'

export default function AdminPage() {
  const [list, setList] = useState<Kensho[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchList() {
    const { data } = await supabase
      .from('kensho')
      .select('*')
      .order('created_at', { ascending: false })
    setList(data ?? [])
    setLoading(false)
  }

  async function approve(id: number) {
    await supabase.from('kensho').update({ approved: true }).eq('id', id)
    fetchList()
  }

  async function reject(id: number) {
    await supabase.from('kensho').delete().eq('id', id)
    fetchList()
  }

  useEffect(() => {
    fetchList()
  }, [])

  if (loading) return <p className="p-8">読み込み中...</p>

  const pending = list.filter((item) => !item.approved)
  const approved = list.filter((item) => item.approved)

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">管理画面</h1>

      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4 text-orange-500">
          承認待ち（{pending.length}件）
        </h2>
        {pending.length === 0 ? (
          <p className="text-gray-400">承認待ちの懸賞はありません</p>
        ) : (
          <div className="grid gap-4">
            {pending.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow p-4">
                <p className="font-bold text-gray-800">{item.title}</p>
                {item.company && <p className="text-sm text-gray-500">{item.company}</p>}
                {item.description && <p className="text-sm text-gray-600 mt-1">{item.description}</p>}
                <p className="text-xs text-blue-500 mt-1 break-all">{item.line_url}</p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => approve(item.id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-lg text-sm"
                  >
                    ✓ 承認して公開
                  </button>
                  <button
                    onClick={() => reject(item.id)}
                    className="bg-red-400 hover:bg-red-500 text-white px-4 py-1 rounded-lg text-sm"
                  >
                    ✗ 削除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4 text-green-500">
          公開中（{approved.length}件）
        </h2>
        <div className="grid gap-4">
          {approved.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow p-4 flex justify-between items-center">
              <div>
                <p className="font-bold text-gray-800">{item.title}</p>
                {item.company && <p className="text-sm text-gray-500">{item.company}</p>}
              </div>
              <button
                onClick={() => reject(item.id)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded-lg text-sm"
              >
                削除
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
