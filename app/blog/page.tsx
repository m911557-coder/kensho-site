export const metadata = {
  title: 'ブログ｜LINE懸賞のコツ・お役立ち情報',
  description: 'LINE懸賞の当て方・応募のコツ・おすすめ懸賞情報などをお届けするブログです。',
}

const posts = [
  {
    slug: 'won-sui-gin-soda',
    title: '【当選報告】サントリー 翠ジンソーダがファミマのLINEクーポンで当たりました！',
    description: 'ファミリーマートのLINEクーポンで翠ジンソーダ350ml缶が当選！体験談と引換クーポンの使い方を紹介します。',
    date: '2026年6月',
    emoji: '🥂',
    category: '当選報告',
  },
  {
    slug: 'won-asahi-beer',
    title: '【当選報告】アサヒ生ビール マルエフ＆ゴールドが当たりました！',
    description: 'LINE懸賞でアサヒビール2種類に当選！実際の体験談と応募のコツをご紹介します。',
    date: '2026年6月',
    emoji: '🍺',
    category: '当選報告',
  },
  {
    slug: 'what-is-line-kensho',
    title: 'LINE懸賞とは？初心者向けかんたん解説',
    description: 'LINEで応募できる懸賞の仕組み・メリット・応募方法をわかりやすく解説します。',
    date: '2026年6月',
    emoji: '📱',
    category: '基礎知識',
  },
  {
    slug: 'line-kensho-tips',
    title: 'LINE懸賞で当選確率を上げる10のコツ',
    description: '実際に懸賞に当選した経験をもとに、当選確率を上げるための具体的なコツをご紹介します。',
    date: '2026年6月',
    emoji: '🏆',
    category: '攻略法',
  },
  {
    slug: 'how-to-win',
    title: '当選しやすいLINE懸賞の選び方',
    description: '当選者数・締切・応募条件から当たりやすい懸賞を見極める方法を解説します。',
    date: '2026年6月',
    emoji: '🎯',
    category: '攻略法',
  },
]

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-orange-50">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 py-10 px-4 text-center">
        <h1 className="text-3xl font-black text-white">ブログ</h1>
        <p className="text-orange-100 mt-2 text-sm">LINE懸賞のコツ・お役立ち情報</p>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10 space-y-4">
        {posts.map((post) => (
          <a
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block bg-white rounded-2xl shadow-sm p-6 hover:shadow-md hover:border-orange-200 border border-transparent transition"
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl">{post.emoji}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-medium">
                    {post.category}
                  </span>
                  <span className="text-xs text-gray-400">{post.date}</span>
                </div>
                <h2 className="font-bold text-gray-800 text-base mb-1">{post.title}</h2>
                <p className="text-gray-500 text-sm">{post.description}</p>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* フッター */}
      <footer className="bg-gray-800 text-gray-400 mt-4">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <a href="/" className="text-white font-bold flex items-center gap-2">
            <span>🎁</span> LINE懸賞まとめ
          </a>
          <div className="flex gap-4 flex-wrap justify-center">
            <a href="/about" className="text-xs text-gray-500 hover:text-orange-400 transition">運営者情報</a>
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
