import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'メールアドレスが無効です' }, { status: 400 })
  }

  // Supabaseに登録
  const { error } = await supabase
    .from('subscribers')
    .insert({ email })

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'すでに登録されています' }, { status: 409 })
    }
    return NextResponse.json({ error: '登録に失敗しました' }, { status: 500 })
  }

  // 登録完了メールを送信
  await resend.emails.send({
    from: 'LINE懸賞まとめ <onboarding@resend.dev>',
    to: email,
    subject: '【LINE懸賞まとめ】新着通知の登録が完了しました🎁',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #f97316, #fb923c); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🎁 LINE懸賞まとめ</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0;">新着通知の登録が完了しました！</p>
        </div>
        <p style="color: #374151; font-size: 16px;">登録ありがとうございます！</p>
        <p style="color: #374151; font-size: 15px; line-height: 1.7;">
          新しいLINE懸賞が追加されたら、いち早くメールでお知らせします。<br>
          当選者数が多い大型キャンペーンも見逃しません！
        </p>
        <div style="background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <p style="margin: 0; color: #c2410c; font-size: 14px;">
            📌 懸賞は締切が早いものも多いので、通知が届いたらお早めにご確認ください！
          </p>
        </div>
        <p style="color: #9ca3af; font-size: 12px; margin-top: 30px;">
          通知が不要になった場合は、今後届くメールの「配信停止」リンクからいつでも解除できます。<br>
          © 2026 LINE懸賞まとめ
        </p>
      </div>
    `,
  })

  return NextResponse.json({ success: true })
}
