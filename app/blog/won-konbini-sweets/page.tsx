export const metadata = {
  title: '【当選報告】ローソンのLINE懸賞でスイーツが当たりました！',
  description: 'ローソンのLINE公式アカウントキャンペーンでコンビニスイーツが当選！実際の応募から当選通知・引換までの体験をレポートします。',
}

export default function WonKonbiniSweetsPage() {
  return (
    <main className="min-h-screen bg-orange-50">
      <div className="bg-gradient-to-r from-pink-500 to-orange-400 py-10 px-4 text-center">
        <p className="text-pink-200 text-sm mb-2">🎉 当選報告</p>
        <h1 className="text-2xl font-black text-white leading-snug">
          ローソンのLINE懸賞で<br />
          <span className="text-yellow-300">スイーツが当たった！</span>
        </h1>
        <p className="text-orange-100 mt-2 text-sm">2026年8月</p>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl shadow-sm p-8 space-y-8">

          {/* 当選内容サマリー */}
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-5 text-center">
            <p className="text-yellow-600 text-xs font-bold mb-2">🏆 当選内容</p>
            <p className="text-2xl font-black text-gray-800 mb-1">ローソン スイーツ引換券</p>
            <p className="text-gray-500 text-sm">Uchi Café プレミアムロールケーキ 1個</p>
          </div>

          {/* 応募から当選まで */}
          <section>
            <h2 className="text-lg font-bold text-gray-800 border-l-4 border-orange-400 pl-3 mb-4">
              応募から当選までの流れ
            </h2>
            <div className="space-y-3">
              {[
                { step: '応募', date: '2026年7月某日', desc: 'LINE懸賞まとめで発見。ローソン公式LINEの友だち追加後、アンケートに回答して応募。所要時間は約2分。' },
                { step: '当選通知', date: '応募から約1週間後', desc: 'ローソン公式LINEからトーク画面に「おめでとうございます」のメッセージが届いた。最初は何かのお知らせかと思ってスルーしそうになった！' },
                { step: '引換クーポン受け取り', date: '当選通知から1日後', desc: 'LINEのトーク画面に引換用バーコードが送られてきた。有効期限は1週間。' },
                { step: '引換完了', date: 'クーポン受け取り翌日', desc: '近所のローソンでレジにてバーコードを提示。スムーズに引換完了。スタッフの方も慣れていてスムーズだった。' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-orange-400 text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </div>
                    {i < 3 && <div className="w-0.5 bg-orange-200 flex-1 my-1" />}
                  </div>
                  <div className="pb-4">
                    <p className="text-orange-600 text-xs font-bold">{item.step}（{item.date}）</p>
                    <p className="text-gray-600 text-sm leading-relaxed mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 実食レポート */}
          <section>
            <h2 className="text-lg font-bold text-gray-800 border-l-4 border-orange-400 pl-3 mb-4">
              実食レポート
            </h2>
            <div className="bg-pink-50 rounded-xl p-5">
              <p className="text-pink-700 text-sm font-bold mb-2">🍰 Uchi Café プレミアムロールケーキ</p>
              <p className="text-gray-600 text-sm leading-relaxed">
                生クリームがたっぷりでふわふわのスポンジとの相性が抜群。
                コンビニスイーツとは思えないクオリティで、タダでいただいたとは信じられない美味しさでした。
                懸賞に当たると食べる前から気分が上がりますね。
              </p>
              <div className="mt-3 flex gap-3">
                {['クリームがたっぷり', 'ふわふわ食感', 'コスパ最強（無料！）'].map((tag) => (
                  <span key={tag} className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-full">{tag}</span>
                ))}
              </div>
            </div>
          </section>

          {/* 応募のポイント */}
          <section>
            <h2 className="text-lg font-bold text-gray-800 border-l-4 border-orange-400 pl-3 mb-4">
              今回の応募で感じたポイント
            </h2>
            <div className="space-y-3">
              {[
                { icon: '✅', point: 'コンビニ系の懸賞は当選者数が多い', detail: 'ローソン・セブン・ファミマなど大手コンビニの懸賞は当選枠が数千〜数万人規模のことも多く、当選しやすい。' },
                { icon: '✅', point: 'アンケート型は応募が簡単で続けやすい', detail: '今回は3問のアンケートに答えるだけで応募完了。毎日でも苦にならない手軽さだった。' },
                { icon: '✅', point: '当選通知はすぐ確認を', detail: 'LINEのトーク画面に届くので見落としやすい。ローソン公式LINEの通知をオンにしておくと安心。' },
              ].map((item) => (
                <div key={item.point} className="flex gap-3 p-3 bg-green-50 rounded-xl">
                  <span className="text-green-500 text-lg">{item.icon}</span>
                  <div>
                    <p className="text-gray-800 text-sm font-medium">{item.point}</p>
                    <p className="text-gray-500 text-xs mt-1 leading-relaxed">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 一言 */}
          <section>
            <div className="bg-orange-50 rounded-xl p-5">
              <p className="text-orange-700 text-sm font-bold mb-2">📝 まとめ</p>
              <p className="text-gray-600 text-sm leading-relaxed">
                毎日コツコツ応募を続けていたら、ある日突然当選通知が届きました。
                コンビニのLINE懸賞はハードルが低く、当選者数も多いのでおすすめです。
                皆さんもぜひ挑戦してみてください！
              </p>
            </div>
          </section>

          <div className="text-center pt-2">
            <a
              href="/"
              className="inline-block bg-gradient-to-r from-orange-500 to-orange-400 text-white font-bold px-8 py-3 rounded-full hover:opacity-90 transition text-sm"
            >
              🎁 コンビニ系懸賞を探す →
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
