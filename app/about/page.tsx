export const metadata = {
  title: '運営者情報・サイトについて',
  description: 'LINE懸賞まとめの運営者情報とサイトのご紹介です。',
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-orange-50">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 py-10 px-4 text-center">
        <h1 className="text-3xl font-black text-white">運営者情報</h1>
        <p className="text-orange-100 mt-2 text-sm">About</p>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12 space-y-6">

        {/* サイトについて */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>🎁</span> このサイトについて
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            「LINE懸賞まとめ」は、LINEで応募できる懸賞・プレゼントキャンペーン情報を毎日収集・掲載している情報サイトです。
          </p>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            飲料・食品・ギフトカード・家電・旅行など、さまざまなジャンルの懸賞を締切順・当選者数順でかんたんに絞り込めます。
            LINEを使って気軽に応募できる懸賞だけを厳選して掲載しています。
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">
            運営者自身も懸賞に積極的に応募しており、実際にアサヒビール（マルエフ・ゴールド）に当選した経験をもとに、
            本当に応募価値のある懸賞情報をお届けすることを目指しています。
          </p>
        </div>

        {/* 運営者情報 */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>👤</span> 運営者
          </h2>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-3 text-gray-500 w-32">サイト名</td>
                <td className="py-3 text-gray-800 font-medium">LINE懸賞まとめ</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-500">運営者</td>
                <td className="py-3 text-gray-800">個人運営</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-500">開設</td>
                <td className="py-3 text-gray-800">2026年5月</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-500">目的</td>
                <td className="py-3 text-gray-800">LINE懸賞情報の収集・発信</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-500">X</td>
                <td className="py-3">
                  <a href="https://x.com/line_kensho_m" target="_blank" rel="noopener noreferrer"
                     className="text-orange-500 hover:underline">@line_kensho_m</a>
                </td>
              </tr>
              <tr>
                <td className="py-3 text-gray-500">Instagram</td>
                <td className="py-3">
                  <a href="https://www.instagram.com/line_kensho_matome/" target="_blank" rel="noopener noreferrer"
                     className="text-orange-500 hover:underline">@line_kensho_matome</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 免責事項 */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>📋</span> 免責事項
          </h2>
          <ul className="text-gray-600 text-sm leading-relaxed space-y-2 list-disc list-inside">
            <li>掲載している懸賞情報は各企業・団体の公式キャンペーン情報です</li>
            <li>応募・当選に関するお問い合わせは各キャンペーン主催者へ直接お願いします</li>
            <li>掲載情報の正確性には万全を期していますが、締切・内容が変更される場合があります</li>
            <li>当サイトは各キャンペーンの主催者ではなく、情報提供のみを目的としています</li>
          </ul>
        </div>

      </div>

      {/* フッター */}
      <footer className="bg-gray-800 text-gray-400 mt-4">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <a href="/" className="text-white font-bold flex items-center gap-2">
            <span>🎁</span> LINE懸賞まとめ
          </a>
          <div className="flex gap-4 flex-wrap justify-center">
            <a href="/about" className="text-xs text-gray-500 hover:text-orange-400 transition">運営者情報</a>
            <a href="/privacy" className="text-xs text-gray-500 hover:text-orange-400 transition">プライバシーポリシー</a>
            <a href="/contact" className="text-xs text-gray-500 hover:text-orange-400 transition">お問い合わせ</a>
          </div>
          <p className="text-xs text-gray-600">© 2026 LINE懸賞まとめ</p>
        </div>
      </footer>
    </main>
  )
}
