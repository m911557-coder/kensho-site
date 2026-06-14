export const metadata = {
  title: 'お問い合わせ',
  description: 'LINE懸賞まとめへのお問い合わせページです。',
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-orange-50">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 py-10 px-4 text-center">
        <h1 className="text-3xl font-black text-white">お問い合わせ</h1>
        <p className="text-orange-100 mt-2 text-sm">Contact</p>
      </div>

      {/* 本文 */}
      <div className="max-w-2xl mx-auto px-6 py-12 bg-white my-8 rounded-2xl shadow-sm">

        <p className="text-gray-600 text-sm mb-8 leading-relaxed">
          LINE懸賞まとめへのご意見・ご要望・掲載情報に関するお問い合わせは、
          以下のSNSアカウントよりお気軽にDMをお送りください。
        </p>

        <div className="space-y-4">
          <a
            href="https://x.com/line_kensho_m"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-orange-300 hover:bg-orange-50 transition"
          >
            <span className="text-2xl">🐦</span>
            <div>
              <p className="font-bold text-gray-800 text-sm">X（旧Twitter）</p>
              <p className="text-orange-500 text-sm">@line_kensho_m</p>
            </div>
          </a>

          <a
            href="https://www.instagram.com/line_kensho_matome/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-orange-300 hover:bg-orange-50 transition"
          >
            <span className="text-2xl">📸</span>
            <div>
              <p className="font-bold text-gray-800 text-sm">Instagram</p>
              <p className="text-orange-500 text-sm">@line_kensho_matome</p>
            </div>
          </a>
        </div>

        <div className="mt-10 p-4 bg-orange-50 rounded-xl">
          <p className="text-xs text-gray-500 leading-relaxed">
            ※ 懸賞の応募方法・当選に関するお問い合わせは、各キャンペーン主催企業へ直接お問い合わせください。<br />
            ※ 掲載情報の削除依頼・誤情報のご連絡はSNSのDMにてお受けしています。
          </p>
        </div>
      </div>

      {/* フッター */}
      <footer className="bg-gray-800 text-gray-400 mt-4">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <a href="/" className="text-white font-bold flex items-center gap-2">
            <span>🎁</span> LINE懸賞まとめ
          </a>
          <div className="flex gap-4">
            <a href="/privacy" className="text-xs text-gray-500 hover:text-orange-400 transition">プライバシーポリシー</a>
            <a href="/contact" className="text-xs text-gray-500 hover:text-orange-400 transition">お問い合わせ</a>
          </div>
          <p className="text-xs text-gray-600">© 2026 LINE懸賞まとめ</p>
        </div>
      </footer>
    </main>
  )
}
