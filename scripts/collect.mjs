import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// 検索キーワード一覧
const KEYWORDS = [
  'LINE 懸賞 応募 プレゼント',
  'LINE友達追加 プレゼントキャンペーン',
  'LINEで応募 懸賞',
]

// DuckDuckGo HTML検索（無料・APIキー不要）
async function searchCampaigns(keyword) {
  const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(keyword)}&kl=jp-jp`
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; KenshoBot/1.0)',
      },
    })
    const html = await res.text()

    // 結果を簡易パース
    const results = []
    const regex = /class="result__title"[^>]*>[\s\S]*?href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g
    let match
    while ((match = regex.exec(html)) !== null) {
      const url = match[1]
      const title = match[2].replace(/<[^>]+>/g, '').trim()
      if (title && url && url.startsWith('http')) {
        results.push({ title, url })
      }
    }
    return results.slice(0, 5)
  } catch (e) {
    console.error('検索エラー:', e.message)
    return []
  }
}

// LINE URLかどうか判定
function extractLineUrl(text) {
  const linePatterns = [
    /https?:\/\/lin\.ee\/[A-Za-z0-9]+/,
    /https?:\/\/line\.me\/[^\s"'<>]+/,
    /https?:\/\/liff\.line\.me\/[^\s"'<>]+/,
  ]
  for (const pattern of linePatterns) {
    const match = text.match(pattern)
    if (match) return match[0]
  }
  return null
}

// Supabaseに保存（重複チェックあり）
async function saveToDatabase(item) {
  // 同じタイトルが既にあるかチェック
  const { data: existing } = await supabase
    .from('kensho')
    .select('id')
    .eq('title', item.title)
    .limit(1)

  if (existing && existing.length > 0) {
    console.log(`スキップ（重複）: ${item.title}`)
    return
  }

  const { error } = await supabase.from('kensho').insert({
    title: item.title,
    line_url: item.line_url || 'https://line.me',
    source_url: item.source_url,
    approved: false,
  })

  if (error) {
    console.error('保存エラー:', error.message)
  } else {
    console.log(`保存成功: ${item.title}`)
  }
}

// メイン処理
async function main() {
  console.log('懸賞情報収集を開始します...')
  let totalFound = 0

  for (const keyword of KEYWORDS) {
    console.log(`検索中: ${keyword}`)
    const results = await searchCampaigns(keyword)

    for (const result of results) {
      // LINE関連のURLを含むものを優先
      const isLineRelated =
        result.title.includes('LINE') ||
        result.title.includes('ライン') ||
        result.title.includes('懸賞') ||
        result.title.includes('プレゼント')

      if (isLineRelated) {
        await saveToDatabase({
          title: result.title.slice(0, 100),
          line_url: extractLineUrl(result.url) || result.url,
          source_url: result.url,
        })
        totalFound++
      }
    }

    // サーバー負荷軽減のため少し待つ
    await new Promise((r) => setTimeout(r, 2000))
  }

  console.log(`収集完了。${totalFound}件の候補を保存しました。`)
}

main().catch(console.error)
