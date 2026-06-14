export const metadata = {
  title: 'LINE懸賞とは？初心者向けかんたん解説',
  description: 'LINEで応募できる懸賞の仕組み・メリット・応募方法をわかりやすく解説。スマホ1台で豪華賞品に応募できます。',
}

export default function WhatIsLineKenshoPage() {
  return (
    <main className="min-h-screen bg-orange-50">
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 py-10 px-4 text-center">
        <p className="text-orange-200 text-sm mb-2">📱 基礎知識</p>
        <h1 className="text-2xl font-black text-white leading-snug">LINE懸賞とは？<br />初心者向けかんたん解説</h1>
        <p className="text-orange-100 mt-2 text-sm">2026年6月</p>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl shadow-sm p-8 space-y-8">

          <section>
            <h2 className="text-lg font-bold text-gray-800 border-l-4 border-orange-400 pl-3 mb-3">
              LINE懸賞とは？
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              LINE懸賞とは、LINEアプリを使って応募できるプレゼントキャンペーンのことです。
              飲料メーカー・食品会社・コンビニ・EC企業など、さまざまな企業が商品PRのために開催しています。
            </p>
            <p className="text-gray-600 text-sm leading-relaxed mt-3">
              応募方法は主に「企業のLINE公式アカウントを友だち追加してメッセージを送る」だけ。
              スマホひとつで完結するため、ハガキや切手が不要で、気軽に応募できるのが最大の魅力です。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 border-l-4 border-orange-400 pl-3 mb-3">
              LINE懸賞の3つのメリット
            </h2>
            <div className="space-y-3">
              {[
                { icon: '⚡', title: 'スピーディーに応募できる', desc: 'LINEアプリで数タップするだけ。1件30秒もあれば応募完了します。' },
                { icon: '💰', title: '完全無料', desc: 'ハガキ代・切手代・通信費などは一切かかりません。' },
                { icon: '🎁', title: '豪華賞品が多い', title2: '', desc: 'ビール・ギフトカード・家電・旅行など、企業がPRのために用意する豪華賞品が揃っています。' },
              ].map((item) => (
                <div key={item.title} className="flex gap-3 p-4 bg-orange-50 rounded-xl">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{item.title}</p>
                    <p className="text-gray-600 text-xs mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 border-l-4 border-orange-400 pl-3 mb-3">
              応募の流れ
            </h2>
            <ol className="space-y-3">
              {[
                'このサイトで気になる懸賞を見つける',
                '「LINE で応募する」ボタンをタップ',
                '企業のLINE公式アカウントを友だち追加',
                'キャンペーンメッセージを送信して応募完了',
                '当選者にはLINEでメッセージが届く',
              ].map((step, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span className="bg-orange-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-gray-600 text-sm">{step}</p>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 border-l-4 border-orange-400 pl-3 mb-3">
              どんな賞品が当たる？
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { emoji: '🍺', label: '飲料・食品' },
                { emoji: '💳', label: 'ギフトカード' },
                { emoji: '📱', label: 'スマホ・家電' },
                { emoji: '✈️', label: '旅行・宿泊' },
                { emoji: '🧴', label: 'コスメ・日用品' },
                { emoji: '🎫', label: 'チケット・体験' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 p-3 border border-gray-100 rounded-xl">
                  <span className="text-xl">{item.emoji}</span>
                  <span className="text-gray-700 text-sm font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </section>

          <div className="text-center pt-4">
            <a
              href="/"
              className="inline-block bg-gradient-to-r from-orange-500 to-orange-400 text-white font-bold px-8 py-3 rounded-full hover:opacity-90 transition"
            >
              🎁 今日の懸賞を見る →
            </a>
          </div>
        </div>

        <div className="mt-6 text-center">
          <a href="/blog" className="text-orange-500 text-sm hover:underline">← ブログ一覧に戻る</a>
        </div>
      </div>

      <footer className="bg-gray-800 text-gray-400 mt-4">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <a href="/" className="text-white font-bold flex items-center gap-2"><span>🎁</span> LINE懸賞まとめ</a>
          <div className="flex gap-4 flex-wrap justify-center">
            <a href="/blog" className="text-xs text-gray-500 hover:text-orange-400 transition">ブログ</a>
            <a href="/privacy" className="text-xs text-gray-500 hover:text-orange-400 transition">プライバシーポリシー</a>
            <a href="/contact" className="text-xs text-gray-500 hover:text-orange-400 transition">お問い合わせ</a>
          </div>
          <p className="text-xs text-gray-600">© 2026 LINE懸賞まとめ</p>
        </div>
      </footer>
    </main>
  )
}
