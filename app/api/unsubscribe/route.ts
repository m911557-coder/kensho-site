import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')

  if (!token) {
    return NextResponse.json({ error: 'トークンがありません' }, { status: 400 })
  }

  const { error } = await supabase
    .from('subscribers')
    .delete()
    .eq('unsubscribe_token', token)

  if (error) {
    return NextResponse.json({ error: '解除に失敗しました' }, { status: 500 })
  }

  return new NextResponse(`
    <html><body style="font-family:sans-serif;text-align:center;padding:60px;">
      <h2>✅ 配信停止が完了しました</h2>
      <p>今後はメールが届かなくなります。</p>
      <a href="https://kensho-site.vercel.app" style="color:#f97316;">トップページへ戻る</a>
    </body></html>
  `, { headers: { 'Content-Type': 'text/html' } })
}
