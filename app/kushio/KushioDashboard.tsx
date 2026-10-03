'use client'

import { useCallback, useEffect, useState } from 'react'
import type { DashboardData, DashboardResult } from '@/lib/dashboard'
import type { AmedasLive } from '@/lib/amedas'
import NotifyButton from './NotifyButton'

type ApiResponse = DashboardData

const SIDE_LABEL = { offshore: '沖向き', onshore: '陸向き', along: '沿岸風' } as const
const SIDE_STYLE = {
  offshore: 'bg-emerald-100 text-emerald-700',
  onshore: 'bg-rose-100 text-rose-700',
  along: 'bg-gray-100 text-gray-600',
} as const

function AmedasPanel({ stations, error }: { stations: AmedasLive[] | null; error: boolean }) {
  return (
    <div className="border border-sky-100 rounded-xl p-4 bg-white shadow-sm">
      <h2 className="text-sky-800 font-bold text-[15px]">現在の実測（気象庁アメダス）</h2>
      {error && <p className="text-red-500 text-xs mt-2">実測を取得できませんでした。更新ボタンで再取得できます。</p>}
      {!stations && !error && <p className="text-gray-400 text-xs mt-2">取得中...</p>}
      {stations?.map((s) => (
        <div key={s.id} className="mt-3 pt-3 border-t border-sky-50 first:mt-2 first:pt-0 first:border-t-0">
          <div className="flex justify-between items-baseline">
            <p className="text-sky-800 font-bold text-[14px]">
              {s.name}
              <span className="text-gray-400 font-normal text-[11px] ml-1.5">{s.covers}</span>
            </p>
            <span className="text-gray-400 text-[11px]">{s.time} 時点</span>
          </div>
          <p className="mt-1 text-gray-700 text-[14px]">
            風 <span className="font-bold">{s.wind != null ? `${s.wind.toFixed(1)}m/s` : '不明'}</span> {s.dirName}
            {s.side && (
              <span className={`${SIDE_STYLE[s.side]} ml-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold`}>
                {SIDE_LABEL[s.side]}
              </span>
            )}
            <span className="text-gray-500 text-[12px] ml-2">
              雨 {s.rain1h != null ? `${s.rain1h.toFixed(1)}mm/h` : '-'}
            </span>
          </p>
          <p className="text-gray-400 text-[11px] mt-2 mb-1">直近12時間の推移（1時間ごと）</p>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {s.hours.map((h) => (
              <div key={h.label} className="flex-shrink-0 rounded-lg bg-sky-50 px-2 py-1.5 text-center min-w-[52px]">
                <div className="text-[10px] text-gray-500">{h.label}</div>
                <div className="text-[12px] font-bold text-sky-800">{h.wind != null ? h.wind.toFixed(1) : '-'}</div>
                <div className="text-[10px] text-gray-500">{h.dirName}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <p className="text-gray-400 text-[10px] mt-2 leading-relaxed">
        10分ごとの実測（約20分遅れ）。点数の元データ（Open-Meteo）とは値の大きさが異なります（津は約1.3〜1.7倍、小俣は同程度）。点数には使っていません。
      </p>
    </div>
  )
}

function levelColor(level: string) {
  if (level === '高') return 'bg-red-600'
  if (level === '中') return 'bg-amber-600'
  return 'bg-gray-500'
}

function levelColorSoft(level: string) {
  if (level === '高') return 'bg-red-100 text-red-700'
  if (level === '中') return 'bg-amber-100 text-amber-700'
  return 'bg-gray-100 text-gray-500'
}

function formatMD(dateStr: string) {
  const [, m, d] = dateStr.split('-')
  return `${parseInt(m, 10)}/${parseInt(d, 10)}`
}

function LocationCard({ r }: { r: DashboardResult }) {
  const jmaToday = r.jma?.days[r.jma.days.length - 1]
  return (
    <div className="border border-sky-100 rounded-xl p-4 bg-white shadow-sm">
      <div className="flex justify-between items-center">
        <h3 className="text-sky-800 font-bold text-[15px]">{r.name}</h3>
        <span className={`${levelColor(r.level)} text-white px-3 py-1 rounded-full text-xs font-bold`}>
          {r.level}（{r.score}点）
        </span>
      </div>
      {r.jma && (
        <p className="mt-1.5 text-right text-[12px] text-gray-500">
          気象庁版（実験中）：
          {jmaToday?.level != null ? (
            <span className={`${levelColorSoft(jmaToday.level)} ml-1 px-2 py-0.5 rounded-full font-bold`}>
              {jmaToday.level}（{jmaToday.score}点）
            </span>
          ) : (
            <span className="ml-1">算出できません</span>
          )}
        </p>
      )}
      <p className="mt-2 text-gray-600 text-[13px]">
        直近の強風: {r.maxWind.toFixed(1)}m/s {r.windNote}（{r.maxWindDate} / {r.maxWindDir}、{r.daysAgo}日前）
      </p>
      <p className="text-gray-600 text-[13px] mt-1">
        本日の風: {r.todayWind.toFixed(1)}m/s（夜間平均: {r.eveningWind != null ? `${r.eveningWind.toFixed(1)}m/s` : '不明'}） ／ 過去3日間の降水量: {r.rain3.toFixed(0)}mm
      </p>
      <p className="text-gray-400 text-xs mt-1">
        明日の予報: {r.nextWind.toFixed(1)}m/s {r.nextDir}
      </p>

      <div className="mt-3 pt-3 border-t border-sky-50">
        <p className="text-gray-400 text-[11px] mb-1.5">過去7日間〜今後の予報</p>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {r.history.map((h) => (
            <div
              key={h.date}
              className={`${levelColorSoft(h.level)} flex-shrink-0 rounded-lg px-2 py-1.5 text-center min-w-[46px]`}
            >
              <div className="text-[10px] opacity-70">{formatMD(h.date)}</div>
              <div className="text-[12px] font-bold">{h.score}</div>
            </div>
          ))}
          {r.forecast.map((h) => (
            <div
              key={h.date}
              className={`${levelColorSoft(h.level)} flex-shrink-0 rounded-lg px-2 py-1.5 text-center min-w-[46px] border border-dashed border-current opacity-70`}
            >
              <div className="text-[10px] opacity-70">{formatMD(h.date)}予報</div>
              <div className="text-[12px] font-bold">{h.score}</div>
            </div>
          ))}
        </div>
      </div>

      {r.jma && (
        <div className="mt-3 pt-3 border-t border-sky-50">
          <p className="text-gray-400 text-[11px] mb-1.5">
            気象庁版（実験中・{r.jma.station}の実測ベース）の過去7日間
          </p>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {r.jma.days.map((d) => (
              <div
                key={d.date}
                className={`${d.level ? levelColorSoft(d.level) : 'bg-gray-50 text-gray-300'} flex-shrink-0 rounded-lg px-2 py-1.5 text-center min-w-[46px]`}
              >
                <div className="text-[10px] opacity-70">{formatMD(d.date)}</div>
                <div className="text-[12px] font-bold">{d.score ?? '-'}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function KushioDashboard({ initial }: { initial: ApiResponse }) {
  const [data, setData] = useState<ApiResponse>(initial)
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [amedas, setAmedas] = useState<AmedasLive[] | null>(null)
  const [amedasError, setAmedasError] = useState(false)

  const loadAmedas = useCallback(async () => {
    try {
      const res = await fetch('/api/amedas', { cache: 'no-store' })
      if (!res.ok) throw new Error('failed')
      const json: { stations: AmedasLive[] } = await res.json()
      return json.stations
    } catch {
      return null
    }
  }, [])

  const applyAmedas = useCallback((stations: AmedasLive[] | null) => {
    if (stations) setAmedas(stations)
    setAmedasError(stations == null)
  }, [])

  useEffect(() => {
    let alive = true
    loadAmedas().then((stations) => {
      if (alive) applyAmedas(stations)
    })
    return () => {
      alive = false
    }
  }, [loadAmedas, applyAmedas])

  async function handleRefresh() {
    setStatus('loading')
    try {
      const [res, stations] = await Promise.all([fetch('/api/kushio', { cache: 'no-store' }), loadAmedas()])
      applyAmedas(stations)
      if (!res.ok) throw new Error('failed')
      const json: ApiResponse = await res.json()
      setData(json)
      setStatus('idle')
    } catch {
      setStatus('error')
    }
  }

  return (
    <main className="min-h-screen bg-sky-50 pb-16">
      <div className="bg-gradient-to-br from-sky-600 to-sky-400 px-6 py-10 text-center">
        <h1 className="text-white text-xl font-bold">🌊 苦潮チェック（{data.todayStr}）</h1>
        <p className="text-sky-100 text-sm mt-1">白塚漁港〜宮川河口（伊勢湾西岸）</p>
      </div>

      <div className="max-w-lg mx-auto px-4 mt-6 space-y-3">
        <button
          onClick={handleRefresh}
          disabled={status === 'loading'}
          className="w-full bg-white border border-sky-200 text-sky-700 font-bold py-2.5 rounded-xl disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {status === 'loading' ? (
            '更新中...'
          ) : (
            <>🔄 最新データに更新</>
          )}
        </button>
        {status === 'error' && (
          <p className="text-center text-red-500 text-xs">更新に失敗しました。時間をおいて再度お試しください。</p>
        )}

        <AmedasPanel stations={amedas} error={amedasError} />

        {data.results.length === 0 && (
          <p className="text-center text-gray-500 text-sm py-8">データ取得に失敗しました。時間をおいて再度お試しください。</p>
        )}
        {data.results.map((r) => (
          <LocationCard key={r.name} r={r} />
        ))}

        <NotifyButton />

        <p className="text-gray-400 text-[11px] text-center mt-4 leading-relaxed">
          ※ 気象庁版は、津・小俣の実測と当日昼の風から作った実験用の点数です。今の点数と見分ける力に大きな差は確認できておらず、通知には使っていません。夜の凪は、過去日は実測、今日は予報で判定しています。予報日の分はありません。
        </p>

        <p className="text-gray-400 text-[11px] text-center mt-2 leading-relaxed">
          ※ 過去の実績（2023〜2025年）と気象傾向から算出した簡易推定です。潮回りとの相関は確認できなかったため考慮していません。実際の可否は現地の水色・臭いなどで最終判断してください。
        </p>

        <div className="border-t border-sky-100 mt-4 pt-4">
          <p className="text-gray-400 text-[11px] text-center mb-2">参考情報</p>
          <ul className="text-center text-[12px] space-y-1">
            <li>
              <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer" className="text-sky-600 underline">
                Open-Meteo
              </a>
              <span className="text-gray-400">（このアプリの気象データ提供元）</span>
            </li>
            <li>
              <a href="https://tide.chowari.jp/24/242012/" target="_blank" rel="noopener noreferrer" className="text-sky-600 underline">
                潮見表（津市）
              </a>
            </li>
            <li>
              <a href="https://www.jma.go.jp/bosai/amedas/#area_type=offices&area_code=240000&format=table1h&elems=53000" target="_blank" rel="noopener noreferrer" className="text-sky-600 underline">
                気象庁 アメダス（津）実測値
              </a>
            </li>
          </ul>
        </div>
      </div>
    </main>
  )
}
