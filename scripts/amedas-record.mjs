import { createClient } from '@supabase/supabase-js'

// 気象庁アメダスの実測（10分ごと）をSupabaseに蓄積する。
// 気象庁側は約2週間分しか残らないため、毎日保存して検証用の履歴にする。
//   node scripts/amedas-record.mjs --days=3   直近3日分を保存（通常運用）
//   node scripts/amedas-record.mjs --days=14  初回の遡り保存
//   node scripts/amedas-record.mjs --dry      保存せず取得内容だけ確認

// 松阪には観測所が無いため、北の津と南の小俣（伊勢市）で切り分ける
const STATIONS = [
  { id: '53133', name: '津' },
  { id: '53196', name: '小俣' },
]
const BLOCKS = ['00', '03', '06', '09', '12', '15', '18', '21']

const args = process.argv.slice(2)
const DRY = args.includes('--dry')
const daysArg = args.find((a) => a.startsWith('--days='))
const DAYS = daysArg ? parseInt(daysArg.split('=')[1], 10) : 3

function jstDate(daysAgo) {
  const d = new Date(Date.now() + 9 * 60 * 60 * 1000)
  d.setUTCDate(d.getUTCDate() - daysAgo)
  return d.toISOString().slice(0, 10).replace(/-/g, '')
}

// 値は [値, 品質フラグ]。フラグが0（正常）の時だけ採用する
const val = (o, key) => {
  const a = o?.[key]
  return Array.isArray(a) && a[1] === 0 && a[0] != null ? a[0] : null
}

function toRow(station, key, o) {
  const iso = `${key.slice(0, 4)}-${key.slice(4, 6)}-${key.slice(6, 8)}T${key.slice(8, 10)}:${key.slice(10, 12)}:${key.slice(12, 14)}+09:00`
  const dir = val(o, 'windDirection') // 1=北北東 ... 16=北、0=静穏
  return {
    station,
    obs_time: iso,
    wind: val(o, 'wind'),
    wind_dir: dir == null || dir === 0 ? null : (dir * 22.5) % 360,
    gust: val(o, 'gust'),
    precip_10m: val(o, 'precipitation10m'),
    precip_1h: val(o, 'precipitation1h'),
    temp: val(o, 'temp'),
    pressure: val(o, 'pressure'),
  }
}

async function fetchBlock(station, date, block) {
  const url = `https://www.jma.go.jp/bosai/amedas/data/point/${station}/${date}_${block}.json`
  const res = await fetch(url, { signal: AbortSignal.timeout(15000) })
  if (res.status === 404) return {} // まだ無い時間帯、または保存期間切れ
  if (!res.ok) throw new Error(`アメダス取得エラー ${res.status} (${url})`)
  return res.json()
}

async function collect() {
  const rows = []
  for (const st of STATIONS) {
    for (let n = DAYS - 1; n >= 0; n--) {
      const date = jstDate(n)
      let count = 0
      for (const block of BLOCKS) {
        const data = await fetchBlock(st.id, date, block)
        for (const [key, o] of Object.entries(data)) {
          rows.push(toRow(st.id, key, o))
          count++
        }
      }
      console.log(`${st.name} ${date}: ${count}件`)
    }
  }
  return rows
}

async function main() {
  const rows = await collect()
  console.log(`取得合計: ${rows.length}件`)
  if (rows.length === 0) {
    console.log('保存対象なし。')
    return
  }
  if (DRY) {
    console.log('--dry のため保存しません。先頭:', JSON.stringify(rows[0]))
    console.log('末尾:', JSON.stringify(rows[rows.length - 1]))
    return
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  // 観測値は後から変わらないので、既にある行は上書きせず無視する
  for (let i = 0; i < rows.length; i += 500) {
    const { error } = await supabase
      .from('amedas_obs')
      .upsert(rows.slice(i, i + 500), { onConflict: 'station,obs_time', ignoreDuplicates: true })
    if (error) {
      console.error(`保存エラー: ${error.message}`)
      process.exitCode = 1
      return
    }
  }
  console.log(`保存完了: ${rows.length}件（既存分は無視）`)
}

main().catch((e) => {
  console.error(e.message)
  process.exitCode = 1
})
