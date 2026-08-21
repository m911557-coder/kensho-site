import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)
const resend = new Resend(process.env.RESEND_API_KEY)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const SITE_URL = process.env.SITE_URL || 'https://kensho-site.vercel.app'

async function runChecks() {
  const jst = new Date(Date.now() + 9 * 60 * 60 * 1000)
  const today = jst.toISOString().split('T')[0]
  const timeStr = jst.toISOString().replace('T', ' ').slice(0, 16) + ' JST'
  const results = []

  // ── チェック1: サイト応答 ──
  try {
    const start = Date.now()
    const res = await fetch(SITE_URL, { signal: AbortSignal.timeout(10000) })
    const ms = Date.now() - start
    if (!res.ok) {
      results.push({ level: 'error', label: 'サイト応答', detail: `HTTP ${res.status}（正常でない応答コード）` })
    } else if (ms > 5000) {
      results.push({ level: 'warn', label: '応答速度', detail: `${ms}ms（5秒超え、要確認）` })
    } else {
      results.push({ level: 'ok', label: 'サイト応答', detail: `HTTP ${res.status}（${ms}ms）` })
    }
  } catch (e) {
    results.push({ level: 'error', label: 'サイト応答', detail: `接続失敗: ${e.message}` })
  }

  // ── チェック2: キャンペーン数 ──
  const { data: campaigns, error: dbError } = await supabase
    .from('kensho')
    .select('id, title, deadline, approved')
    .eq('approved', true)

  if (dbError) {
    results.push({ level: 'error', label: 'DB接続', detail: `Supabase接続エラー: ${dbError.message}` })
  } else {
    const count = campaigns.length
    if (count < 5) {
      results.push({ level: 'error', label: 'キャンペーン数', detail: `${count}件（極端に少ない、要確認）` })
    } else if (count < 15) {
      results.push({ level: 'warn', label: 'キャンペーン数', detail: `${count}件（少なめ）` })
    } else {
      results.push({ level: 'ok', label: 'キャンペーン数', detail: `${count}件掲載中` })
    }

    // ── チェック3: 期限切れ残存 ──
    const expired = campaigns.filter(c => c.deadline && c.deadline < today)
    if (expired.length > 0) {
      results.push({
        level: 'warn',
        label: '期限切れ残存',
        detail: `${expired.length}件が期限切れのまま掲載中:\n${expired.map(c => `  ・${c.title}（${c.deadline}）`).join('\n')}`
      })
    } else {
      results.push({ level: 'ok', label: '期限切れ', detail: '期限切れキャンペーンなし' })
    }

    // ── チェック4: 締め切り間近（3日以内） ──
    const threeDaysLater = new Date(Date.now() + 9 * 60 * 60 * 1000 + 3 * 24 * 60 * 60 * 1000)
      .toISOString().split('T')[0]
    const soonExpiring = campaigns.filter(c => c.deadline && c.deadline >= today && c.deadline <= threeDaysLater)
    if (soonExpiring.length > 0) {
      results.push({
        level: 'info',
        label: '締め切り間近',
        detail: `${soonExpiring.length}件が3日以内に終了:\n${soonExpiring.map(c => `  ・${c.title}（${c.deadline}）`).join('\n')}`
      })
    }
  }

  return { results, timeStr }
}

async function sendAlert(results, timeStr) {
  const hasError = results.some(r => r.level === 'error')
  const hasWarn = results.some(r => r.level === 'warn')

  // 正常時はメール送信しない（エラー・警告時のみ）
  if (!hasError && !hasWarn) {
    console.log('✅ 全チェック正常 - メール送信なし')
    return
  }

  const levelIcon = { ok: '✅', warn: '⚠️', error: '🚨', info: 'ℹ️' }
  const levelColor = { ok: '#22c55e', warn: '#f59e0b', error: '#ef4444', info: '#3b82f6' }

  const rows = results.map(r => `
    <div style="border-left:4px solid ${levelColor[r.level]};padding:10px 14px;margin-bottom:10px;background:#f9fafb;border-radius:0 6px 6px 0;">
      <span style="font-weight:bold;color:${levelColor[r.level]}">${levelIcon[r.level]} ${r.label}</span>
      <p style="margin:4px 0 0;font-size:13px;color:#374151;white-space:pre-line">${r.detail}</p>
    </div>
  `).join('')

  await resend.emails.send({
    from: 'LINE懸賞まとめ <onboarding@resend.dev>',
    to: ADMIN_EMAIL,
    subject: hasError
      ? `🚨 【要対応】サイト監視アラート - ${timeStr}`
      : `⚠️ 【確認推奨】サイト監視レポート - ${timeStr}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;">
        <div style="background:${hasError ? '#ef4444' : '#f59e0b'};padding:16px 20px;border-radius:10px;margin-bottom:20px;">
          <h1 style="color:white;margin:0;font-size:17px;">
            ${hasError ? '🚨 サイトに問題が検出されました' : '⚠️ サイト監視レポート'}
          </h1>
          <p style="color:rgba(255,255,255,0.9);margin:6px 0 0;font-size:13px;">${timeStr} 時点</p>
        </div>
        ${rows}
        <div style="text-align:center;margin:20px 0;">
          <a href="${SITE_URL}" style="background:#f97316;color:white;padding:12px 28px;border-radius:50px;text-decoration:none;font-weight:bold;margin-right:10px;">
            サイトを確認 →
          </a>
        </div>
        <p style="font-size:11px;color:#9ca3af;text-align:center;">この監視メールは6時間ごとに自動チェックしています。</p>
      </div>
    `
  })
  console.log(`アラートメール送信: ${ADMIN_EMAIL}`)
}

async function main() {
  console.log('===== サイト監視開始 =====')
  const { results, timeStr } = await runChecks()

  results.forEach(r => {
    const icon = { ok: '✅', warn: '⚠️', error: '🚨', info: 'ℹ️' }[r.level]
    console.log(`${icon} ${r.label}: ${r.detail.split('\n')[0]}`)
  })

  await sendAlert(results, timeStr)
  console.log('===== 監視完了 =====')

  // エラーがあればプロセスを失敗として終了（GitHub Actionsで赤く表示）
  if (results.some(r => r.level === 'error')) process.exit(1)
}

main().catch(e => {
  console.error('監視スクリプトエラー:', e)
  process.exit(1)
})
