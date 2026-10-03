import { supabase } from '@/lib/supabase'
import { fetchRecentHourly } from '@/lib/amedas'
import { directionMultiplier, recencyWeight, type LocationResultWithHistory } from '@/lib/kushio'

// ────────────────────────────────────────────────────────────────
// 気象庁アメダスの実測で作る「実験中」の2つ目の点数。通知には使わない。
//
// 計算の形は今の点数と同じ（過去5日のトリガー風、風向き、夜の凪、季節、雨）。
// 違いは次の2点。
//  1. 風は津・小俣の実測（時刻ちょうどの値）を使う
//  2. 当日の昼（6〜17時）の実測も、トリガー候補（重み1.0）に加える
//     → 2026-10-01のように、風が当日に強まった日を拾うため
//
// 風の基準は、今のOpen-Meteoの基準（5.3/6.5/8m/s、凪3.5m/s）と
// 「強さの出現頻度が同じ」になるよう換算した値。結果（釣果）は見ずに決めた。
// （2025/7/30-9/30と2026/7/6-10/1の各観測所で、実測とOpen-Meteoを比較）
//
// 夜の凪: 過去日は実測の20時〜翌1時の平均で判定する。当日は夜がまだ来ていないため
// 今の点数と同じOpen-Meteoの夜の予報を使い、基準は換算前の3.5m/sをそのまま使う
// （頻度合わせの定義上、これが実測の基準と同等）。
//
// 検証結果（2026-10-03、7/30以降の18件）: 今の点数と見分ける力に有意な差はない
// （0.55 対 0.63、誤差は約0.13）。「実験中」として表示だけ行う。
// ────────────────────────────────────────────────────────────────

type Thresholds = { t1: number; t2: number; t3: number; calm: number }

const STATIONS: Record<string, { id: string; name: string; t: Thresholds }> = {
  tsu: { id: '53133', name: '津', t: { t1: 7.2, t2: 9.1, t3: 9.9, calm: 4.2 } },
  obata: { id: '53196', name: '小俣', t: { t1: 4.9, t2: 6.2, t3: 7.8, calm: 2.3 } },
}

const stationOf = (locationName: string) => (/松名瀬|宮川/.test(locationName) ? 'obata' : 'tsu')

type Pt = { wind: number | null; dir: number | null; rain: number | null }
type Obs = Map<number, Pt>

const HOUR = 3600e3
const DAY = 24 * HOUR
const dayStart = (d: string) => Date.parse(`${d}T00:00:00+09:00`)
const addDay = (d: string, n: number) => new Date(dayStart(d) + n * DAY + 9 * HOUR).toISOString().slice(0, 10)
// 気象庁の1時間値の表と同じ並び（h=1〜24、24時は翌日0時）
const at = (o: Obs, d: string, h: number) => o.get(dayStart(d) + h * HOUR)

const toNum = (v: unknown) => (v == null ? null : Number(v))

async function loadObs(stationId: string, fresh: boolean): Promise<Obs> {
  const m: Obs = new Map()
  // 保存済みの実測（毎日6:10に保存）
  try {
    const since = new Date(Date.now() - 14 * DAY).toISOString()
    for (let from = 0; ; from += 1000) {
      const { data, error } = await supabase
        .from('amedas_obs')
        .select('obs_time,wind,wind_dir,precip_1h')
        .eq('station', stationId)
        .gte('obs_time', since)
        .order('obs_time')
        .range(from, from + 999)
      if (error || !data) break
      for (const r of data) {
        const ms = Date.parse(r.obs_time)
        if (ms % HOUR === 0) m.set(ms, { wind: toNum(r.wind), dir: toNum(r.wind_dir), rain: toNum(r.precip_1h) })
      }
      if (data.length < 1000) break
    }
  } catch {
    // 保存分が読めなくても、直近の実測だけで続行する
  }
  // 保存後に増えた直近分は、気象庁から直接取って補う
  try {
    for (const p of await fetchRecentHourly(stationId, 36, fresh)) {
      const old = m.get(p.ms)
      m.set(p.ms, { wind: p.wind ?? old?.wind ?? null, dir: p.dir ?? old?.dir ?? null, rain: p.rain1h ?? old?.rain ?? null })
    }
  } catch {
    // 取得できなければ保存分だけで続行する
  }
  return m
}

