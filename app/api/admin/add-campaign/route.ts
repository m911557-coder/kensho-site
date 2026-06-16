import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { password, ...data } = body

  if (password !== process.env.NOTIFY_SECRET) {
    return NextResponse.json({ error: 'パスワードが違います' }, { status: 401 })
  }

  if (!data.title || !data.line_url) {
    return NextResponse.json({ error: 'タイトルとLINE URLは必須です' }, { status: 400 })
  }

  const { error } = await supabase.from('kensho').upsert(
    {
      title: data.title.trim(),
      company: data.company?.trim() || null,
      description: data.description?.trim() || null,
      deadline: data.deadline || null,
      line_url: data.line_url.trim(),
      source_url: data.source_url?.trim() || data.line_url.trim(),
      image_url: null,
      approved: true,
      winners_count: data.winners_count ? parseInt(data.winners_count) : null,
      category: data.category || null,
    },
    { onConflict: 'title', ignoreDuplicates: false }
  )

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
