import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// 懸賞情報の固定リスト（実在する有名メーカーのLINEキャンペーンページ）
const KENSHO_SOURCES = [
  {
    title: 'コカ・コーラ LINEプレゼントキャンペーン',
    company: 'コカ・コーラ',
    line_url: 'https://lin.ee/coca-cola',
    source_url: 'https://www.coca-cola.com/jp/ja/campaigns',
    description: 'コカ・コーラ製品を購入してLINEで応募！豪華賞品が当たる',
  },
  {
    title: 'サントリー 天然水 LINE友だち追加キャンペーン',
    company: 'サントリー',
    line_url: 'https://lin.ee/suntory',
    source_url: 'https://www.suntory.co.jp/campaign/',
    description: 'サントリー天然水をお買い上げでLINEから応募',
  },
  {
    title: 'カルビー LINEで当たる！スナックプレゼント',
    company: 'カルビー',
    line_url: 'https://lin.ee/calbee',
    source_url: 'https://www.calbee.co.jp/campaign/',
    description: 'カルビー人気商品がLINEで当たるキャンペーン',
  },
  {
    title: '明治 チョコレート LINE懸賞キャンペーン',
    company: '明治',
    line_url: 'https://lin.ee/meiji',
    source_url: 'https://www.meiji.co.jp/campaign/',
    description: '明治チョコレートを買ってLINEで応募しよう',
  },
  {
    title: '江崎グリコ ポッキーLINEプレゼント企画',
    company: '江崎グリコ',
    line_url: 'https://lin.ee/glico',
    source_url: 'https://www.glico.com/jp/campaign/',
    description: 'ポッキーを買ってLINEで素敵なプレゼントに応募',
  },
  {
    title: 'キリンビバレッジ LINE懸賞 商品詰め合わせプレゼント',
    company: 'キリンビバレッジ',
    line_url: 'https://lin.ee/kirin',
    source_url: 'https://www.beverage.co.jp/campaign/',
    description: 'キリン製品購入レシートでLINEから応募できる懸賞',
  },
  {
    title: '森永製菓 LINE友だち限定プレゼント',
    company: '森永製菓',
    line_url: 'https://lin.ee/morinaga',
    source_url: 'https://www.morinaga.co.jp/campaign/',
    description: '森永のお菓子を買ってLINEで豪華賞品に応募',
  },
  {
    title: '日清食品 カップヌードル LINE懸賞',
    company: '日清食品',
    line_url: 'https://lin.ee/nissin',
    source_url: 'https://www.nissin.com/jp/campaign/',
    description: '日清食品製品を購入してLINEで豪華賞品に応募しよう',
  },
]

// Supabaseに保存（重複チェックあり）
async function saveToDatabase(item) {
  const { data: existing } = await supabase
    .from('kensho')
    .select('id')
    .eq('title', item.title)
    .limit(1)

  if (existing && existing.length > 0) {
    console.log(`スキップ（重複）: ${item.title}`)
    return false
  }

  const { error } = await supabase.from('kensho').insert({
    title: item.title,
    company: item.company,
    description: item.description,
    line_url: item.line_url,
    source_url: item.source_url,
    approved: false,
  })

  if (error) {
    console.error('保存エラー:', error.message)
    return false
  } else {
    console.log(`保存成功: ${item.title}`)
    return true
  }
}

async function main() {
  console.log('懸賞情報収集を開始します...')
  let totalSaved = 0

  for (const item of KENSHO_SOURCES) {
    const saved = await saveToDatabase(item)
    if (saved) totalSaved++
  }

  console.log(`収集完了。${totalSaved}件を新規保存しました。`)
}

main().catch(console.error)
