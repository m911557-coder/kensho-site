import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'
import webpush from 'web-push'

const resend = new Resend(process.env.RESEND_API_KEY)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || 'mailto:example@example.com',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  )
}

async function sendPushNotifications(subject, bodyText) {
  const { data: subs, error } = await supabase
    .from('kushio_push_subscriptions')
    .select('endpoint, p256dh, auth')

  if (error) {
    console.error(`push購読取得エラー: ${error.message}`)
    return
  }
  if (!subs || subs.length === 0) {
    console.log('push購読者なし。')
    return
  }

  const payload = JSON.stringify({ title: subject, body: bodyText, url: '/kushio' })

  await Promise.all(subs.map(async (s) => {
    const subscription = { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }
    try {
      await webpush.sendNotification(subscription, payload)
    } catch (e) {
      if (e.statusCode === 404 || e.statusCode === 410) {
        // 期限切れ・解除済みの購読は削除
        await supabase.from('kushio_push_subscriptions').delete().eq('endpoint', s.endpoint)
      } else {
        console.error(`push送信エラー(${s.endpoint.slice(-12)}): ${e.message}`)
      }
    }
  }))
  console.log(`push通知送信: ${subs.length}件`)
}

// ────────────────────────────────────────────────────────────────
// 苦潮（貧酸素水塊の湧昇）発生可能性チェック
//
// 過去の実績（2023-2025年、白塚〜松名瀬〜香良洲）を気象データと突き合わせた結果、
// 以下の傾向が確認された:
//   1. 発生時期は8〜9月に集中（7月・10月も可能性あり）
//   2. 強風（最大風速 6.5m/s以上、台風・前線通過を伴うことが多い）が
//      吹いた後、1〜5日以内に風が収まったタイミングで発生しやすい
//   3. 大雨（河川からの淡水流入）も独立したトリガーになりうる
//      （香良洲=櫛田川、松名瀬=雲出川、宮川河口はいずれも河口部）
//   4. 大潮・小潮との明確な相関は見られなかった
//
// 潮回りとの相関がないため考慮せず、季節・風・雨のみでスコアリングする。
// Open-Meteo（APIキー不要）で過去5日間の実績と3日先までの予報を取得。
//
// 【スコア設計上の注意】
// 季節点（8-9月）だけで「中」ラインに達してしまうと、トリガーが
// 無い日でも毎日「要注意」になり実用にならない。そのため季節点は
// 「強風 or 大雨のトリガーが実際に検出された日」だけに加算されるボーナス
// とし、トリガー無しの日は自動的に「低」になるようにしている。
// また強風は直近日ほど重み付けを強くし、1回の強風イベントで
// 「様子見すべき日」が5日間もダラダラ続かないようにしている。
// ────────────────────────────────────────────────────────────────

const PAST_DAYS = 5
const FORECAST_DAYS = 3
const TODAY_IDX = PAST_DAYS // past_days=5 → index0-4が過去、index5が今日

const LOCATIONS = [
  { name: '白塚漁港（津市）', lat: 34.765461, lon: 136.533437 },
  { name: '香良洲海岸（津市・櫛田川河口）', lat: 34.64117, lon: 136.548767 },
  { name: '松名瀬海岸（松阪市・雲出川河口）', lat: 34.604563, lon: 136.582689 },
  { name: '宮川河口・大湊（伊勢市）', lat: 34.529181, lon: 136.735761 },
]

const COMPASS = ['北', '北北東', '北東', '東北東', '東', '東南東', '南東', '南南東', '南', '南南西', '南西', '西南西', '西', '西北西', '北西', '北北西']
function toCompass(deg) {
  if (deg == null) return '不明'
  return COMPASS[Math.round(deg / 22.5) % 16]
}

