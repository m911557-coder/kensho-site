import { toCompass, windSide } from '@/lib/kushio'

// 気象庁アメダスの現在の実測（10分ごと、約20分遅れ）。
// 松阪には観測所が無いため、北の津と南の小俣（伊勢市）で切り分ける。
export const AMEDAS_STATIONS = [
  { id: '53133', name: '津', covers: '白塚・御殿場・香良洲' },
  { id: '53196', name: '小俣', covers: '松名瀬・宮川河口' },
]

const BASE = 'https://www.jma.go.jp/bosai/amedas/data'
const HOURS_BACK = 12
const H = 3600e3

type Raw = Record<string, unknown>
type Records = Record<string, Raw>

export type AmedasHour = {
  label: string
  wind: number | null
  dir: number | null
  dirName: string
  rain: number
}

export type AmedasLive = {
  id: string
  name: string
  covers: string
  time: string
  wind: number | null
  dir: number | null
  dirName: string
  side: 'offshore' | 'onshore' | 'along' | null
  rain1h: number | null
  temp: number | null
  hours: AmedasHour[]
}

// 値は [値, 品質フラグ]。フラグが0（正常）の時だけ採用する
function val(o: Raw, key: string): number | null {
  const a = o[key]
  if (Array.isArray(a) && a[1] === 0 && typeof a[0] === 'number') return a[0]
  return null
}

// 風向コード: 1=北北東 ... 16=北、0=静穏
function dirDeg(o: Raw): number | null {
  const c = val(o, 'windDirection')
  return c == null || c === 0 ? null : (c * 22.5) % 360
}

async function getJson(url: string): Promise<Records> {
  const res = await fetch(url, { signal: AbortSignal.timeout(10000), cache: 'no-store' })
  if (res.status === 404) return {}
  if (!res.ok) throw new Error(`アメダス取得エラー ${res.status}`)
  return res.json()
}

function jst(ms: number) {
  const d = new Date(ms + 9 * H)
  return { ymd: d.toISOString().slice(0, 10).replace(/-/g, ''), hh: d.getUTCHours() }
}

const keyToMs = (k: string) =>
  Date.parse(`${k.slice(0, 4)}-${k.slice(4, 6)}-${k.slice(6, 8)}T${k.slice(8, 10)}:${k.slice(10, 12)}:00+09:00`)

async function fetchStation(st: (typeof AMEDAS_STATIONS)[number], latestMs: number): Promise<AmedasLive> {
  const files = new Set<string>()
  for (let t = 0; t <= HOURS_BACK; t += 3) {
    const { ymd, hh } = jst(latestMs - t * H)
    files.add(`${ymd}_${String(Math.floor(hh / 3) * 3).padStart(2, '0')}`)
  }
  const blocks = await Promise.all([...files].map((f) => getJson(`${BASE}/point/${st.id}/${f}.json`)))
  const recs: Records = Object.assign({}, ...blocks)

  const cutoff = latestMs - HOURS_BACK * H
  const keys = Object.keys(recs)
    .sort()
    .filter((k) => keyToMs(k) > cutoff)
  const latestKey = [...keys].reverse().find((k) => val(recs[k], 'wind') != null)
  if (!latestKey) throw new Error(`${st.name}: 実測なし`)
  const last = recs[latestKey]

  const byHour = new Map<string, string[]>()
  for (const k of keys) {
    const h = k.slice(0, 10)
    byHour.set(h, [...(byHour.get(h) ?? []), k])
  }
  const hours: AmedasHour[] = [...byHour.entries()].map(([h, ks]) => {
    const winds = ks.map((k) => val(recs[k], 'wind')).filter((v): v is number => v != null)
    const peak = ks
      .filter((k) => val(recs[k], 'wind') != null)
      .sort((a, b) => (val(recs[b], 'wind') ?? 0) - (val(recs[a], 'wind') ?? 0))[0]
    const deg = peak ? dirDeg(recs[peak]) : null
    return {
      label: `${parseInt(h.slice(8, 10), 10)}時`,
      wind: winds.length ? winds.reduce((a, b) => a + b, 0) / winds.length : null,
      dir: deg,
      dirName: deg == null ? '静穏' : toCompass(deg),
      rain: ks.reduce((s, k) => s + (val(recs[k], 'precipitation10m') ?? 0), 0),
    }
  })

  const deg = dirDeg(last)
  return {
    id: st.id,
    name: st.name,
    covers: st.covers,
    time: `${latestKey.slice(8, 10)}:${latestKey.slice(10, 12)}`,
    wind: val(last, 'wind'),
    dir: deg,
    dirName: deg == null ? '静穏' : toCompass(deg),
    side: windSide(deg),
    rain1h: val(last, 'precipitation1h'),
    temp: val(last, 'temp'),
    hours,
  }
}

export async function fetchAmedasLive(): Promise<AmedasLive[]> {
  const res = await fetch(`${BASE}/latest_time.txt`, { signal: AbortSignal.timeout(10000), cache: 'no-store' })
  if (!res.ok) throw new Error(`アメダス取得エラー ${res.status}`)
  const latestMs = Date.parse((await res.text()).trim())
  const settled = await Promise.allSettled(AMEDAS_STATIONS.map((s) => fetchStation(s, latestMs)))
  const ok = settled.filter((r): r is PromiseFulfilledResult<AmedasLive> => r.status === 'fulfilled').map((r) => r.value)
  if (ok.length === 0) throw new Error('アメダスの実測を取得できませんでした')
  return ok
}
