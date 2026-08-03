// ────────────────────────────────────────────────────────────────
// 苦潮（貧酸素水塊の湧昇）判定ロジック
// scripts/kushio-alert.mjs のスコアリングと同じロジック（TypeScript版）。
// ダッシュボード表示用に共通化。アルゴリズムを変更する場合は
// scripts/kushio-alert.mjs 側も合わせて更新すること。
//
// 【凪ボーナスの判定方法について】
// 日最大風速は日中の風に引っ張られやすく、実際に出かける夜間
// （21時台〜）が穏やかでも見逃すことがあった（2026-07-30/31の実績、
// 週間を通して6.5m/s台を超えなかったが夜は1.9〜3.5m/sまで凪いでいて
// 実際に苦潮・大漁だった）。そのため凪ボーナスは日最大風速の比率では
// なく、当日夜（20時〜翌1時）の時間別風速の平均が穏やかかどうかを
// 直接見て判定する。
// ────────────────────────────────────────────────────────────────

export const PAST_DAYS = 5
export const FORECAST_DAYS = 3
export const TODAY_IDX = PAST_DAYS

// 過去7日分の履歴を表示するために必要な取得日数
// （履歴の一番古い日もPAST_DAYS分の遡り評価が必要なため）
export const HISTORY_DAYS = 7
export const HISTORY_PAST_DAYS = PAST_DAYS + HISTORY_DAYS - 1

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

export type HourlyData = {
  time: string[]
  wind_speed_10m: number[]
}

export type WeatherData = {
  daily: DailyData
  hourly: HourlyData
}

