export const metadata = {
  title: '当選しやすいLINE懸賞の選び方',
  description: '当選者数・締切・応募条件から当たりやすい懸賞を見極める方法を解説。効率よく懸賞に当選するためのポイントをご紹介します。',
}

export default function HowToWinPage() {
  return (
    <main className="min-h-screen bg-orange-50">
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 py-10 px-4 text-center">
        <p className="text-orange-200 text-sm mb-2">🎯 攻略法</p>
        <h1 className="text-2xl font-black text-white leading-snug">当選しやすい<br />LINE懸賞の選び方</h1>
        <p className="text-orange-100 mt-2 text-sm">2026年6月</p>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl shadow-sm p-8 space-y-8">

          <p className="text-gray-600 text-sm leading-relaxed">
            LINE懸賞はたくさんの種類がありますが、すべてに応募するのは大変です。
            限られた時間で効率よく当選するには、「当たりやすい懸賞」を選ぶことが重要です。
          </p>

          <section>
            <h2 className="text-lg font-bold text-gray-800 border-l-4 border-orange-400 pl-3 mb-4">
              ① 当選者数で選ぶ
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              最もシンプルな基準は「当選者数」です。当選者数が多いほど当選確率が高くなります。
            </p>
            <div className="bg-orange-50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">🔥 超おすすめ</span>
                <span className="font-bold text-orange-600">10,000名以上</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">👍 おすすめ</span>
                <span className="font-bold text-orange-500">1,000〜9,999名</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">✅ 応募価値あり</span>
                <span className="font-bold text-gray-600">100〜999名</span>
              </div>
            </div>
            <p className="text-gray-500 text-xs mt-2">
              ※ このサイトでは「当選者数順」で並べ替えできます
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 border-l-4 border-orange-400 pl-3 mb-4">
              ② 締切日で選ぶ
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              応募開始直後と締切直前では応募者数が異なります。
            </p>
            <div className="mt-3 space-y-3">
              <div className="p-3 border border-green-200 bg-green-50 rounded-xl">
                <p className="text-green-700 text-sm font-bold">🌟 開始直後（1〜3日目）</p>
                <p className="text-green-600 text-xs mt-1">まだ応募者が少なく、当選確率が高い。見つけたらすぐに応募が吉。</p>
              </div>
              <div className="p-3 border border-blue-200 bg-blue-50 rounded-xl">
                <p className="text-blue-700 text-sm font-bold">⏰ 締切間際（残り1〜2日）</p>
                <p className="text-blue-600 text-xs mt-1">気づかれていない懸賞は応募者が少ないことも。毎日チェックして漏れなく応募しよう。</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 border-l-4 border-orange-400 pl-3 mb-4">
              ③ カテゴリで選ぶ
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              人気が高く応募者が多いカテゴリと、比較的応募者が少ないカテゴリがあります。
            </p>
            <div className="space-y-2">
              {[
                { label: '食品・飲料', note: '企業の知名度が高く応募者多め', icon: '🍺' },
                { label: 'ギフトカード', note: '金額が高いほど人気・競争率高め', icon: '💳' },
                { label: '日用品・コスメ', note: '競争率が比較的低くねらい目', icon: '🧴' },
                { label: 'チケット・旅行', note: '特定層向けで競争率が低い場合も', icon: '✈️' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <span className="text-lg">{item.icon}</span>
                  <div>
                    <p className="text-gray-800 text-sm font-medium">{item.label}</p>
                    <p className="text-gray-500 text-xs">{item.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 border-l-4 border-orange-400 pl-3 mb-3">
              まとめ：効率的な応募戦略
            </h2>
            <ol className="space-y-2 text-sm text-gray-600 list-decimal list-inside leading-relaxed">
              <li>毎朝サイトをチェックして新着懸賞を確認する</li>
              <li>当選者数が多いものを優先して応募する</li>
              <li>締切が近いものも忘れずに応募する</li>
              <li>全カテゴリ幅広く応募して当選チャンスを増やす</li>
              <li>毎日続けることが一番大切</li>
            </ol>
          </section>

          <div className="text-center pt-2">
            <a
              href="/"
              className="inline-block bg-gradient-to-r from-orange-500 to-orange-400 text-white font-bold px-8 py-3 rounded-full hover:opacity-90 transition text-sm"
            >
              🎁 今すぐ懸賞を探す →
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
