export const metadata = {
  title: 'LINEのレシート応募キャンペーンとは？応募方法と失敗しないためのポイント',
  description: '対象商品を買ったレシートをLINEで送って応募する「レシート応募」の流れと、撮影のコツ・レシートの保管など失敗しないためのポイントを解説します。',
}

const steps = [
  {
    title: '対象商品を購入する',
    desc: '対象商品・対象店舗・購入期間はキャンペーンごとに決まっています。購入前に応募規約で確認しておくと確実です。',
  },
  {
    title: '公式アカウントを友だち追加',
    desc: 'キャンペーンページのボタンやQRコードから、メーカーやお店のLINE公式アカウントを友だち追加します。',
  },
  {
    title: 'レシートを撮影して送る',
    desc: 'トーク画面のメニューから応募を選び、案内に従ってレシートの写真を送ります。複数枚まとめて応募できるキャンペーンもあります。',
  },
  {
    title: '審査・抽選を待つ',
    desc: 'レシートの内容が確認されたあと抽選になります。その場で結果がわかるもの、後日LINEで連絡が来るものなど形式はさまざまです。',
  },
]

const tips = [
  {
    title: 'レシート全体が写るように撮る',
    desc: '店名・購入日時・対象商品・合計金額が読み取れないと、応募が無効になることがあります。長いレシートは折らずに、明るい場所でまっすぐ撮りましょう。',
  },
  {
    title: 'レシートは抽選が終わるまで捨てない',
    desc: '当選者にはレシート原本の提出や再確認を求めるキャンペーンがあります。結果が出るまでは保管しておくと安心です。',
  },
  {
    title: '同じレシートの使い回しに注意',
    desc: '1枚のレシートで応募できるのは1回まで、というルールが一般的です。複数のキャンペーンで同じレシートを使えるかどうかも規約で確認しましょう。',
  },
  {
    title: '電子レシートが使えるかを確認する',
    desc: 'アプリの電子レシートやネット通販の購入履歴は、対象外になっていることがあります。紙のレシートが必要かどうか事前に確認しておきましょう。',
  },
]

export default function ReceiptCampaignGuidePage() {
  return (
    <main className="min-h-screen bg-orange-50">
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 py-10 px-4 text-center">
        <p className="text-orange-200 text-sm mb-2">🧾 基礎知識</p>
        <h1 className="text-2xl font-black text-white leading-snug">
          LINEの<br />
          <span className="text-yellow-300">レシート応募キャンペーン</span>とは？
        </h1>
        <p className="text-orange-100 mt-2 text-sm">2026年10月</p>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl shadow-sm p-8 space-y-8">

          <p className="text-gray-600 text-sm leading-relaxed">
            LINE懸賞には、アンケートに答えるだけで応募できるものと、
            対象商品を買ったレシートを送って応募する「レシート応募」タイプがあります。
            レシート応募は購入が必要なぶん応募する人が限られ、
            賞品も商品券やまとめ買いセットなど豪華なものが多いのが特徴です。
            普段の買い物のついでに応募できるので、うまく活用すると懸賞の幅が広がります。
          </p>

          <section>
            <h2 className="text-lg font-bold text-gray-800 border-l-4 border-orange-400 pl-3 mb-4">
              応募の流れ
            </h2>
            <ol className="space-y-3">
              {steps.map((step, i) => (
                <li key={step.title} className="flex gap-3 items-start">
                  <span className="bg-orange-400 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-gray-800 text-sm font-bold">{step.title}</p>
                    <p className="text-gray-600 text-xs leading-relaxed mt-1">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 border-l-4 border-orange-400 pl-3 mb-4">
              アンケート応募との違い
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-gray-100 rounded-xl">
                <thead className="bg-orange-50 text-gray-700">
                  <tr>
                    <th className="p-3"></th>
                    <th className="p-3">アンケート応募</th>
                    <th className="p-3">レシート応募</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600">
                  <tr className="border-t border-gray-100">
                    <td className="p-3 font-bold">購入</td>
                    <td className="p-3">不要</td>
                    <td className="p-3">必要</td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="p-3 font-bold">手間</td>
                    <td className="p-3">数分で完了</td>
                    <td className="p-3">撮影・送信が必要</td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="p-3 font-bold">応募者の数</td>
                    <td className="p-3">多い傾向</td>
                    <td className="p-3">少ない傾向</td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="p-3 font-bold">よくある賞品</td>
                    <td className="p-3">コンビニ引換クーポン・ポイント</td>
                    <td className="p-3">商品券・まとめ買いセット</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 border-l-4 border-orange-400 pl-3 mb-4">
              失敗しないためのポイント
            </h2>
            <div className="space-y-3">
              {tips.map((item) => (
                <div key={item.title} className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-800 text-sm font-bold mb-1">✅ {item.title}</p>
                  <p className="text-gray-600 text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 border-l-4 border-orange-400 pl-3 mb-3">
              まとめ
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              レシート応募は、普段買っている商品が対象になっていれば手間以上のチャンスがある懸賞です。
              買い物の前に受付中のキャンペーンをチェックしておくと、応募できる機会を逃しにくくなります。
              アンケートだけで応募できる懸賞と組み合わせて、無理のない範囲で続けてみてください。
            </p>
          </section>

          <div className="text-center pt-2">
            <a
              href="/"
              className="inline-block bg-gradient-to-r from-orange-500 to-orange-400 text-white font-bold px-8 py-3 rounded-full hover:opacity-90 transition text-sm"
            >
              🎁 受付中の懸賞を探す →
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
