export const metadata = {
  title: 'LINE懸賞の応募方法【初心者向け】スマホで簡単3ステップ',
  description: 'LINE懸賞への応募方法を初心者向けに画像なしでわかりやすく解説。友だち追加からアンケート回答まで、スマホで3分でできる応募手順をご紹介します。',
}

export default function HowToApplyPage() {
  return (
    <main className="min-h-screen bg-orange-50">
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 py-10 px-4 text-center">
        <p className="text-orange-200 text-sm mb-2">📱 初心者ガイド</p>
        <h1 className="text-2xl font-black text-white leading-snug">
          LINE懸賞の応募方法<br />
          <span className="text-yellow-300">スマホで簡単3ステップ</span>
        </h1>
        <p className="text-orange-100 mt-2 text-sm">2026年8月</p>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl shadow-sm p-8 space-y-8">

          <p className="text-gray-600 text-sm leading-relaxed">
            「LINE懸賞に興味があるけど、応募方法がわからない」という方のために、
            スマホからの応募手順を丁寧に解説します。慣れれば1件あたり1〜2分で応募できます。
          </p>

          {/* ステップ概要 */}
          <div className="bg-orange-50 rounded-2xl p-5">
            <p className="text-orange-700 font-bold text-sm mb-3">📋 応募の基本的な流れ</p>
            <div className="space-y-2">
              {[
                { step: '1', label: '企業のLINE公式アカウントを友だち追加' },
                { step: '2', label: '応募フォーム・アンケートに答える' },
                { step: '3', label: '完了！当選連絡を待つだけ' },
              ].map((item) => (
                <div key={item.step} className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-orange-400 text-white text-sm font-bold flex items-center justify-center shrink-0">
                    {item.step}
                  </span>
                  <p className="text-gray-700 text-sm">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ステップ1 */}
          <section>
            <h2 className="text-lg font-bold text-gray-800 border-l-4 border-orange-400 pl-3 mb-4">
              ステップ1：友だち追加する
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              このサイトの懸賞カードにある「LINEで応募する」ボタンをタップします。
              企業のLINE公式アカウントのページが開くので「友だち追加」をタップしてください。
            </p>
            <div className="space-y-3">
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-green-700 text-sm font-bold mb-1">✅ ポイント</p>
                <p className="text-green-600 text-xs leading-relaxed">
                  すでに友だちの場合はスキップできます。
                  「友だち追加」後にトーク画面が開く場合は、そのまま次のステップへ。
                </p>
              </div>
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <p className="text-yellow-700 text-sm font-bold mb-1">⚠️ 注意</p>
                <p className="text-yellow-600 text-xs leading-relaxed">
                  友だち追加後にメッセージが届く場合があります。
                  不要なら応募後にブロックしてもOKです（ブロックしても当選は有効です）。
                </p>
              </div>
            </div>
          </section>

          {/* ステップ2 */}
          <section>
            <h2 className="text-lg font-bold text-gray-800 border-l-4 border-orange-400 pl-3 mb-4">
              ステップ2：応募フォームに答える
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              懸賞によって応募方法が異なります。主なパターンは以下の3種類です。
            </p>
            <div className="space-y-3">
              {[
                {
                  type: 'アンケート型',
                  desc: '簡単な質問に答えるだけ。「好きな商品は？」「購入経験は？」などが多い。最も手軽。',
                  icon: '📝',
                  color: 'blue',
                },
                {
                  type: 'チャット応募型',
                  desc: 'LINEのトーク画面でキーワードを送信する。「応募」「欲しい」などのワードをタップするだけ。',
                  icon: '💬',
                  color: 'green',
                },
                {
                  type: '情報入力型',
                  desc: '住所・氏名・電話番号を入力する。当選した場合に商品を送るために必要。',
                  icon: '📦',
                  color: 'orange',
                },
              ].map((item) => (
                <div key={item.type} className={`p-4 rounded-xl border ${
                  item.color === 'blue' ? 'bg-blue-50 border-blue-200' :
                  item.color === 'green' ? 'bg-green-50 border-green-200' :
                  'bg-orange-50 border-orange-200'
                }`}>
                  <p className={`text-sm font-bold mb-1 ${
                    item.color === 'blue' ? 'text-blue-700' :
                    item.color === 'green' ? 'text-green-700' :
                    'text-orange-700'
                  }`}>{item.icon} {item.type}</p>
                  <p className={`text-xs leading-relaxed ${
                    item.color === 'blue' ? 'text-blue-600' :
                    item.color === 'green' ? 'text-green-600' :
                    'text-orange-600'
                  }`}>{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ステップ3 */}
          <section>
            <h2 className="text-lg font-bold text-gray-800 border-l-4 border-orange-400 pl-3 mb-4">
              ステップ3：当選連絡を待つ
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              応募完了後は、抽選結果を待つだけです。
            </p>
            <div className="space-y-2">
              {[
                { q: '当選通知はどこに来る？', a: 'LINEのトーク画面か、登録したメールアドレスに届きます' },
                { q: '結果はいつわかる？', a: '応募締切から1〜2週間以内が多い。懸賞の詳細ページに記載あり' },
                { q: '落選通知は来る？', a: 'ほとんどの場合、当選者のみに連絡。落選通知はない場合がほとんど' },
                { q: '当選したらどうする？', a: '記載の手順で住所を送信する。期限を過ぎると権利が消えることも' },
              ].map((item) => (
                <div key={item.q} className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-gray-800 text-sm font-medium">Q. {item.q}</p>
                  <p className="text-gray-600 text-xs mt-1">→ {item.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* よくある質問 */}
          <section>
            <h2 className="text-lg font-bold text-gray-800 border-l-4 border-orange-400 pl-3 mb-4">
              よくある疑問
            </h2>
            <div className="space-y-3">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-gray-800 text-sm font-bold mb-1">📱 LINEアカウントは1つでいい？</p>
                <p className="text-gray-600 text-xs leading-relaxed">
                  はい。1つのLINEアカウントで全ての懸賞に応募できます。
                  ただし、同一懸賞への二重応募は規約違反になるので注意。
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-gray-800 text-sm font-bold mb-1">💰 応募に費用はかかる？</p>
                <p className="text-gray-600 text-xs leading-relaxed">
                  完全無料です。LINEアプリがあれば、通信料以外の費用は一切かかりません。
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-gray-800 text-sm font-bold mb-1">🔒 個人情報は大丈夫？</p>
                <p className="text-gray-600 text-xs leading-relaxed">
                  掲載している懸賞は全て企業の公式キャンペーンです。
                  ただし、住所入力が必要な懸賞は、信頼できる企業かどうか確認してから応募しましょう。
                </p>
              </div>
            </div>
          </section>

          {/* まとめ */}
          <section>
            <h2 className="text-lg font-bold text-gray-800 border-l-4 border-orange-400 pl-3 mb-3">
              まとめ
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              LINE懸賞は「友だち追加→応募フォーム→待つ」の3ステップで完了します。
              慣れれば1件1〜2分。毎日10件応募すれば、月に1回は当選が期待できます。
              まずは気軽に1件応募してみましょう！
            </p>
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