export async function fetchWeather(lat: number, lon: number, pastDays: number = PAST_DAYS, retried = false): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant,precipitation_sum,temperature_2m_max&hourly=wind_speed_10m&timezone=Asia%2FTokyo&past_days=${pastDays}&forecast_days=${FORECAST_DAYS}&wind_speed_unit=ms`
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(15000) })
    if (!res.ok) throw new Error(`Open-Meteo error ${res.status}`)
    const json = await res.json()
    return { daily: json.daily, hourly: json.hourly }
  } catch (e) {
    if (!retried) {
      return fetchWeather(lat, lon, pastDays, true)
    }
    throw e
  }
}

// その日の夜（20時〜翌1時）の平均風速。実際に夜間に出かける際の
// 凪具合を、日中の値に引っ張られる日最大風速より直接的に見るための指標。
function eveningAvgWind(hourly: HourlyData, todayStr: string): number | null {
  const next = new Date(todayStr + 'T00:00:00Z')
  next.setUTCDate(next.getUTCDate() + 1)
  const nextStr = next.toISOString().split('T')[0]
  const hoursWanted = [
    `${todayStr}T20:00`, `${todayStr}T21:00`, `${todayStr}T22:00`, `${todayStr}T23:00`,
    `${nextStr}T00:00`, `${nextStr}T01:00`,
  ]
  const values = hoursWanted
    .map((h) => {
      const idx = hourly.time.indexOf(h)
      return idx >= 0 ? hourly.wind_speed_10m[idx] : null
    })
    .filter((v): v is number => v != null)
  if (values.length === 0) return null
  return values.reduce((a, b) => a + b, 0) / values.length
}

function windBase(w: number): number {
  if (w >= 8) return 35
  if (w >= 6.5) return 25
  if (w >= 5.3) return 10
  return 0
}

function recencyWeight(daysAgo: number): number {
  if (daysAgo <= 2) return 1.0
  if (daysAgo === 3) return 0.85
  return 0.7 // 4-5日前
}

export type EvalResult = {
  date: string
  score: number
  level: '低' | '中' | '高'
  maxWind: number
  maxWindDate: string
  maxWindDir: string
  daysAgo: number
  windNote: string
  todayWind: number
  eveningWind: number | null
  rain3: number
  calmBonus: number
  nextWind: number
  nextDir: string
}

export function evaluate(daily: DailyData, hourly: HourlyData, todayIdx: number = TODAY_IDX): EvalResult {
  const pastWind = daily.wind_speed_10m_max.slice(todayIdx - PAST_DAYS, todayIdx)
  const pastDates = daily.time.slice(todayIdx - PAST_DAYS, todayIdx)
  const pastDirs = daily.wind_direction_10m_dominant.slice(todayIdx - PAST_DAYS, todayIdx)

  let maxWind = -1, maxIdx = -1, bestWeighted = -1
  pastWind.forEach((w, i) => {
    const daysAgo = PAST_DAYS - i
    const weighted = windBase(w) * recencyWeight(daysAgo)
    if (weighted > bestWeighted) { bestWeighted = weighted; maxWind = w; maxIdx = i }
  })
  const daysAgo = PAST_DAYS - maxIdx
  const maxWindDate = pastDates[maxIdx]
  const maxWindDir = toCompass(pastDirs[maxIdx])
  const windNote = maxWind >= 8 ? '強風(台風・前線級)' : maxWind >= 6.5 ? '強風' : maxWind >= 5 ? 'やや強い風' : '穏やか'
  const windScore = bestWeighted

  const todayWind = daily.wind_speed_10m_max[todayIdx]
  const rain3 = daily.precipitation_sum.slice(Math.max(0, todayIdx - 3), todayIdx).reduce((a, b) => a + b, 0)
  const todayStr = daily.time[todayIdx]
  const month = parseInt(todayStr.split('-')[1], 10)

  // 日中の風に引っ張られる日最大風速ではなく、実際に出かける夜間帯
  // （20時〜翌1時）が穏やかかどうかを直接見て凪ボーナスを判定する
  const eveningWind = eveningAvgWind(hourly, todayStr)
  let calmBonus = 0
  if (windScore > 0 && eveningWind != null && eveningWind <= 3.5) {
    calmBonus = 30
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

  const nextWind = daily.wind_speed_10m_max[todayIdx + 1]
  const nextDir = toCompass(daily.wind_direction_10m_dominant[todayIdx + 1])

  return {
    date: todayStr, score, level, maxWind, maxWindDate, maxWindDir, daysAgo, windNote,
    todayWind, eveningWind, rain3, calmBonus, nextWind, nextDir,
  }
}

export type LocationResult = EvalResult & { name: string }

export async function evaluateAllLocations(): Promise<{ todayStr: string; results: LocationResult[] }> {
  const results: LocationResult[] = []
  for (const loc of LOCATIONS) {
    try {
      const { daily, hourly } = await fetchWeather(loc.lat, loc.lon)
      const evalResult = evaluate(daily, hourly)
      results.push({ name: loc.name, ...evalResult })
    } catch {
      // 取得失敗した地点はスキップ
    }
  }
  results.sort((a, b) => b.score - a.score)
  const todayStr = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().split('T')[0]
  return { todayStr, results }
}

export type HistoryDay = {
  date: string
  score: number
  level: '低' | '中' | '高'
}

export type LocationResultWithHistory = LocationResult & { history: HistoryDay[] }

// 現在値に加えて、過去HISTORY_DAYS日分（今日を含む）のスコア推移も返す
export async function evaluateAllLocationsWithHistory(): Promise<{ todayStr: string; results: LocationResultWithHistory[] }> {
  const results: LocationResultWithHistory[] = []
  for (const loc of LOCATIONS) {
    try {
      const { daily, hourly } = await fetchWeather(loc.lat, loc.lon, HISTORY_PAST_DAYS)
      const todayIdx = HISTORY_PAST_DAYS
      const current = evaluate(daily, hourly, todayIdx)
      const history: HistoryDay[] = []
      for (let idx = todayIdx - (HISTORY_DAYS - 1); idx <= todayIdx; idx++) {
        const r = evaluate(daily, hourly, idx)
        history.push({ date: r.date, score: r.score, level: r.level })
      }
      results.push({ name: loc.name, ...current, history })
    } catch {
      // 取得失敗した地点はスキップ
    }
  }
  results.sort((a, b) => b.score - a.score)
  const todayStr = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().split('T')[0]
  return { todayStr, results }
}
