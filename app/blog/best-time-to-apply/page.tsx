export const metadata = {
  title: '懸賞が当たりやすい時期・曜日はいつ？データから読み解く応募戦略',
  description: '懸賞に当たりやすい時期や曜日はあるのか？応募者数が少ない時間帯・シーズンを狙うコツをご紹介します。',
}

export default function BestTimeToApplyPage() {
  return (
    <main className="min-h-screen bg-orange-50">
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 py-10 px-4 text-center">
        <p className="text-orange-200 text-sm mb-2">⏰ 攻略法</p>
        <h1 className="text-2xl font-black text-white leading-snug">
          懸賞が当たりやすい<br />
          <span className="text-yellow-300">時期・曜日</span>はいつ？
        </h1>
        <p className="text-orange-100 mt-2 text-sm">2026年8月</p>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl shadow-sm p-8 space-y-8">

          <p className="text-gray-600 text-sm leading-relaxed">
            「同じ懸賞でも応募するタイミングで当選確率が変わる」と聞いたことはありませんか？
            実は応募者数は時期・曜日・時間帯によって大きく変動します。
            狙い目を知るだけで当選チャンスが広がります。
          </p>

          {/* 曜日 */}
          <section>
            <h2 className="text-lg font-bold text-gray-800 border-l-4 border-orange-400 pl-3 mb-4">
              当たりやすい曜日は？
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              一般的に応募者が少ない曜日ほど競争率が下がり、当選確率が上がります。
            </p>
            <div className="space-y-2">
              {[
                { day: '月・火曜日', level: '狙い目', color: 'green', note: '週末の疲れで応募忘れる人が多い。競争率低めでねらい目' },
                { day: '水・木曜日', level: '普通', color: 'gray', note: '応募者数は平均的。外さずコツコツ応募しよう' },
                { day: '金曜日', level: 'やや多い', color: 'yellow', note: '週末前で気分が上がり応募する人が増える傾向' },
                { day: '土・日曜日', level: '応募者多め', color: 'red', note: '暇な時間が増えて応募者が集中しやすい' },
              ].map((item) => (
                <div key={item.day} className={`flex items-center gap-3 p-3 rounded-xl border ${
                  item.color === 'green' ? 'bg-green-50 border-green-200' :
                  item.color === 'yellow' ? 'bg-yellow-50 border-yellow-200' :
                  item.color === 'red' ? 'bg-red-50 border-red-200' :
                  'bg-gray-50 border-gray-200'
                }`}>
                  <div className="w-20 shrink-0">
                    <p className={`text-sm font-bold ${
                      item.color === 'green' ? 'text-green-700' :
                      item.color === 'yellow' ? 'text-yellow-700' :
                      item.color === 'red' ? 'text-red-700' :
                      'text-gray-700'
                    }`}>{item.day}</p>
                    <p className={`text-xs ${
                      item.color === 'green' ? 'text-green-600' :
                      item.color === 'yellow' ? 'text-yellow-600' :
                      item.color === 'red' ? 'text-red-600' :
                      'text-gray-500'
                    }`}>{item.level}</p>
                  </div>
                  <p className="text-gray-600 text-xs leading-relaxed">{item.note}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 時間帯 */}
          <section>
            <h2 className="text-lg font-bold text-gray-800 border-l-4 border-orange-400 pl-3 mb-4">
              当たりやすい時間帯は？
            </h2>
            <div className="space-y-3">
              {[
                { time: '早朝（6〜8時）', icon: '🌅', recommend: true, note: '応募者が最も少ない時間帯。通勤・通学前に応募するのが最強の習慣' },
                { time: '昼（12〜13時）', icon: '☀️', recommend: false, note: 'ランチタイムに応募する人が多く競争率が上がりやすい' },
                { time: '夜（21〜23時）', icon: '🌙', recommend: false, note: '就寝前にスマホを触る人が多く、最も応募者が集中する時間帯' },
              ].map((item) => (
                <div key={item.time} className={`p-4 rounded-xl border ${item.recommend ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                  <p className={`text-sm font-bold mb-1 ${item.recommend ? 'text-green-700' : 'text-gray-700'}`}>
                    {item.icon} {item.time} {item.recommend && '← おすすめ'}
                  </p>
                  <p className={`text-xs leading-relaxed ${item.recommend ? 'text-green-600' : 'text-gray-500'}`}>{item.note}</p>
                </div>
              ))}
            </div>
          </section>

          {/* シーズン */}
          <section>
            <h2 className="text-lg font-bold text-gray-800 border-l-4 border-orange-400 pl-3 mb-4">
              当たりやすいシーズンは？
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              年間を通じて見ると、懸賞の当選確率が変わりやすい時期があります。
            </p>
            <div className="space-y-2">
              {[
                { season: '1〜2月（年始）', recommend: true, note: 'お正月明けで懸賞への関心が薄れる。企業のキャンペーンは多いのに応募者が少ない狙い目シーズン' },
                { season: '3〜4月（年度替わり）', recommend: false, note: '新生活・引越しシーズン。忙しくて懸賞どころではない人が多く、実は穴場' },
                { season: '7〜8月（夏）', recommend: false, note: '夏休みで応募者が増える。特に子ども向け・旅行系は競争率が上がりやすい' },
                { season: '12月（年末）', recommend: false, note: '年末は懸賞の件数が増えるが、それ以上に応募者も増える。分散して応募を' },
              ].map((item) => (
                <div key={item.season} className={`p-3 rounded-xl border ${item.recommend ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-gray-200'}`}>
                  <p className={`text-sm font-bold mb-1 ${item.recommend ? 'text-orange-700' : 'text-gray-700'}`}>
                    {item.recommend ? '🎯' : '📅'} {item.season}
                  </p>
                  <p className="text-gray-600 text-xs leading-relaxed">{item.note}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 締切タイミング */}
          <section>
            <h2 className="text-lg font-bold text-gray-800 border-l-4 border-orange-400 pl-3 mb-4">
              応募開始直後 vs 締切直前、どちらが有利？
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="text-blue-700 text-sm font-bold mb-2">🚀 開始直後</p>
                <ul className="text-blue-600 text-xs space-y-1">
                  <li>・まだ知られていない</li>
                  <li>・応募者が少ない</li>
                  <li>・発見したら即応募が正解</li>
                </ul>
              </div>
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
                <p className="text-purple-700 text-sm font-bold mb-2">⏰ 締切直前</p>
                <ul className="text-purple-600 text-xs space-y-1">
                  <li>・忘れられた懸賞は穴場</li>
                  <li>・チェックを欠かさずに</li>
                  <li>・期限切れに注意</li>
                </ul>
              </div>
            </div>
            <p className="text-gray-500 text-xs mt-3 text-center">→ 結論：見つけたらすぐ応募が最強</p>
          </section>

          {/* まとめ */}
          <section>
            <h2 className="text-lg font-bold text-gray-800 border-l-4 border-orange-400 pl-3 mb-3">
              まとめ：最強の応募習慣
            </h2>
            <div className="bg-orange-50 rounded-xl p-4">
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-2"><span className="text-orange-500 font-bold">①</span>早朝6〜8時に応募する</li>
                <li className="flex gap-2"><span className="text-orange-500 font-bold">②</span>月・火曜日を特に意識する</li>
                <li className="flex gap-2"><span className="text-orange-500 font-bold">③</span>新着懸賞は発見したらすぐ応募</li>
                <li className="flex gap-2"><span className="text-orange-500 font-bold">④</span>年始・年度替わりは応募のチャンス</li>
                <li className="flex gap-2"><span className="text-orange-500 font-bold">⑤</span>毎日続けることが一番大事</li>
              </ul>
            </div>
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
