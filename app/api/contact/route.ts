import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const { name, email, category, rating, message } = await req.json()

  if (!message || message.trim().length < 5) {
    return NextResponse.json({ error: 'メッセージを入力してください' }, { status: 400 })
  }

  const ratingText = rating ? `⭐ 評価: ${'★'.repeat(Number(rating))}${'☆'.repeat(5 - Number(rating))} (${rating}/5)\n` : ''

  try {
    await resend.emails.send({
      from: 'LINE懸賞まとめ <onboarding@resend.dev>',
      to: process.env.ADMIN_EMAIL!,
      subject: `【お問い合わせ】${category} - ${name || '匿名'}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;">
          <div style="background:linear-gradient(135deg,#f97316,#fb923c);padding:20px;border-radius:12px;text-align:center;margin-bottom:20px;">
            <h1 style="color:white;margin:0;font-size:18px;">📬 新しいお問い合わせ</h1>
          </div>
          <div style="background:#fff7ed;border-radius:12px;padding:20px;margin-bottom:16px;">
            <table style="width:100%;border-collapse:collapse;font-size:14px;">
              <tr><td style="padding:8px 0;color:#6b7280;width:120px;">種別</td><td style="padding:8px 0;font-weight:bold;color:#374151;">${category}</td></tr>
              ${rating ? `<tr><td style="padding:8px 0;color:#6b7280;">評価</td><td style="padding:8px 0;color:#f97316;font-size:18px;">${'★'.repeat(Number(rating))}${'☆'.repeat(5 - Number(rating))}</td></tr>` : ''}
              <tr><td style="padding:8px 0;color:#6b7280;">お名前</td><td style="padding:8px 0;color:#374151;">${name || '匿名'}</td></tr>
              <tr><td style="padding:8px 0;color:#6b7280;">メール</td><td style="padding:8px 0;color:#374151;">${email || '未入力'}</td></tr>
            </table>
          </div>
          <div style="background:white;border:1px solid #fed7aa;border-radius:12px;padding:20px;">
            <p style="color:#6b7280;font-size:12px;margin:0 0 8px;">メッセージ</p>
            <p style="color:#374151;font-size:14px;line-height:1.8;white-space:pre-wrap;">${message}</p>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: 'メール送信に失敗しました' }, { status: 500 })
  }
}
