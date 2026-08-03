import { evaluateAllLocationsWithHistory } from '@/lib/kushio'
import KushioDashboard from './KushioDashboard'

export const revalidate = 900 // 15分キャッシュ

export default async function KushioPage() {
  const initial = await evaluateAllLocationsWithHistory()
  return <KushioDashboard initial={initial} />
}
