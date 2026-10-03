import { evaluateAllLocationsWithHistory, type LocationResultWithHistory } from '@/lib/kushio'
import { computeJma, type JmaInfo } from '@/lib/jmascore'

export type DashboardResult = LocationResultWithHistory & { jma: JmaInfo | null }
export type DashboardData = { todayStr: string; results: DashboardResult[] }

// ダッシュボード用: 今の点数に、実験中の気象庁版の点数を付けて返す。
// fresh=false（ページ表示）は15分キャッシュ、fresh=true（更新ボタン）は常に最新の実測を取る
export async function getDashboardData(fresh = true): Promise<DashboardData> {
  const { todayStr, results } = await evaluateAllLocationsWithHistory()
  const jma = await computeJma(todayStr, results, fresh)
  return { todayStr, results: results.map((r) => ({ ...r, jma: jma.get(r.name) ?? null })) }
}
