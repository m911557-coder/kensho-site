export const metadata = {
  title: '【当選報告】サントリー 翠ジンソーダがファミマのLINEクーポンで当たりました！',
  description: 'サントリー 翠ジンソーダ〈すっきり爽やか〉350ml缶のLINE懸賞に当選！ファミリーマートの引換券クーポンが届いた体験談をご紹介します。',
}

export default function WonSuiGinSodaPage() {
  return (
    <main className="min-h-screen bg-orange-50">
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 py-10 px-4 text-center">
        <p className="text-orange-200 text-sm mb-2">🎉 当選報告</p>
        <h1 className="text-2xl font-black text-white leading-snug">
          サントリー 翠ジンソーダが<br />ファミマクーポンで当たった！
        </h1>
        <p className="text-orange-100 mt-2 text-sm">2026年6月</p>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl shadow-sm p-8 space-y-8">

          {/* 当選内容 */}
          <div className="bg-green-50 rounded-2xl p-6 text-center border border-green-100">
            <p className="text-4xl mb-3">🥂</p>
            <h2 className="text-lg font-black text-green-700 mb-3">当選内容</h2>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-xs text-gray-500 mb-1">ファミリーマート × サントリー LINE懸賞</p>
              <p className="font-black text-gray-800 text-base mb-1">
                翠ジンソーダ〈すっきり爽やか〉<br />5% 350ml缶
              </p>
              <p className="text-green-600 font-bold text-sm">ファミマ引換クーポン（税込195円相当）</p>
            </div>
          </div>

          {/* 当選の経緯 */}
          <section>
            <h2 className="text-lg font-bold text-gray-800 border-l-4 border-orange-400 pl-3 mb-4">
              当選の経緯
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              サントリーのLINE公式キャンペーンに応募したところ、LINEにファミリーマートの引換クーポンが届きました。
              応募方法はLINEから簡単に参加できるタイプで、手間もほとんどかからず気軽に応募できるキャンペーンでした。
            </p>
            <p className="text-gray-600 text-sm leading-relaxed mt-3">
              当選者数が25万名という大規模キャンペーンだったこともあり、
              コツコツ応募し続けていたことが実を結びました。
              大型キャンペーンは当選者数が多いので、積極的に応募するのがおすすめです！
            </p>
          </section>

          {/* 引換クーポンの使い方 */}
          <section>
            <h2 className="text-lg font-bold text-gray-800 border-l-4 border-orange-400 pl-3 mb-4">
              ファミマ引換クーポンの使い方
            </h2>
            <ol className="space-y-3">
              {[
                'LINEのトーク画面でクーポンを開く',
                'ファミリーマートのレジでクーポン画面を提示する',
                '「翠ジンソーダ」と引き換えてもらう',
                '有効期限内に忘れず使う（期限切れ注意！）',
              ].map((step, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span className="bg-green-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-gray-600 text-sm">{step}</p>
                </li>
              ))}
            </ol>
            <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl">
              <p className="text-red-600 text-xs font-bold">⚠️ クーポンの有効期限に注意！</p>
              <p className="text-red-500 text-xs mt-1">
                LINE懸賞のクーポン引換券には有効期限があります。当選通知が届いたらなるべく早めに使いましょう。
              </p>
            </div>
          </section>

          {/* 飲んだ感想 */}
          <section>
            <h2 className="text-lg font-bold text-gray-800 border-l-4 border-orange-400 pl-3 mb-3">
              飲んでみた感想
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              翠ジンソーダ〈すっきり爽やか〉は、その名の通りキレのある爽快な飲み口が特徴。
              ジンの風味がしっかりしながらも飲みやすく、夏にぴったりの一本でした。
              懸賞で当てたものはやっぱり格別においしく感じますね！
            </p>
          </section>

          {/* 大型キャンペーンのすすめ */}
          <section>
            <h2 className="text-lg font-bold text-gray-800 border-l-4 border-orange-400 pl-3 mb-4">
              25万名当選の大型キャンペーンを狙え！
            </h2>
            <div className="space-y-3">
              {[
                {
                  icon: '🎯',
                  title: '当選者数が多いほど当たりやすい',
                  desc: '今回のキャンペーンは当選者数25万名という大規模なもの。当選者数が多いキャンペーンは当選確率が高いため、優先的に応募するのがおすすめです。',
                },
                {
                  icon: '🏪',
                  title: 'コンビニ×メーカーのコラボキャンペーンに注目',
                  desc: 'ファミリーマートやローソンなど、コンビニとメーカーが連携したキャンペーンは規模が大きく、当選者数も多い傾向があります。',
                },
                {
                  icon: '📲',
                  title: 'クーポン型は使い忘れに注意',
                  desc: '当選賞品がコンビニ引換クーポンの場合、有効期限があります。当選通知が届いたらすぐにカレンダーに登録して使い忘れを防ぎましょう。',
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

          {/* まとめ */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5">
            <p className="text-yellow-800 text-sm font-bold mb-2">🏆 まとめ</p>
            <ul className="text-yellow-700 text-xs space-y-1 leading-relaxed list-disc list-inside">
              <li>当選者数が多い大型キャンペーンを優先して応募する</li>
              <li>コンビニ×メーカーのコラボキャンペーンはねらい目</li>
              <li>クーポン型の賞品は有効期限を必ず確認する</li>
              <li>毎日こつこつ応募を続けることが当選への近道</li>
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
