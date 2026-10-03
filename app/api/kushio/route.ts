import { getDashboardData } from '@/lib/dashboard'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const data = await getDashboardData()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'データ取得に失敗しました' }, { status: 500 })
  }
}
