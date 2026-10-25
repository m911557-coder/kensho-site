'use client'

import { useEffect, useState } from 'react'
import type { Kensho } from '@/lib/supabase'

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [list, setList] = useState<Kensho[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function callApi(pw: string, body: { action: string; id?: number }) {
    const res = await fetch('/api/admin/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...body, password: pw }),
    })
    const data = await res.json()
    if (res.status === 401) {
      sessionStorage.removeItem('admin_pw')
      setAuthed(false)
    }
    if (!res.ok) throw new Error(data.error || 'エラーが発生しました')
    return data
  }

  async function fetchList(pw: string) {
    setLoading(true)
    setError('')
    try {
      const data = await callApi(pw, { action: 'list' })
      setList(data.items ?? [])
      setPassword(pw)
      setAuthed(true)
      sessionStorage.setItem('admin_pw', pw)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  async function act(action: 'approve' | 'delete', id: number) {
    try {
      await callApi(password, { action, id })
      fetchList(password)
    } catch (e) {
      setError((e as Error).message)
    }
  }

  useEffect(() => {
    const saved = sessionStorage.getItem('admin_pw')
    if (saved) fetchList(saved)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!authed) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            fetchList(password)
          }}
          className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-sm space-y-4"
        >
          <h1 className="text-xl font-bold text-gray-800 text-center">🔐 管理者ログイン</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="パスワードを入力"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-orange-400"
            autoFocus
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition text-base disabled:opacity-50"
          >
            {loading ? '確認中...' : 'ログイン'}
          </button>
        </form>
      </main>
    )
  }

  if (loading && list.length === 0) return <p className="p-8">読み込み中...</p>

  const pending = list.filter((item) => !item.approved)
  const approved = list.filter((item) => item.approved)

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">管理画面</h1>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

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
                    onClick={() => act('approve', item.id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-lg text-sm"
                  >
                    ✓ 承認して公開
                  </button>
                  <button
                    onClick={() => { if (confirm('削除しますか？')) act('delete', item.id) }}
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
                onClick={() => { if (confirm('削除しますか？')) act('delete', item.id) }}
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
