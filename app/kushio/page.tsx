import { evaluateAllLocations, LocationResult } from '@/lib/kushio'
import NotifyButton from './NotifyButton'

export const revalidate = 900 // 15分キャッシュ

function levelColor(level: string) {
  if (level === '高') return 'bg-red-600'
  if (level === '中') return 'bg-amber-600'
  return 'bg-gray-500'
}

function LocationCard({ r }: { r: LocationResult }) {
  return (
    <div className="border border-sky-100 rounded-xl p-4 bg-white shadow-sm">
      <div className="flex justify-between items-center">
        <h3 className="text-sky-800 font-bold text-[15px]">{r.name}</h3>
        <span className={`${levelColor(r.level)} text-white px-3 py-1 rounded-full text-xs font-bold`}>
          {r.level}（{r.score}点）
        </span>
      </div>
      <p className="mt-2 text-gray-600 text-[13px]">
        直近の強風: {r.maxWind.toFixed(1)}m/s {r.windNote}（{r.maxWindDate} / {r.maxWindDir}、{r.daysAgo}日前）
      </p>
      <p className="text-gray-600 text-[13px] mt-1">
        本日の風: {r.todayWind.toFixed(1)}m/s ／ 過去3日間の降水量: {r.rain3.toFixed(0)}mm
      </p>
      <p className="text-gray-400 text-xs mt-1">
        明日の予報: {r.nextWind.toFixed(1)}m/s {r.nextDir}
      </p>
    </div>
  )
}

export default async function KushioPage() {
  const { todayStr, results } = await evaluateAllLocations()

  return (
    <main className="min-h-screen bg-sky-50 pb-16">
      <div className="bg-gradient-to-br from-sky-600 to-sky-400 px-6 py-10 text-center">
        <h1 className="text-white text-xl font-bold">🌊 苦潮チェック（{todayStr}）</h1>
        <p className="text-sky-100 text-sm mt-1">白塚漁港〜宮川河口（伊勢湾西岸）</p>
      </div>

      <div className="max-w-lg mx-auto px-4 mt-6 space-y-3">
        {results.length === 0 && (
          <p className="text-center text-gray-500 text-sm py-8">データ取得に失敗しました。時間をおいて再度お試しください。</p>
        )}
        {results.map((r) => (
          <LocationCard key={r.name} r={r} />
        ))}

        <NotifyButton />

        <p className="text-gray-400 text-[11px] text-center mt-4 leading-relaxed">
          ※ 過去の実績（2023〜2025年）と気象傾向から算出した簡易推定です。潮回りとの相関は確認できなかったため考慮していません。実際の可否は現地の水色・臭いなどで最終判断してください。
        </p>
      </div>
    </main>
  )
}
