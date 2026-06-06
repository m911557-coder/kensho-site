import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  // セキュリティチェック
  const secret = req.headers.get('x-notify-secret')
  if (secret !== process.env.NOTIFY_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { kensho } = await req.json()

  // 全登録者を取得
  const { data: subscribers, error } = await supabase
    .from('subscribers')
    .select('email, unsubscribe_token')

  if (error || !subscribers || subscribers.length === 0) {
    return NextResponse.json({ message: '登録者なし' })
  }

  const siteUrl = 'https://kensho-site.vercel.app'

  // 一斉送信（Resendのバッチ送信）
  const emails = subscribers.map((s) => ({
    from: 'LINE懸賞まとめ <onboarding@resend.dev>',
    to: s.email,
    subject: `🎁 新着懸賞：${kensho.title}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #f97316, #fb923c); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
          <h1 style="color: white; margin: 0; font-size: 22px;">🎁 新着懸賞のお知らせ</h1>
        </div>

        <div style="border: 2px solid #fed7aa; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
          <h2 style="color: #c2410c; font-size: 18px; margin: 0 0 12px;">${kensho.title}</h2>
          ${kensho.company ? `<p style="color:#6b7280; font-size:13px; margin:4px 0;">🏢 ${kensho.company}</p>` : ''}
          ${kensho.winners_count ? `<p style="color:#6b7280; font-size:13px; margin:4px 0;">🏆 当選者数：<strong style="color:#f97316;">${kensho.winners_count.toLocaleString()}名</strong></p>` : ''}
          ${kensho.deadline ? `<p style="color:#6b7280; font-size:13px; margin:4px 0;">📅 締切：${kensho.deadline}</p>` : ''}
          ${kensho.description ? `<p style="color:#374151; font-size:14px; margin:12px 0 0; line-height:1.6;">${kensho.description}</p>` : ''}
        </div>

        <div style="text-align:center; margin: 24px 0;">
          <a href="${kensho.line_url}" style="background: linear-gradient(135deg, #06c755, #00b44c); color: white; padding: 14px 32px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">
            📱 LINEで応募する
          </a>
        </div>

        <div style="text-align:center; margin: 12px 0 24px;">
          <a href="${siteUrl}" style="color: #f97316; font-size: 14px;">他の懸賞もチェック →</a>
        </div>

        <p style="color: #9ca3af; font-size: 11px; text-align:center; border-top: 1px solid #e5e7eb; padding-top: 16px;">
          このメールはLINE懸賞まとめの新着通知です。<br>
          <a href="${siteUrl}/api/unsubscribe?token=${s.unsubscribe_token}" style="color:#9ca3af;">配信停止はこちら</a>
          &nbsp;｜&nbsp;© 2026 LINE懸賞まとめ
        </p>
      </div>
    `,
  }))

  // 100件ずつバッチ送信
  let sent = 0
  for (let i = 0; i < emails.length; i += 100) {
    const batch = emails.slice(i, i + 100)
    await resend.batch.send(batch)
    sent += batch.length
  }

  return NextResponse.json({ success: true, sent })
}
