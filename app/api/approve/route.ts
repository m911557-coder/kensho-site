import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')

  if (!token) {
    return new NextResponse('トークンがありません', { status: 400 })
  }

  let candidates
  try {
    candidates = JSON.parse(Buffer.from(token, 'base64url').toString())
  } catch {
    return new NextResponse('トークンが無効です', { status: 400 })
  }

  // 偽データ除外（プレースホルダーURLや不正なline_urlをブロック）
  const isValidLineUrl = (url: string) =>
    !!url &&
    !/x{4,}/i.test(url) &&
    /^https:\/\/(lin\.ee\/|line\.me\/|liff\.line\.me\/|page\.line\.me\/)/.test(url)

  type Candidate = {
    title: string
    company?: string
    description?: string
    deadline?: string
    line_url: string
    source_url?: string
    winners_count?: number
    category?: string
  }

  const validCandidates = (candidates as Candidate[]).filter(
    (c) => isValidLineUrl(c.line_url) && c.deadline !== '2026-12-31'
  )

  if (validCandidates.length === 0) {
    return new NextResponse(`
      <html><head><meta charset="utf-8"></head><body style="font-family:sans-serif;text-align:center;padding:60px;">
        <h2>⚠️ 追加できる有効な懸賞がありませんでした</h2>
        <p style="color:#6b7280;">URLが不正、または架空のデータのため追加されませんでした。</p>
      </body></html>
    `, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
  }

  // DBに一括追加（重複タイトルはスキップ）
  const items = validCandidates.map((item) => ({
    title: item.title,
    company: item.company || null,
    description: item.description || null,
    deadline: item.deadline || null,
    line_url: item.line_url,
    image_url: null,
    approved: true,
    source_url: item.source_url || item.line_url,
    winners_count: item.winners_count || null,
    category: item.category || null,
  }))

  const { data, error } = await supabase
    .from('kensho')
    .upsert(items, { onConflict: 'title', ignoreDuplicates: true })
    .select()

  if (error) {
    return new NextResponse(`
      <html><head><meta charset="utf-8"></head><body style="font-family:sans-serif;text-align:center;padding:60px;">
        <h2>❌ エラーが発生しました</h2>
        <p>${error.message}</p>
      </body></html>
    `, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
  }

  const added = data?.length ?? 0
  const skipped = items.length - added

  return new NextResponse(`
    <html><head><meta charset="utf-8"></head><body style="font-family:sans-serif;text-align:center;padding:60px;background:#fff7ed;">
      <div style="max-width:500px;margin:0 auto;">
        <div style="font-size:60px;margin-bottom:20px;">${added > 0 ? '🎉' : '✅'}</div>
        <h2 style="color:#c2410c;">${added}件の懸賞を追加しました！</h2>
        ${skipped > 0 ? `<p style="color:#9ca3af;font-size:13px;">（${skipped}件はすでに登録済みのためスキップ）</p>` : ''}
        <p style="color:#6b7280;">サイトに反映されました。</p>
        <a href="https://kensho-site.vercel.app"
           style="display:inline-block;margin-top:20px;background:linear-gradient(135deg,#f97316,#fb923c);color:white;padding:12px 30px;border-radius:50px;text-decoration:none;font-weight:bold;">
          サイトを確認する →
        </a>
      </div>
    </body></html>
  `, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
}
