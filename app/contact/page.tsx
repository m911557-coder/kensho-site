'use client'

import { useState } from 'react'

const CATEGORIES = [
  { value: '感想・ご意見', label: '😊 感想・ご意見', showRating: true },
  { value: '掲載情報の誤り', label: '⚠️ 掲載情報の誤り', showRating: false },
  { value: '削除依頼', label: '🗑️ 削除依頼', showRating: false },
  { value: 'キャンペーン情報の提供', label: '🎁 キャンペーン情報の提供', showRating: false },
  { value: 'その他', label: '💬 その他', showRating: false },
]

export default function ContactPage() {
  const [category, setCategory] = useState('')
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const selectedCategory = CATEGORIES.find(c => c.value === category)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!category) { setError('種別を選択してください'); return }
    if (!message.trim()) { setError('メッセージを入力してください'); return }

    setSending(true)
    setError('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, category, rating: rating || null, message }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'エラーが発生しました'); return }
      setSuccess(true)
    } catch {
      setError('通信エラーが発生しました')
    } finally {
      setSending(false)
    }
  }

  return (
    <main className="min-h-screen bg-orange-50">
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 py-10 px-4 text-center">
        <h1 className="text-3xl font-black text-white">お問い合わせ・ご意見</h1>
        <p className="text-orange-100 mt-2 text-sm">Contact & Feedback</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">

        {/* 送信完了 */}
        {success ? (
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-xl font-black text-gray-800 mb-2">送信しました！</h2>
            <p className="text-gray-500 text-sm mb-6">お問い合わせいただきありがとうございます。</p>
            <button
              onClick={() => { setSuccess(false); setCategory(''); setRating(0); setName(''); setEmail(''); setMessage('') }}
              className="text-orange-500 text-sm underline"
            >
              続けて送る
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* 種別選択 */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="font-bold text-gray-800 mb-4">① 種別を選んでください</h2>
              <div className="grid grid-cols-1 gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => { setCategory(cat.value); setRating(0) }}
                    className={`text-left px-4 py-3 rounded-xl border text-sm transition ${
                      category === cat.value
                        ? 'bg-orange-500 text-white border-orange-500 font-bold'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 評価（感想・意見の場合のみ） */}
            {selectedCategory?.showRating && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="font-bold text-gray-800 mb-4">② サイトの評価（任意）</h2>
                <div className="flex gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="text-4xl transition-transform hover:scale-110"
                    >
                      {star <= (hoverRating || rating) ? '⭐' : '☆'}
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-center text-sm text-gray-500 mt-2">
                    {['', 'もう少し頑張ります😢', '改善していきます🙏', 'ありがとうございます😊', 'とても嬉しいです😄', '最高の評価ありがとうございます🎉'][rating]}
                  </p>
                )}
              </div>
            )}

            {/* 名前・メール */}
            {category && (
              <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
                <h2 className="font-bold text-gray-800 mb-2">
                  {selectedCategory?.showRating ? '③' : '②'} お名前・メールアドレス（任意）
                </h2>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="お名前（匿名でもOK）"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400"
                />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="メールアドレス（返信が必要な場合）"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400"
                />
              </div>
            )}

            {/* メッセージ */}
            {category && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="font-bold text-gray-800 mb-3">
                  {selectedCategory?.showRating ? '④' : '③'} メッセージ <span className="text-red-500">*</span>
                </h2>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  required
                  rows={5}
                  placeholder={
                    category === '感想・ご意見' ? 'サイトへのご感想・改善のご提案などお気軽にどうぞ！' :
                    category === '掲載情報の誤り' ? 'どのキャンペーン情報が誤っているか教えてください' :
                    category === 'キャンペーン情報の提供' ? 'キャンペーン名・URL・賞品・締切日などを教えてください' :
                    'お問い合わせ内容をご記入ください'
                  }
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 resize-none"
                />
              </div>
            )}

            {/* エラー */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm">
                ⚠️ {error}
              </div>
            )}

            {/* 送信ボタン */}
            {category && (
              <button
                type="submit"
                disabled={sending || !message.trim()}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-black py-4 rounded-2xl transition text-lg shadow-md"
              >
                {sending ? '送信中...' : '📨 送信する'}
              </button>
            )}
          </form>
        )}

        {/* SNSでも受付中 */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-bold text-gray-700 text-sm mb-4">SNSでもお気軽にどうぞ</h2>
          <div className="space-y-3">
            <a
              href="https://x.com/line_kensho_m"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-orange-300 hover:bg-orange-50 transition"
            >
              <span className="text-2xl">🐦</span>
              <div>
                <p className="font-bold text-gray-800 text-sm">X（旧Twitter）</p>
                <p className="text-orange-500 text-sm">@line_kensho_m</p>
              </div>
            </a>
            <a
              href="https://www.instagram.com/line_kensho_matome/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-orange-300 hover:bg-orange-50 transition"
            >
              <span className="text-2xl">📸</span>
              <div>
                <p className="font-bold text-gray-800 text-sm">Instagram</p>
                <p className="text-orange-500 text-sm">@line_kensho_matome</p>
              </div>
            </a>
          </div>
          <p className="text-xs text-gray-400 mt-4 leading-relaxed">
            ※ 懸賞の応募方法・当選に関するお問い合わせは各キャンペーン主催企業へお願いします。
          </p>
        </div>
      </div>

      <footer className="bg-gray-800 text-gray-400 mt-4">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <a href="/" className="text-white font-bold flex items-center gap-2"><span>🎁</span> LINE懸賞まとめ</a>
          <div className="flex gap-4 flex-wrap justify-center">
            <a href="/about" className="text-xs text-gray-500 hover:text-orange-400 transition">運営者情報</a>
            <a href="/blog" className="text-xs text-gray-500 hover:text-orange-400 transition">ブログ</a>
            <a href="/privacy" className="text-xs text-gray-500 hover:text-orange-400 transition">プライバシーポリシー</a>
          </div>
          <p className="text-xs text-gray-600">© 2026 LINE懸賞まとめ</p>
        </div>
      </footer>
    </main>
  )
}
