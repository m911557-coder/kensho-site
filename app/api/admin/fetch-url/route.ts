import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const LINE_URL_PATTERN = /^https:\/\/(lin\.ee\/|line\.me\/|liff\.line\.me\/|page\.line\.me\/|access\.line\.me\/)/

function cleanLineUrl(url: string): string {
  const decoded = url.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  if (decoded.includes('liff.line.me/')) return decoded.split('?')[0]
  return decoded
}

function detectCategory(title: string): string {
  if (/ビール|サワー|チューハイ|お酒|飲料|ジュース|コーヒー|お茶|水|ドリンク|食品|お菓子|スナック|チョコ|グミ|アイス/.test(title)) return '食品・飲料'
  if (/ギフトカード|商品券|QUO|Amazon|PayPay|図書|ポイント/.test(title)) return 'ギフトカード'
  if (/家電|テレビ|冷蔵庫|洗濯機|掃除機|エアコン|スマホ|iPhone|iPad|カメラ/.test(title)) return '家電・生活家電'
  if (/旅行|ホテル|ハワイ|海外|宿泊|温泉|航空/.test(title)) return 'チケット・旅行'
  if (/コスメ|化粧品|シャンプー|洗剤|日用品|スキンケア|クリーム|ボディ/.test(title)) return '日用品・コスメ'
  if (/チケット|イベント|コンサート|映画|ライブ|入場/.test(title)) return 'チケット・旅行'
  return 'その他'
}

function detectCompany(text: string): string {
  const companyMap: [string, string][] = [
    ['アサヒビール', 'アサヒビール'], ['マルエフ', 'アサヒビール'], ['アサヒ', 'アサヒビール'],
    ['キリン', 'キリン'], ['一番搾り', 'キリン'], ['午後の紅茶', 'キリン'], ['スプリングバレー', 'キリン'],
    ['サントリー', 'サントリー'], ['翠ジンソーダ', 'サントリー'], ['山崎', 'サントリー'],
    ['コカ・コーラ', 'コカ・コーラ'], ['コカコーラ', 'コカ・コーラ'], ['ジョージア', 'コカ・コーラ'],
    ['大塚製薬', '大塚製薬'], ['ポカリスエット', '大塚製薬'], ['ボディメンテ', '大塚製薬'],
    ['レッドブル', 'レッドブル'], ['伊藤園', '伊藤園'], ['ネスレ', 'ネスレ'],
    ['ローソン', 'ローソン'], ['セブンイレブン', 'セブン-イレブン'], ['セブン-イレブン', 'セブン-イレブン'],
    ['ファミリーマート', 'ファミリーマート'], ['ミニストップ', 'ミニストップ'],
    ['明治', '明治'], ['ハーゲンダッツ', 'ハーゲンダッツ'], ['森永', '森永製菓'],
    ['カルビー', 'カルビー'], ['江崎グリコ', '江崎グリコ'], ['日清', '日清食品'],
    ['マクドナルド', 'マクドナルド'], ['すき家', 'すき家'], ['吉野家', '吉野家'],
    ['ユニリーバ', 'ユニリーバ'],
  ]
  for (const [keyword, name] of companyMap) {
    if (text.includes(keyword)) return name
  }
  return ''
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { url, password } = body

  if (password !== process.env.NOTIFY_SECRET) {
    return NextResponse.json({ error: 'パスワードが違います' }, { status: 401 })
  }

  if (!url) {
    return NextResponse.json({ error: 'URLを入力してください' }, { status: 400 })
  }

  // 入力URLが既にLINE URLの場合は最低限の情報を返す
  if (LINE_URL_PATTERN.test(url)) {
    return NextResponse.json({
      line_url: url,
      source_url: url,
      title: '',
      company: '',
      winners_count: '',
      deadline: '',
      category: 'その他',
      description: '',
    })
  }

  // URLのHTMLを取得
  let html = ''
  let finalUrl = url
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'ja,en;q=0.9',
      },
      signal: AbortSignal.timeout(12000),
    })
    finalUrl = res.url || url
    if (res.ok) html = await res.text()
  } catch (e) {
    return NextResponse.json({ error: `ページ取得エラー: ${String(e)}` }, { status: 500 })
  }

  // LINE URLを探す
  let line_url = ''
  if (LINE_URL_PATTERN.test(finalUrl)) {
    line_url = finalUrl
  } else {
    const m = html.match(/https:\/\/(lin\.ee\/[A-Za-z0-9]+|line\.me\/ti\/p\/@[A-Za-z0-9_-]+|liff\.line\.me\/[^\s"'<>]+|page\.line\.me\/[A-Za-z0-9_-]+)/)
    if (m) line_url = cleanLineUrl(m[0])
  }

  // LINEログイン系URLはそのまま使う
  if (!line_url && (url.includes('access.line.me') || url.includes('linelogin') || url.includes('direct.cnpt.jp'))) {
    line_url = url
  }

  // タイトルを抽出
  let title = ''
  const titleTag = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  if (titleTag) {
    title = titleTag[1]
      .replace(/が当たるキャンペーン一覧.*$/i, '')
      .replace(/を当てるなら.*$/i, '')
      .replace(/のキャンペーン一覧.*$/i, '')
      .replace(/\s*[｜|・]\s*(懸賞|キャンペーン|プレゼント|公式).*/i, '')
      .replace(/【[^】]*】/g, '')
      .trim()
  }
  // h1タグがあれば優先
  const h1 = html.match(/<h1[^>]*>([^<]{5,100})<\/h1>/i)
  if (h1) {
    const h1text = h1[1].replace(/<[^>]+>/g, '').trim()
    if (h1text.length >= 5 && h1text.length <= 80) title = h1text
  }

  // 当選者数を抽出
  const winnersMatch = html.match(/(\d[\d,万]+)\s*名/)
  let winners_count = ''
  if (winnersMatch) {
    const raw = winnersMatch[1]
    if (raw.includes('万')) {
      winners_count = String(parseInt(raw) * 10000)
    } else {
      winners_count = raw.replace(/,/g, '')
    }
  }

  // 締切日を抽出
  let deadline = ''
  const today = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().split('T')[0]
  const dateMatches = [...html.matchAll(/(\d{4})[年\/](\d{1,2})[月\/](\d{1,2})日?/g)]
  for (const d of dateMatches) {
    const candidate = `${d[1]}-${d[2].padStart(2, '0')}-${d[3].padStart(2, '0')}`
    if (candidate >= today && candidate <= '2030-12-31') {
      deadline = candidate
      break
    }
  }

  // 企業・カテゴリを判定
  const searchText = title + ' ' + html.slice(0, 3000)
  const company = detectCompany(searchText)
  const category = detectCategory(title)

  // AIで説明文を生成
  let description = ''
  if (title) {
    try {
      const msg = await anthropic.messages.create({
        model: 'claude-haiku-4-5',
        max_tokens: 120,
        messages: [{
          role: 'user',
          content: `以下のLINE懸賞キャンペーンについて、日本語で自然な説明文（50〜80文字）をオリジナルで書いてください。
キャンペーン名: ${title}
企業: ${company || '不明'}
当選者数: ${winners_count ? `${Number(winners_count).toLocaleString()}名` : '不明'}
説明文のみ返してください（前置き・記号不要）。`
        }]
      })
      if (msg.content[0].type === 'text') description = msg.content[0].text.trim()
    } catch {
      description = ''
    }
  }

  return NextResponse.json({
    line_url,
    source_url: url,
    title,
    company,
    winners_count,
    deadline,
    category,
    description,
  })
}
