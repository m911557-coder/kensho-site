import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function cleanupExpired() {
  const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD

  // 締切日が今日より前のものを取得
  const { data: expired, error: fetchError } = await supabase
    .from('kensho')
    .select('id, title, deadline')
    .lt('deadline', today)
    .not('deadline', 'is', null)

  if (fetchError) {
    console.error('取得エラー:', fetchError.message)
    return
  }

  if (!expired || expired.length === 0) {
    console.log('期限切れのキャンペーンはありません')
    return
  }

  console.log(`期限切れ ${expired.length}件を削除します：`)
  expired.forEach(d => console.log(`  - [${d.deadline}] ${d.title}`))

  // 削除実行
  const { error: deleteError } = await supabase
    .from('kensho')
    .delete()
    .lt('deadline', today)
    .not('deadline', 'is', null)

  if (deleteError) {
    console.error('削除エラー:', deleteError.message)
    return
  }

  console.log(`✅ ${expired.length}件の期限切れキャンペーンを削除しました`)
}

cleanupExpired().catch(console.error)
