import { fetchAmedasLive } from '@/lib/amedas'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const stations = await fetchAmedasLive()
    return NextResponse.json({ stations })
  } catch {
    return NextResponse.json({ error: '実測の取得に失敗しました' }, { status: 500 })
  }
}
