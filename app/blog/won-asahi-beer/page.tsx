export const metadata = {
  title: '【当選報告】アサヒ生ビール マルエフ＆アサヒビール ゴールドが当たりました！',
  description: 'LINE懸賞でアサヒ生ビール マルエフとアサヒビール ゴールドに当選！実際に当選した体験談と応募のコツをご紹介します。',
}

export default function WonAsahiBeerPage() {
  return (
    <main className="min-h-screen bg-orange-50">
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 py-10 px-4 text-center">
        <p className="text-orange-200 text-sm mb-2">🎉 当選報告</p>
        <h1 className="text-2xl font-black text-white leading-snug">
          アサヒ生ビール マルエフ＆<br />ゴールドが当たりました！
        </h1>
        <p className="text-orange-100 mt-2 text-sm">2026年6月</p>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl shadow-sm p-8 space-y-8">

          {/* 当選内容 */}
          <div className="bg-orange-50 rounded-2xl p-6 text-center">
            <p className="text-4xl mb-3">🍺🍺</p>
            <h2 className="text-lg font-black text-orange-600 mb-3">当選内容</h2>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-3 bg-white rounded-xl p-3 shadow-sm">
                <span className="text-2xl">🏅</span>
                <div className="text-left">
                  <p className="font-bold text-gray-800 text-sm">アサヒ生ビール マルエフ</p>
                  <p className="text-orange-500 text-xs font-bold">1本 当選！</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3 bg-white rounded-xl p-3 shadow-sm">
                <span className="text-2xl">🏅</span>
                <div className="text-left">
                  <p className="font-bold text-gray-800 text-sm">アサヒビール ゴールド</p>
                  <p className="text-orange-500 text-xs font-bold">1本 当選！</p>
                </div>
              </div>
            </div>
          </div>

          {/* 当選の経緯 */}
          <section>
            <h2 className="text-lg font-bold text-gray-800 border-l-4 border-orange-400 pl-3 mb-4">
              当選の経緯
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              このサイトで毎日LINEの懸賞情報を集める中で、アサヒビールのLINEキャンペーンを発見。
              購入レシートを撮影してLINEで送るだけの簡単な応募方法だったので、
              スーパーでアサヒ生ビールを購入したついでにすぐ応募しました。
            </p>
            <p className="text-gray-600 text-sm leading-relaxed mt-3">
              応募からしばらく経ったころ、LINE公式アカウントからメッセージが届き当選を確認。
              マルエフとゴールド、2種類それぞれ1本ずつ当選するという嬉しい結果になりました！
            </p>
          </section>

          {/* 当選のポイント */}
          <section>
            <h2 className="text-lg font-bold text-gray-800 border-l-4 border-orange-400 pl-3 mb-4">
              当選できた理由（振り返り）
            </h2>
            <div className="space-y-3">
              {[
                {
                  icon: '📅',
                  title: '開始直後に応募した',
                  desc: 'キャンペーン開始から間もないタイミングで応募できたため、応募者がまだ少なかったと思います。新着情報はこまめにチェックすることが大事です。',
                },
                {
                  icon: '🛒',
                  title: '購入前提のキャンペーンを選んだ',
                  desc: 'レシート応募型は少し手間がかかる分、応募者数が少なめになる傾向があります。面倒でも応募することで当選確率が上がります。',
                },
                {
                  icon: '🔔',
                  title: 'LINE通知をオンにしていた',
                  desc: '当選連絡はLINEメッセージで届きます。通知をオフにしていると見逃す可能性があるので、企業アカウントの通知は必ずオンに。',
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-3 p-4 bg-gray-50 rounded-xl">
                  <span className="text-xl flex-shrink-0">{item.icon}</span>
                  <div>
                    <p className="font-bold text-gray-800 text-sm mb-1">{item.title}</p>
                    <p className="text-gray-600 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 感想 */}
          <section>
            <h2 className="text-lg font-bold text-gray-800 border-l-4 border-orange-400 pl-3 mb-3">
              飲んでみた感想
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              当選したビールは格別！マルエフはまろやかでコクがあり、ゴールドはすっきりとした飲み口でどちらも美味しかったです。
              自分で応募して当選したものはひとしおですね。
            </p>
            <p className="text-gray-600 text-sm leading-relaxed mt-3">
              LINE懸賞はコツコツ続けることが一番の近道です。
              このサイトでは毎日新着懸賞を更新していますので、ぜひ毎日チェックして応募してみてください！
            </p>
          </section>

          {/* まとめ */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5">
            <p className="text-yellow-800 text-sm font-bold mb-2">🏆 まとめ</p>
            <ul className="text-yellow-700 text-xs space-y-1 leading-relaxed list-disc list-inside">
              <li>新着キャンペーンはできるだけ早く応募する</li>
              <li>手間のかかる応募方法も積極的にチャレンジ</li>
              <li>LINEの通知はオンにしておく</li>
              <li>あきらめず毎日続ける</li>
            </ul>
          </div>

          <div className="text-center pt-2">
            <a
              href="/"
              className="inline-block bg-gradient-to-r from-orange-500 to-orange-400 text-white font-bold px-8 py-3 rounded-full hover:opacity-90 transition text-sm"
            >
              🎁 今日の懸賞をチェックする →
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
