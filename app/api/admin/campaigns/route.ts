import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin as supabase } from '@/lib/supabase-admin'
import { isAdminSecret } from '@/lib/admin-auth'

export async function POST(req: NextRequest) {
  const { password, action, id } = await req.json()

  if (!isAdminSecret(password)) {
    return NextResponse.json({ error: 'パスワードが違います' }, { status: 401 })
  }

  if (action === 'list') {
    const { data, error } = await supabase
      .from('kensho')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ items: data })
  }

  if (typeof id !== 'number') {
    return NextResponse.json({ error: 'id が必要です' }, { status: 400 })
  }

  const { error } =
    action === 'approve'
      ? await supabase.from('kensho').update({ approved: true }).eq('id', id)
      : action === 'delete'
        ? await supabase.from('kensho').delete().eq('id', id)
        : { error: { message: '不明な操作です' } }

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}