async function fetchDaily(lat, lon, retried = false) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant,precipitation_sum,temperature_2m_max&timezone=Asia%2FTokyo&past_days=${PAST_DAYS}&forecast_days=${FORECAST_DAYS}&wind_speed_unit=ms`
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(15000) })
    if (!res.ok) throw new Error(`Open-Meteo error ${res.status}`)
    const json = await res.json()
    return json.daily
  } catch (e) {
    if (!retried) {
      console.log(`  リトライ中... (${e.message})`)
      return fetchDaily(lat, lon, true)
    }
    throw e
  }
}

function windBase(w) {
  if (w >= 8) return 35
  if (w >= 6.5) return 25
  if (w >= 5) return 10
  return 0
}

function recencyWeight(daysAgo) {
  if (daysAgo <= 2) return 1.0
  if (daysAgo === 3) return 0.85
  return 0.7 // 4-5日前
}

function evaluate(daily) {
  const pastWind = daily.wind_speed_10m_max.slice(0, TODAY_IDX)
  const pastDates = daily.time.slice(0, TODAY_IDX)
  const pastDirs = daily.wind_direction_10m_dominant.slice(0, TODAY_IDX)

  // 過去5日間で「風の強さ×直近ほど重視」が最大になる日をトリガー日とする
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

  // 強風 or 大雨のトリガーが実際に検出された時だけ季節ボーナスを乗せる
  const hasTrigger = windScore > 0 || rainScore > 0
  let seasonScore = 0
  if (hasTrigger) {
    if (month === 8 || month === 9) seasonScore = 10
    else if (month === 7 || month === 10) seasonScore = 5
  }

  const score = Math.round(Math.min(100, seasonScore + windScore + calmBonus + rainScore))
  let level = '低'
  if (score >= 45) level = '高'
  else if (score >= 20) level = '中'

  // 明日・明後日の予報も一言添える
  const nextWind = daily.wind_speed_10m_max[TODAY_IDX + 1]
  const nextDir = toCompass(daily.wind_direction_10m_dominant[TODAY_IDX + 1])

  return {
    score, level, maxWind, maxWindDate, maxWindDir, daysAgo, windNote,
    todayWind, rain3, calmBonus, nextWind, nextDir,
  }
}

function levelColor(level) {
  if (level === '高') return '#dc2626'
  if (level === '中') return '#d97706'
  return '#6b7280'
}

function buildEmail(results, todayStr) {
  const top = results[0]
  const overallLevel = top.level

  const subject = overallLevel === '高'
    ? `⚠️ 苦潮の可能性【高】${top.name.split('（')[0]}など`
    : overallLevel === '中'
      ? `🔶 苦潮の可能性【中】${top.name.split('（')[0]}など`
      : `📋 本日の苦潮チェック（可能性:低）`

  const rows = results.map(r => `
    <div style="border:1px solid #bae6fd;border-radius:8px;padding:14px;margin-bottom:12px;">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <h3 style="color:#0369a1;margin:0;font-size:15px;">${r.name}</h3>
        <span style="background:${levelColor(r.level)};color:white;padding:3px 10px;border-radius:12px;font-size:12px;font-weight:bold;">${r.level}（${r.score}点）</span>
      </div>
      <p style="margin:8px 0 3px;color:#374151;font-size:13px;">
        直近の強風: ${r.maxWind.toFixed(1)}m/s ${r.windNote}（${r.maxWindDate} / ${r.maxWindDir}、${r.daysAgo}日前）
      </p>
      <p style="margin:3px 0;color:#374151;font-size:13px;">
        本日の風: ${r.todayWind.toFixed(1)}m/s ／ 過去3日間の降水量: ${r.rain3.toFixed(0)}mm
      </p>
      <p style="margin:3px 0;color:#6b7280;font-size:12px;">
        明日の予報: ${r.nextWind.toFixed(1)}m/s ${r.nextDir}
      </p>
    </div>
  `).join('')

  return {
    subject,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;">
        <div style="background:linear-gradient(135deg,#0284c7,#38bdf8);padding:20px;border-radius:12px;text-align:center;margin-bottom:20px;">
          <h1 style="color:white;margin:0;font-size:18px;">🌊 苦潮チェック（${todayStr}）</h1>
          <p style="color:rgba(255,255,255,0.9);margin:6px 0 0;font-size:13px;">白塚漁港〜宮川河口（伊勢湾西岸）</p>
        </div>
        ${rows}
        <p style="color:#9ca3af;font-size:11px;text-align:center;margin-top:16px;">
          ※ 過去の実績（2023〜2025年）と気象傾向から算出した簡易推定です。潮回りとの相関は確認できなかったため考慮していません。実際の可否は現地の水色・臭いなどで最終判断してください。
        </p>
      </div>
    `,
  }
}

async function main() {
  const todayStr = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().split('T')[0]
  console.log(`===== 苦潮チェック開始 ${todayStr} =====`)

  const results = []
  for (const loc of LOCATIONS) {
    try {
      const daily = await fetchDaily(loc.lat, loc.lon)
      const evalResult = evaluate(daily)
      results.push({ name: loc.name, ...evalResult })
      console.log(`${loc.name}: ${evalResult.level}（${evalResult.score}点）`)
    } catch (e) {
      console.error(`${loc.name}: 取得失敗 → ${e.message}`)
    }
  }

  if (results.length === 0) {
    console.log('全地点でデータ取得失敗。終了。')
    return
  }

  results.sort((a, b) => b.score - a.score)

  const shouldNotify = results.some(r => r.level === '中' || r.level === '高')
  if (!shouldNotify) {
    console.log('本日は該当なし（全地点「低」）。送信スキップ。')
    return
  }

  const { subject, html } = buildEmail(results, todayStr)

  const { error } = await resend.emails.send({
    from: '苦潮アラート <onboarding@resend.dev>',
    to: ADMIN_EMAIL,
    subject,
    html,
  })
  if (error) {
    console.error(`メール送信エラー: ${JSON.stringify(error)}`)
    process.exitCode = 1
  } else {
    console.log(`結果メール送信: ${ADMIN_EMAIL}`)
  }

  const top = results[0]
  const pushBody = `${top.name}: ${top.level}（${top.score}点）`
  await sendPushNotifications(subject, pushBody)
}

main().catch(console.error)
