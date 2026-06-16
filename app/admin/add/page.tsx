'use client'

import { useState, useEffect } from 'react'

type CampaignData = {
  line_url: string
  source_url: string
  title: string
  company: string
  winners_count: string
  deadline: string
  category: string
  description: string
}

const CATEGORIES = [
  '食品・飲料',
  'ギフトカード',
  '家電・生活家電',
  'チケット・旅行',
  '日用品・コスメ',
  'その他',
]

export default function AdminAddPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [campaign, setCampaign] = useState<CampaignData | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [adding, setAdding] = useState(false)

  // セッションストレージからパスワードを復元
  useEffect(() => {
    const saved = sessionStorage.getItem('admin_pw')
    if (saved) {
      setPassword(saved)
      setAuthed(true)
    }
  }, [])

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault()
    // パスワードはAPIで検証するためここでは仮認証
    sessionStorage.setItem('admin_pw', password)
    setAuthed(true)
  }

  async function handleFetch(e: React.FormEvent) {
    e.preventDefault()
    if (!url.trim()) return
    setLoading(true)
    setError('')
    setCampaign(null)
    setSuccess(false)

    try {
      const res = await fetch('/api/admin/fetch-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim(), password }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (res.status === 401) {
          setAuthed(false)
          sessionStorage.removeItem('admin_pw')
        }
        setError(data.error || 'エラーが発生しました')
        return
      }
      setCampaign(data)
    } catch {
      setError('通信エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!campaign) return
    setAdding(true)
    setError('')

    try {
      const res = await fetch('/api/admin/add-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...campaign, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'エラーが発生しました')
        return
      }
      setSuccess(true)
      setCampaign(null)
      setUrl('')
    } catch {
      setError('通信エラーが発生しました')
    } finally {
      setAdding(false)
    }
  }

  // パスワード入力画面
  if (!authed) {
    return (
      <main className="min-h-screen bg-orange-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <span className="text-4xl">🔐</span>
            <h1 className="text-xl font-black text-gray-800 mt-2">管理者ログイン</h1>
          </div>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="パスワードを入力"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-orange-400"
              autoFocus
            />
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition text-base"
            >
              ログイン
            </button>
          </form>
        </div>
      </main>
    )
  }

  // メイン画面
  return (
    <main className="min-h-screen bg-orange-50 pb-20">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 px-4 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎁</span>
          <span className="text-white font-black text-lg">懸賞を追加</span>
        </div>
        <a href="/admin" className="text-white/80 text-sm">管理画面 →</a>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-5">

        {/* 成功メッセージ */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
            <div className="text-3xl mb-2">✅</div>
            <p className="text-green-700 font-bold">追加しました！</p>
            <button
              onClick={() => setSuccess(false)}
              className="mt-3 text-sm text-green-600 underline"
            >
              続けて追加する
            </button>
          </div>
        )}

        {/* URL入力フォーム */}
        {!success && (
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h2 className="font-bold text-gray-800 mb-3">① キャンペーンのURLを貼り付け</h2>
            <form onSubmit={handleFetch} className="space-y-3">
              <textarea
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 resize-none h-20"
              />
              <button
                type="submit"
                disabled={loading || !url.trim()}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-bold py-3 rounded-xl transition text-base"
              >
                {loading ? '取得中...' : '情報を自動取得 →'}
              </button>
            </form>
          </div>
        )}

        {/* エラー */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* 読み込み中 */}
        {loading && (
          <div className="text-center py-8 text-gray-500">
            <div className="text-3xl mb-2 animate-bounce">🔍</div>
            <p className="text-sm">ページを解析中...</p>
          </div>
        )}

        {/* 取得結果フォーム */}
        {campaign && !success && (
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h2 className="font-bold text-gray-800 mb-4">② 内容を確認・修正して追加</h2>

              <div className="space-y-4">
                {/* タイトル */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">タイトル <span className="text-red-500">*</span></label>
                  <input
                    value={campaign.title}
                    onChange={e => setCampaign({ ...campaign, title: e.target.value })}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400"
                    placeholder="例: アサヒビール マルエフ 500名プレゼント"
                  />
                </div>

                {/* LINE URL */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">LINE URL <span className="text-red-500">*</span></label>
                  <input
                    value={campaign.line_url}
                    onChange={e => setCampaign({ ...campaign, line_url: e.target.value })}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400"
                    placeholder="https://lin.ee/..."
                  />
                  {campaign.line_url && (
                    <a
                      href={campaign.line_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-500 mt-1 inline-block"
                    >
                      ↗ リンクを確認
                    </a>
                  )}
                </div>

                {/* 企業名 */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">企業名</label>
                  <input
                    value={campaign.company}
                    onChange={e => setCampaign({ ...campaign, company: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400"
                    placeholder="例: アサヒビール"
                  />
                </div>

                {/* 当選者数・締切 */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">当選者数（名）</label>
                    <input
                      type="number"
                      value={campaign.winners_count}
                      onChange={e => setCampaign({ ...campaign, winners_count: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400"
                      placeholder="500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">締切日</label>
                    <input
                      type="date"
                      value={campaign.deadline}
                      onChange={e => setCampaign({ ...campaign, deadline: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400"
                    />
                  </div>
                </div>

                {/* カテゴリ */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">カテゴリ</label>
                  <select
                    value={campaign.category}
                    onChange={e => setCampaign({ ...campaign, category: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 bg-white"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* 説明文 */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">説明文</label>
                  <textarea
                    value={campaign.description}
                    onChange={e => setCampaign({ ...campaign, description: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 resize-none h-20"
                    placeholder="キャンペーンの説明文"
                  />
                </div>
              </div>
            </div>

            {/* 追加ボタン */}
            <button
              type="submit"
              disabled={adding || !campaign.title || !campaign.line_url}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white font-black py-4 rounded-2xl transition text-lg shadow-md"
            >
              {adding ? '追加中...' : '✅ サイトに追加する'}
            </button>

            <button
              type="button"
              onClick={() => { setCampaign(null); setUrl('') }}
              className="w-full text-gray-400 text-sm py-2"
            >
              キャンセル
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
