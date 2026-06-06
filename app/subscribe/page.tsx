'use client'

import { useState } from 'react'

export default function SubscribePage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    const data = await res.json()

    if (res.ok) {
      setStatus('success')
      setMessage('登録が完了しました！確認メールをお送りしました📬')
      setEmail('')
    } else {
      setStatus('error')
      setMessage(data.error || '登録に失敗しました')
    }
  }

  return (
    <main className="min-h-screen bg-orange-50">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 py-12 px-4 text-center">
        <div className="text-4xl mb-3">🎁</div>
        <h1 className="text-3xl font-black text-white">新着懸賞を通知で受け取る</h1>
        <p className="text-orange-100 mt-2">メールアドレスを登録するだけ！無料です</p>
      </div>

      <div className="max-w-lg mx-auto px-6 py-12">
        {/* メリット */}
        <div className="grid grid-cols-1 gap-4 mb-10">
          {[
            { icon: '⚡', title: 'いち早く通知', desc: '新着懸賞が追加されたらすぐにメールでお知らせ' },
            { icon: '🏆', title: '大型キャンペーンも見逃さない', desc: '当選者数が多い懸賞ほど早めの応募が有利！' },
            { icon: '🆓', title: '完全無料', desc: '登録料・月額料金など一切かかりません' },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-xl p-4 flex gap-4 shadow-sm border border-orange-100">
              <span className="text-3xl">{item.icon}</span>
              <div>
                <p className="font-bold text-gray-800">{item.title}</p>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 登録フォーム */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-orange-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">メールアドレスを登録</h2>

          {status === 'success' ? (
            <div className="text-center py-6">
              <div className="text-5xl mb-4">✅</div>
              <p className="text-green-600 font-bold text-lg">{message}</p>
              <a href="/" className="mt-6 inline-block text-orange-500 underline text-sm">
                懸賞一覧に戻る
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-800"
              />

              {status === 'error' && (
                <p className="text-red-500 text-sm">{message}</p>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-400 text-white font-bold py-3 rounded-xl hover:opacity-90 transition disabled:opacity-60"
              >
                {status === 'loading' ? '登録中...' : '無料で通知を受け取る 🎁'}
              </button>

              <p className="text-xs text-gray-400 text-center">
                いつでも配信停止できます。スパムメールは送りません。
              </p>
            </form>
          )}
        </div>
      </div>

      {/* フッター */}
      <footer className="bg-gray-800 text-gray-400 mt-8">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <a href="/" className="text-white font-bold flex items-center gap-2">
            <span>🎁</span> LINE懸賞まとめ
          </a>
          <p className="text-xs text-gray-600">© 2026 LINE懸賞まとめ</p>
        </div>
      </footer>
    </main>
  )
}
