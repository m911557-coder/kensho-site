import { supabase, Kensho } from '@/lib/supabase'
import KenshoList from './components/KenshoList'

export const revalidate = 300

async function getKenshoList(): Promise<Kensho[]> {
  const { data } = await supabase
    .from('kensho')
    .select('*')
    .eq('approved', true)
    .order('created_at', { ascending: false })
  return data ?? []
}

export default async function Home() {
  const list = await getKenshoList()

  return (
    <main className="min-h-screen bg-orange-50">

      {/* ヒーローセクション */}
      <section className="relative overflow-hidden">
        {/* 背景写真 */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1600&q=80"
            alt="プレゼント・ギフト"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/80 to-orange-400/60" />
        </div>

        {/* ヘッダーナビ */}
        <div className="relative z-10 flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎁</span>
            <span className="text-white font-black text-xl tracking-wide">LINE懸賞まとめ</span>
          </div>
          <div className="text-white/80 text-sm hidden sm:block">
            毎日更新中！
          </div>
        </div>

        {/* ヒーローコンテンツ */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 sm:py-24">
          <p className="text-orange-200 font-bold text-sm mb-2 tracking-widest uppercase">LINE応募限定</p>
          <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight mb-4">
            当てよう！<br />
            <span className="text-yellow-300">豪華賞品</span>
          </h1>
          <p className="text-white/90 text-lg mb-8 max-w-md">
            ハワイ旅行・最新家電・ギフトカード…<br />
            LINEで簡単応募できる懸賞を毎日集めています
          </p>
          <div className="flex flex-wrap gap-3">
            {['✈️ 旅行', '📱 家電', '🛒 ギフトカード', '🍺 食品・飲料', '🎫 チケット'].map((tag) => (
              <span key={tag} className="bg-white/20 backdrop-blur text-white text-sm px-3 py-1 rounded-full border border-white/30">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* 波形の区切り */}
        <div className="relative z-10">
          <svg viewBox="0 0 1440 60" className="w-full block" preserveAspectRatio="none">
            <path d="M0,60 C360,0 1080,0 1440,60 L1440,60 L0,60 Z" fill="#fff7ed" />
          </svg>
        </div>
      </section>

      {/* 統計バー */}
      <section className="bg-white border-b border-orange-100">
        <div className="max-w-5xl mx-auto px-6 py-4 flex flex-wrap gap-6 justify-center sm:justify-start">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-orange-500">{list.length}</span>
            <span className="text-gray-500 text-sm">件掲載中</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-orange-500">毎日</span>
            <span className="text-gray-500 text-sm">自動更新</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-orange-500">無料</span>
            <span className="text-gray-500 text-sm">で応募できる</span>
          </div>
        </div>
      </section>

      {/* 懸賞一覧（フィルター・ソート付き） */}
      <KenshoList items={list} />

      {/* フッター */}
      <footer className="bg-gray-800 text-gray-400 mt-16">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🎁</span>
            <span className="text-white font-bold">LINE懸賞まとめ</span>
          </div>
          <p className="text-sm mb-4">LINEで応募できる懸賞情報を毎日自動収集・掲載しています。</p>
          <p className="text-xs text-gray-500">
            掲載している懸賞情報は各社の公式キャンペーンです。応募・当選に関するお問い合わせは各企業へお願いします。
          </p>
          <div className="flex gap-4 mt-6">
            <a href="/privacy" className="text-xs text-gray-500 hover:text-orange-400 transition">
              プライバシーポリシー
            </a>
          </div>
          <p className="text-xs text-gray-600 mt-3">© 2026 LINE懸賞まとめ</p>
        </div>
      </footer>
    </main>
  )
}
