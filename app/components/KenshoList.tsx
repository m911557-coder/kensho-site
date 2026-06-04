'use client'

import { useState, useMemo } from 'react'
import { Kensho } from '@/lib/supabase'

const CATEGORIES = ['すべて', '食品・飲料', 'ギフトカード', '家電・生活家電', '日用品・コスメ', 'チケット・旅行', 'その他']
const SORT_OPTIONS = [
  { label: '新着順', value: 'newest' },
  { label: '締切が近い順', value: 'deadline' },
  { label: '当選者数が多い順', value: 'winners_desc' },
  { label: '当選者数が少ない順', value: 'winners_asc' },
]
const WINNER_RANGES = [
  { label: 'すべて', min: 0, max: Infinity },
  { label: '〜500名', min: 1, max: 500 },
  { label: '501〜9,999名', min: 501, max: 9999 },
  { label: '10,000名以上', min: 10000, max: Infinity },
]

function DeadlineBadge({ deadline }: { deadline: string | null }) {
  if (!deadline) return null
  const today = new Date()
  const end = new Date(deadline)
  const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  if (diff < 0) return null
  const color = diff <= 3 ? 'bg-red-500' : diff <= 7 ? 'bg-orange-400' : 'bg-gray-400'
  return (
    <span className={`${color} text-white text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap`}>
      {diff === 0 ? '本日締切！' : `残り${diff}日`}
    </span>
  )
}

export default function KenshoList({ items }: { items: Kensho[] }) {
  const [sort, setSort] = useState('newest')
  const [category, setCategory] = useState('すべて')
  const [winnerRange, setWinnerRange] = useState(0)

  const filtered = useMemo(() => {
    let result = [...items]

    // カテゴリーフィルター
    if (category !== 'すべて') {
      result = result.filter((item) => item.category === category)
    }

    // 当選者数フィルター
    const range = WINNER_RANGES[winnerRange]
    if (range.min > 0) {
      result = result.filter(
        (item) => item.winners_count !== null && item.winners_count >= range.min && item.winners_count <= range.max
      )
    }

    // ソート
    result.sort((a, b) => {
      if (sort === 'newest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
      if (sort === 'deadline') {
        if (!a.deadline) return 1
        if (!b.deadline) return -1
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      }
      if (sort === 'winners_desc') {
        return (b.winners_count ?? 0) - (a.winners_count ?? 0)
      }
      if (sort === 'winners_asc') {
        return (a.winners_count ?? 0) - (b.winners_count ?? 0)
      }
      return 0
    })

    return result
  }, [items, sort, category, winnerRange])

  return (
    <section className="max-w-5xl mx-auto px-4 py-10">
      {/* フィルター・ソートUI */}
      <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-5 mb-8">
        <div className="grid gap-5 sm:grid-cols-3">

          {/* ソート */}
          <div>
            <p className="text-xs font-bold text-gray-500 mb-2">📊 並び順</p>
            <div className="flex flex-col gap-1.5">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSort(opt.value)}
                  className={`text-left text-sm px-3 py-1.5 rounded-lg transition ${
                    sort === opt.value
                      ? 'bg-orange-500 text-white font-bold'
                      : 'bg-gray-50 text-gray-600 hover:bg-orange-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 当選者数 */}
          <div>
            <p className="text-xs font-bold text-gray-500 mb-2">🏆 当選者数</p>
            <div className="flex flex-col gap-1.5">
              {WINNER_RANGES.map((r, i) => (
                <button
                  key={i}
                  onClick={() => setWinnerRange(i)}
                  className={`text-left text-sm px-3 py-1.5 rounded-lg transition ${
                    winnerRange === i
                      ? 'bg-orange-500 text-white font-bold'
                      : 'bg-gray-50 text-gray-600 hover:bg-orange-50'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* カテゴリー */}
          <div>
            <p className="text-xs font-bold text-gray-500 mb-2">🏷️ カテゴリー</p>
            <div className="flex flex-col gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`text-left text-sm px-3 py-1.5 rounded-lg transition ${
                    category === cat
                      ? 'bg-orange-500 text-white font-bold'
                      : 'bg-gray-50 text-gray-600 hover:bg-orange-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 件数表示 */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-black text-gray-800">
          🎯 現在開催中の懸賞
        </h2>
        <span className="text-sm text-gray-400">{filtered.length}件表示中</span>
      </div>

      {/* 懸賞カード一覧 */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🔍</p>
          <p>条件に合う懸賞が見つかりませんでした</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-sm border border-orange-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col overflow-hidden"
            >
              <div className="h-1.5 bg-gradient-to-r from-orange-400 to-yellow-400" />
              <div className="p-5 flex flex-col gap-3 flex-1">

                {/* 会社名・残り日数 */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  {item.company && (
                    <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full truncate max-w-[60%]">
                      {item.company}
                    </span>
                  )}
                  <DeadlineBadge deadline={item.deadline} />
                </div>

                {/* タイトル */}
                <h3 className="text-base font-bold text-gray-800 leading-snug">
                  {item.title}
                </h3>

                {/* 当選者数 + カテゴリー */}
                <div className="flex flex-wrap gap-1.5">
                  {item.winners_count !== null && (
                    <span className="text-xs bg-yellow-50 text-yellow-700 border border-yellow-200 px-2 py-0.5 rounded-full font-bold">
                      🏆 {item.winners_count.toLocaleString()}名
                    </span>
                  )}
                  {item.category && (
                    <span className="text-xs bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full">
                      {item.category}
                    </span>
                  )}
                </div>

                {/* 説明 */}
                {item.description && (
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                )}

                {/* 締切日 */}
                {item.deadline && (
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <span>📅</span> 締切：{item.deadline}
                  </p>
                )}

                {/* 応募ボタン */}
                <a
                  href={item.line_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto block text-center bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold py-2.5 px-4 rounded-xl transition shadow-sm shadow-orange-200"
                >
                  🎯 LINEで応募する
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