function dayMax(o: Obs, d: string, h0 = 1, h1 = 24) {
  let best: { w: number; dir: number | null } | null = null
  for (let h = h0; h <= h1; h++) {
    const p = at(o, d, h)
    if (p?.wind != null && (!best || p.wind > best.w)) best = { w: p.wind, dir: p.dir }
  }
  return best
}

function dayRain(o: Obs, d: string): number | null {
  let sum = 0
  let n = 0
  for (let h = 1; h <= 24; h++) {
    const r = at(o, d, h)?.rain
    if (r != null) {
      sum += r
      n++
    }
  }
  return n ? sum : null
}

function evening(o: Obs, d: string): number | null {
  const v = [20, 21, 22, 23, 24]
    .map((h) => at(o, d, h)?.wind)
    .concat(at(o, addDay(d, 1), 1)?.wind)
    .filter((x): x is number => x != null)
  return v.length >= 4 ? v.reduce((a, b) => a + b, 0) / v.length : null
}

export type JmaDay = { date: string; score: number | null; level: '低' | '中' | '高' | null }
export type JmaInfo = { station: string; days: JmaDay[] }

function scoreDay(o: Obs, stKey: string, d: string, today: string, omEvening: number | null): JmaDay {
  const empty: JmaDay = { date: d, score: null, level: null }
  const T = STATIONS[stKey].t
  const base = (w: number) => (w >= T.t3 ? 35 : w >= T.t2 ? 25 : w >= T.t1 ? 10 : 0)

  let best = 0
  let have = 0
  for (let i = 5; i >= 1; i--) {
    const m = dayMax(o, addDay(d, -i))
    if (!m) continue
    have++
    best = Math.max(best, base(m.w) * recencyWeight(i) * directionMultiplier(m.dir))
  }
  if (have < 4) return empty // 過去5日のうち4日以上の実測が無ければ出さない

  const sameDay = dayMax(o, d, 6, 17)
  if (sameDay) best = Math.max(best, base(sameDay.w) * directionMultiplier(sameDay.dir))

  let rain3 = 0
  for (let i = 1; i <= 3; i++) rain3 += dayRain(o, addDay(d, -i)) ?? 0

  const isToday = d === today
  const eve = isToday ? omEvening : evening(o, d)
  const calmLimit = isToday ? 3.5 : T.calm
  const calm = best > 0 && eve != null && eve <= calmLimit ? 30 : 0

  let rain = 0
  let penalty = 0
  if (rain3 >= 20 && rain3 < 30) rain = 10
  if (rain3 >= 30) penalty = -40

  const month = parseInt(d.split('-')[1], 10)
  const season = best > 0 || rain > 0 ? (month === 8 || month === 9 ? 10 : month === 7 || month === 10 ? 5 : 0) : 0

  const score = Math.round(Math.max(0, Math.min(100, season + best + calm + rain + penalty)))
  return { date: d, score, level: score >= 45 ? '高' : score >= 20 ? '中' : '低' }
}

// 各地点の結果に、気象庁版の点数（今日と過去6日）を付ける
export async function computeJma(
  todayStr: string,
  results: LocationResultWithHistory[],
  fresh = true
): Promise<Map<string, JmaInfo>> {
  const out = new Map<string, JmaInfo>()
  try {
    const keys = [...new Set(results.map((r) => stationOf(r.name)))]
    const loaded = await Promise.all(keys.map(async (k) => [k, await loadObs(STATIONS[k].id, fresh)] as const))
    const obs = new Map(loaded)
    for (const r of results) {
      const k = stationOf(r.name)
      const o = obs.get(k)
      if (!o) continue
      const days: JmaDay[] = []
      for (let n = 6; n >= 0; n--) days.push(scoreDay(o, k, addDay(todayStr, -n), todayStr, r.eveningWind))
      out.set(r.name, { station: STATIONS[k].name, days })
    }
  } catch {
    // 気象庁版が作れなくても、今の点数の表示は止めない
  }
  return out
}
