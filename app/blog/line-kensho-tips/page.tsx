export const metadata = {
  title: 'LINE懸賞で当選確率を上げる10のコツ',
  description: '実際に懸賞当選経験をもとに、LINE懸賞の当選確率を上げるための具体的なコツを10個ご紹介します。',
}

export default function LineKenshoTipsPage() {
  const tips = [
    {
      num: 1,
      title: '毎日応募する',
      desc: '継続応募が基本中の基本。1回の応募より、毎日応募し続けることで当選確率が大きく上がります。このサイトをブックマークして、毎日チェックする習慣をつけましょう。',
    },
    {
      num: 2,
      title: '当選者数が多い懸賞を優先する',
      desc: '当選者数が多いほど当然当選確率が上がります。1万名・10万名規模の懸賞は狙い目。このサイトでは「当選者数順」で並べ替えができるので活用してください。',
    },
    {
      num: 3,
      title: '締切間際の懸賞も狙う',
      desc: '締切直前は応募者が減る場合があります。「今日締切」「明日締切」のフィルターを使って、締切間際の懸賞にも積極的に応募しましょう。',
    },
    {
      num: 4,
      title: '複数の懸賞に同時応募する',
      desc: '1件だけでなく、毎日5〜10件を目標に応募しましょう。LINEで気軽に応募できるので、スキマ時間を活用すれば1日10分もかかりません。',
    },
    {
      num: 5,
      title: '友だち追加後はブロックしない',
      desc: '当選連絡はLINEメッセージで届きます。応募後に企業アカウントをブロックすると当選通知が届かないので注意しましょう。',
    },
    {
      num: 6,
      title: '応募期間の長い懸賞にも注目',
      desc: '応募期間が長い懸賞は、多くの応募者が集まりやすい反面、締切直前に応募者が急増します。開始直後に応募するのが狙い目です。',
    },
    {
      num: 7,
      title: 'プロフィールを整えておく',
      desc: 'LINE公式アカウントによっては、当選時にプロフィール情報（名前・住所）の提供が必要です。プロフィールを正確に設定しておきましょう。',
    },
    {
      num: 8,
      title: 'LINE通知をオンにする',
      desc: '当選の連絡は期限付きのことが多く、返信しないと当選が無効になるケースも。LINEの通知をオンにして、メッセージを見逃さないようにしましょう。',
    },
    {
      num: 9,
      title: 'SNSでシェアが必要な懸賞も応募する',
      desc: '一部の懸賞はX（Twitter）やInstagramでのシェアが応募条件です。手間はかかりますが、その分応募者が少なく当選しやすい場合があります。',
    },
    {
      num: 10,
      title: 'あきらめずに続ける',
      desc: '懸賞は運の要素が強いですが、続けることで必ず当たります。当サイト運営者もアサヒビール（マルエフ・ゴールド）に当選した実績があります。継続が一番のコツです！',
    },
  ]

  return (
    <main className="min-h-screen bg-orange-50">
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 py-10 px-4 text-center">
        <p className="text-orange-200 text-sm mb-2">🏆 攻略法</p>
        <h1 className="text-2xl font-black text-white leading-snug">LINE懸賞で当選確率を<br />上げる10のコツ</h1>
        <p className="text-orange-100 mt-2 text-sm">2026年6月</p>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl shadow-sm p-8">

          <p className="text-gray-600 text-sm leading-relaxed mb-8">
            当サイトの運営者は実際にLINE懸賞でアサヒビール（マルエフ・ゴールド）に当選した経験があります。
            その経験をもとに、当選確率を上げるための具体的なコツを10個ご紹介します。
          </p>

          <div className="space-y-5">
            {tips.map((tip) => (
              <div key={tip.num} className="flex gap-4">
                <div className="bg-orange-500 text-white font-black text-sm w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  {tip.num}
                </div>
                <div>
                  <h2 className="font-bold text-gray-800 text-sm mb-1">{tip.title}</h2>
                  <p className="text-gray-600 text-xs leading-relaxed">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 p-4 bg-orange-50 rounded-xl text-center">
            <p className="text-gray-700 text-sm font-bold mb-3">🎁 まずは今日の懸賞から応募しよう！</p>
            <a
              href="/"
              className="inline-block bg-gradient-to-r from-orange-500 to-orange-400 text-white font-bold px-8 py-3 rounded-full hover:opacity-90 transition text-sm"
            >
              新着懸賞を見る →
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
