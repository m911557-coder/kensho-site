import { getDashboardData } from '@/lib/dashboard'
import KushioDashboard from './KushioDashboard'

export const revalidate = 900 // 15分キャッシュ

export default async function KushioPage() {
  const initial = await getDashboardData(false)
  return <KushioDashboard initial={initial} />
}
