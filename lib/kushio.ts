// ────────────────────────────────────────────────────────────────
// 苦潮（貧酸素水塊の湧昇）判定ロジック
// scripts/kushio-alert.mjs のスコアリングと同じロジック（TypeScript版）。
// ダッシュボード表示用に共通化。アルゴリズムを変更する場合は
// scripts/kushio-alert.mjs 側も合わせて更新すること。
// ────────────────────────────────────────────────────────────────

export const PAST_DAYS = 5
export const FORECAST_DAYS = 3
export const TODAY_IDX = PAST_DAYS

export type Location = {
  name: string
  lat: number
  lon: number
}

export const LOCATIONS: Location[] = [
  { name: '白塚漁港（津市）', lat: 34.765461, lon: 136.533437 },
  { name: '香良洲海岸（津市・櫛田川河口）', lat: 34.64117, lon: 136.548767 },
  { name: '松名瀬海岸（松阪市・雲出川河口）', lat: 34.604563, lon: 136.582689 },
  { name: '宮川河口・大湊（伊勢市）', lat: 34.529181, lon: 136.735761 },
]

const COMPASS = ['北', '北北東', '北東', '東北東', '東', '東南東', '南東', '南南東', '南', '南南西', '南西', '西南西', '西', '西北西', '北西', '北北西']

export function toCompass(deg: number | null | undefined): string {
  if (deg == null) return '不明'
  return COMPASS[Math.round(deg / 22.5) % 16]
}

export type DailyData = {
  time: string[]
  wind_speed_10m_max: number[]
  wind_gusts_10m_max: number[]
  wind_direction_10m_dominant: number[]
  precipitation_sum: number[]
  temperature_2m_max: number[]
}

export async function fetchDaily(lat: number, lon: number, retried = false): Promise<DailyData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant,precipitation_sum,temperature_2m_max&timezone=Asia%2FTokyo&past_days=${PAST_DAYS}&forecast_days=${FORECAST_DAYS}&wind_speed_unit=ms`
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(15000) })
    if (!res.ok) throw new Error(`Open-Meteo error ${res.status}`)
    const json = await res.json()
    return json.daily
  } catch (e) {
    if (!retried) {
      return fetchDaily(lat, lon, true)
    }
    throw e
  }
}

function windBase(w: number): number {
  if (w >= 8) return 35
  if (w >= 6.5) return 25
  if (w >= 5) return 10
  return 0
}

function recencyWeight(daysAgo: number): number {
  if (daysAgo <= 2) return 1.0
  if (daysAgo === 3) return 0.85
  return 0.7 // 4-5日前
}

export type EvalResult = {
  score: number
  level: '低' | '中' | '高'
  maxWind: number
  maxWindDate: string
  maxWindDir: string
  daysAgo: number
  windNote: string
  todayWind: number
  rain3: number
  calmBonus: number
  nextWind: number
  nextDir: string
}

export function evaluate(daily: DailyData): EvalResult {
  const pastWind = daily.wind_speed_10m_max.slice(0, TODAY_IDX)
  const pastDates = daily.time.slice(0, TODAY_IDX)
  const pastDirs = daily.wind_direction_10m_dominant.slice(0, TODAY_IDX)

  let maxWind = -1, maxIdx = -1, bestWeighted = -1
  pastWind.forEach((w, i) => {
    const daysAgo = TODAY_IDX - i
    const weighted = windBase(w) * recencyWeight(daysAgo)
    if (weighted > bestWeighted) { bestWeighted = weighted; maxWind = w; maxIdx = i }
  })
  const daysAgo = TODAY_IDX - maxIdx
  const maxWindDate = pastDates[maxIdx]
  const maxWindDir = toCompass(pastDirs[maxIdx])
  const windNote = maxWind >= 8 ? '強風(台風・前線級)' : maxWind >= 6.5 ? '強風' : maxWind >= 5 ? 'やや強い風' : '穏やか'
  const windScore = bestWeighted

  const todayWind = daily.wind_speed_10m_max[TODAY_IDX]
  const rain3 = daily.precipitation_sum.slice(Math.max(0, TODAY_IDX - 3), TODAY_IDX).reduce((a, b) => a + b, 0)
  const todayStr = daily.time[TODAY_IDX]
  const month = parseInt(todayStr.split('-')[1], 10)

  let calmBonus = 0
  if (maxWind >= 6.5 && daysAgo >= 1 && daysAgo <= 5 && todayWind <= maxWind * 0.65) {
    calmBonus = 20
  }

  let rainScore = 0
  if (rain3 >= 50) rainScore = 20
  else if (rain3 >= 20) rainScore = 10

  const hasTrigger = windScore > 0 || rainScore > 0
  let seasonScore = 0
  if (hasTrigger) {
    if (month === 8 || month === 9) seasonScore = 10
    else if (month === 7 || month === 10) seasonScore = 5
  }

  const score = Math.round(Math.min(100, seasonScore + windScore + calmBonus + rainScore))
  let level: '低' | '中' | '高' = '低'
  if (score >= 45) level = '高'
  else if (score >= 20) level = '中'

  const nextWind = daily.wind_speed_10m_max[TODAY_IDX + 1]
  const nextDir = toCompass(daily.wind_direction_10m_dominant[TODAY_IDX + 1])

  return {
    score, level, maxWind, maxWindDate, maxWindDir, daysAgo, windNote,
    todayWind, rain3, calmBonus, nextWind, nextDir,
  }
}

export type LocationResult = EvalResult & { name: string }

export async function evaluateAllLocations(): Promise<{ todayStr: string; results: LocationResult[] }> {
  const results: LocationResult[] = []
  for (const loc of LOCATIONS) {
    try {
      const daily = await fetchDaily(loc.lat, loc.lon)
      const evalResult = evaluate(daily)
      results.push({ name: loc.name, ...evalResult })
    } catch {
      // 取得失敗した地点はスキップ
    }
  }
  results.sort((a, b) => b.score - a.score)
  const todayStr = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().split('T')[0]
  return { todayStr, results }
}
