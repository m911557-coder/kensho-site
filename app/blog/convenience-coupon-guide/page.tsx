export const metadata = {
  title: 'LINE懸賞の「コンビニ無料引換クーポン」とは？応募から引換までの流れと注意点',
  description: 'ビールやお茶などが当たるLINEのコンビニ無料引換クーポン懸賞について、応募の流れ・引換方法・見落としやすい注意点をまとめました。',
}

const steps = [
  {
    title: 'キャンペーンページを開く',
    desc: 'メーカーのキャンペーンサイトや、LINE公式アカウントのトーク画面にある応募ボタンから参加します。多くはスマートフォン専用です。',
  },
  {
    title: 'LINEでログイン・友だち追加',
    desc: 'LINEアカウントでログインし、メーカーの公式アカウントを友だち追加します。お酒のキャンペーンでは20歳以上であることの確認があります。',
  },
  {
    title: 'アンケートに回答',
    desc: '性別・年代・普段飲む商品など、数問のアンケートに答えます。初回のみで、2回目以降は省略されるキャンペーンが多いです。',
  },
  {
    title: '引換するコンビニを選ぶ',
    desc: 'セブン-イレブン・ファミリーマート・ローソンなどから、引換したいお店を選びます。当選後は変更できないことがほとんどです。',
  },
  {
    title: 'その場で結果が表示される',
    desc: '「その場で当たる」タイプは、応募直後に画面で当落がわかります。当選するとクーポン（バーコード）が表示されます。',
  },
]

const cautions = [
  {
    title: '引換期間がある',
    desc: 'クーポンには引換期限があり、応募締切の1〜2週間後までが目安です。期限を過ぎると使えないので、当選したら早めに引き換えましょう。',
  },
  {
    title: '選んだコンビニでしか使えない',
    desc: '応募時に選んだチェーンの店舗でのみ引換できます。普段よく行くお店を選んでおくと安心です。',
  },
  {
    title: '売り切れのことがある',
    desc: '大型キャンペーンの期間中は対象商品が品切れになることがあります。キャンペーンによっては、同じメーカーの別の商品と交換できる場合もあります。',
  },
  {
    title: '応募は1日1回・当選は1人1回が多い',
    desc: '毎日応募できるキャンペーンでも、当選は1アカウントにつき1回までという条件がよくあります。応募規約を確認しておきましょう。',
  },
  {
    title: 'セルフレジでは使えないことがある',
    desc: '店舗によってはクーポンをセルフレジで読み取れない場合があります。そのときは店員さんのいるレジで提示してください。',
  },
]

export default function ConvenienceCouponGuidePage() {
  return (
    <main className="min-h-screen bg-orange-50">
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 py-10 px-4 text-center">
        <p className="text-orange-200 text-sm mb-2">🏪 基礎知識</p>
        <h1 className="text-2xl font-black text-white leading-snug">
          LINE懸賞の<br />
          <span className="text-yellow-300">コンビニ無料引換クーポン</span>とは？
        </h1>
        <p className="text-orange-100 mt-2 text-sm">2026年10月</p>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl shadow-sm p-8 space-y-8">

          <p className="text-gray-600 text-sm leading-relaxed">
            LINE懸賞の中でも特に多いのが、ビールやチューハイ、お茶などの商品1本と交換できる
            「コンビニ無料引換クーポン」が当たるキャンペーンです。
            当選者数が数万〜数十万名と大規模なものが多く、応募も数分で終わるため、
            懸賞をはじめたばかりの方にも取り組みやすいジャンルです。
            この記事では、応募から引換までの流れと、見落としやすい注意点をまとめます。
          </p>

          <section>
            <h2 className="text-lg font-bold text-gray-800 border-l-4 border-orange-400 pl-3 mb-4">
              応募から当選までの流れ
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
              当選したクーポンの使い方
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              当選するとクーポン画面が表示されるほか、LINEのトーク画面やキャンペーンページの
              「当選履歴」からも後で開けるようになっているのが一般的です。
              引換するときは、選んだコンビニのレジでクーポンのバーコードを提示するだけです。
              お酒の場合は、レジで年齢確認の操作を求められることがあります。
            </p>
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
              <p className="text-yellow-800 text-xs font-bold">💡 スクリーンショットでは使えないことが多い</p>
              <p className="text-yellow-700 text-xs mt-1 leading-relaxed">
                クーポン画面を保存しておきたくなりますが、画面の画像では引換できない仕組みのものが多くあります。
                引換のときは、LINEやキャンペーンページからクーポンを開き直して提示しましょう。
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 border-l-4 border-orange-400 pl-3 mb-4">
              見落としやすい注意点
            </h2>
            <div className="space-y-3">
              {cautions.map((item) => (
                <div key={item.title} className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-800 text-sm font-bold mb-1">⚠️ {item.title}</p>
                  <p className="text-gray-600 text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 border-l-4 border-orange-400 pl-3 mb-3">
              どのキャンペーンから応募すればいい？
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              迷ったら、当選者数が多く、締切が近いものから応募するのがおすすめです。
              「その場で当たる」タイプで毎日応募できるものは、締切までこまめに続けるほど当選のチャンスが増えます。
              当サイトのトップページでは、当選者数の多い順や締切の近い順に並べ替えて探せます。
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
