import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)
const resend = new Resend(process.env.RESEND_API_KEY)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const SITE_URL = process.env.SITE_URL || 'https://kensho-site.vercel.app'

// ────────────────────────────────────────────────────────────────
// 安全な自動収集の仕組み
//
// 1. kensho-news.com のカテゴリページから「記事URL」だけ取得
//    → URL（リンク先）は著作権の対象外（事実）
//    → ロボット判定: robots.txt は /wp-admin/ のみブロック（アクセス可）
//    → 著作権法47条の5（情報解析目的の複製等）でも適法
//
// 2. 各記事から chance.com/jump.srv リダイレクトリンクを取得し追跡
//    → リダイレクト先の本物 lin.ee / line.me URL を取得
//    → 架空URLは一切生成しない
//
// 3. 説明文はAIがオリジナルで生成
//    → kensho-news.com の文章をコピー・転載しない
// ────────────────────────────────────────────────────────────────

async function getExistingData() {
  const { data } = await supabase.from('kensho').select('title, source_url, line_url')
  return {
    titles: new Set((data || []).map(d => d.title).filter(Boolean)),
    sourceUrls: new Set((data || []).map(d => d.source_url).filter(Boolean)),
    lineUrls: new Set((data || []).map(d => d.line_url).filter(Boolean)),
  }
}

const LINE_URL_PATTERN = /^https:\/\/(lin\.ee\/|line\.me\/|liff\.line\.me\/|page\.line\.me\/)/

// リダイレクトを追跡して lin.ee / line.me URL を取得（2段階対応）
// chance.com → lin.ee (直接) or chance.com → 企業サイト → lin.ee
async function resolveLineUrl(url, depth = 0) {
  if (depth > 4) return null
  try {
    const res = await fetch(url, {
      redirect: 'manual',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'ja,en;q=0.9',
      },
      signal: AbortSignal.timeout(8000)
    })
    const location = res.headers.get('location')
    if (!location) return null

    // lin.ee / line.me に到達したら完了
    if (LINE_URL_PATTERN.test(location)) return location

    // 企業サイトへのリダイレクト → そのページからlin.eeを探す（1段階）
    // ただしTwitter/X・YouTube等のSNSページはスキップ（誤マッチ防止）
    const isSnsSite = /\/(twitter\.com|x\.com|instagram\.com|youtube\.com|tiktok\.com)\//.test(location)
    if (location.startsWith('http') && depth === 0 && !isSnsSite) {
      const lineUrl = await fetchLineUrlFromPage(location)
      if (lineUrl) return lineUrl
    }
  } catch {
    // ignore
  }
  return null
}

// URLのHTMLエンティティをデコードし、LIFFのクエリパラメータを除去
function cleanLineUrl(url) {
  if (!url) return url
  const decoded = url.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  // liff.line.me はベースURLのみ使用（?以降のクエリは不要）
  if (decoded.includes('liff.line.me/')) {
    return decoded.split('?')[0]
  }
  return decoded
}

// 企業ページからlin.ee / line.me URLを直接探す
async function fetchLineUrlFromPage(pageUrl) {
  try {
    const res = await fetch(pageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml',
      },
      signal: AbortSignal.timeout(8000)
    })
    if (!res.ok) return null
    const html = await res.text()
    const m = html.match(/https:\/\/(lin\.ee\/[A-Za-z0-9]+|line\.me\/ti\/p\/@[A-Za-z0-9_-]+|liff\.line\.me\/[^\s"'<]+|page\.line\.me\/[A-Za-z0-9_-]+)/)
    return m ? cleanLineUrl(m[0]) : null
  } catch {
    return null
  }
}

// kensho-news.com の記事ページから lin.ee URL・キャンペーン情報を抽出
async function extractFromArticle(articleUrl) {
  try {
    const res = await fetch(articleUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'ja,en;q=0.9',
      },
      signal: AbortSignal.timeout(12000)
    })
    if (!res.ok) return null
    const html = await res.text()

    // ── lin.ee URL の取得 ──
    // パターン1: chance.com/jump.srv リダイレクト経由（www.chance.com も対応）
    let lineUrl = null
    const chanceMatch = html.match(/href="(https:\/\/(?:www\.)?chance\.com\/jump\.srv[^"]+)"/i)
    if (chanceMatch) {
      lineUrl = await resolveLineUrl(chanceMatch[1])
    }

    // パターン2: 直接 lin.ee / liff.line.me リンク（記事内）
    if (!lineUrl) {
      const m = html.match(/href="(https:\/\/(lin\.ee\/[A-Za-z0-9]+|line\.me\/ti\/p\/@[A-Za-z0-9_-]+|liff\.line\.me\/[^"]+|page\.line\.me\/[A-Za-z0-9_-]+))"/i)
      if (m) lineUrl = cleanLineUrl(m[1])
    }

    // パターン3: テキスト中に直接記載
    if (!lineUrl) {
      const m = html.match(/https:\/\/(lin\.ee\/[A-Za-z0-9]+|line\.me\/ti\/p\/@[A-Za-z0-9_-]+|page\.line\.me\/[A-Za-z0-9_-]+)/)
      if (m) lineUrl = cleanLineUrl(m[0])
    }

    // パターン4: 企業サイトへの直接リンクが記事にある場合、そのページからlin.ee探す
    // （Twitter/SNS・kensho-news自身・wp-content等は除外）
    if (!lineUrl) {
      const extLinks = [...html.matchAll(/href="(https?:\/\/(?!(?:www\.)?kensho-news\.com|twitter\.com|x\.com|instagram\.com|youtube\.com|wp-content)[^"]+)"/gi)]
        .map(m => m[1])
        .filter(u => !u.includes('chance.com') && !u.includes('#') && !u.includes('?'))
        .slice(0, 3) // 最大3件
      for (const extUrl of extLinks) {
        const found = await fetchLineUrlFromPage(extUrl)
        if (found) { lineUrl = found; break }
      }
    }

    if (!lineUrl) return null

    // ── タイトルの取得・クリーニング ──
    // kensho-news.com の <title> は "キャンペーン名が当たるキャンペーン一覧" 形式
    // → "が当たるキャンペーン一覧" 以降を除去してキャンペーン名だけ抽出
    let title = ''
    const titleTag = html.match(/<title[^>]*>([^<]+)<\/title>/i)
    if (titleTag) {
      title = titleTag[1]
        // kensho-news.com 特有のテンプレート除去
        .replace(/が当たるキャンペーン一覧.*$/i, '')
        .replace(/を当てるなら.*$/i, '')
        .replace(/のキャンペーン一覧.*$/i, '')
        // 一般的なサイト名除去
        .replace(/[｜|]\s*[Kk]ensho[^|]*$/i, '')
        .replace(/\s*[\|｜]\s*懸賞.*$/i, '')
        .replace(/【懸賞.*$/i, '')
        .trim()
    }
    // <h1> が取れる場合（ただし「〜が当たるキャンペーン一覧」など除去）
    const h1Match = html.match(/<h1[^>]*>([^<]{10,120})<\/h1>/i)
    if (h1Match) {
      const h1 = h1Match[1]
        .replace(/<[^>]+>/g, '')
        .replace(/が当たるキャンペーン一覧.*$/i, '')
        .replace(/を当てるなら.*$/i, '')
        .trim()
      if (h1.length >= 5 && h1.length <= 100) title = h1
    }

    if (!title || title.length < 5) return null

    // ── 当選者数の取得 ──
    const winnersMatch = html.match(/(\d[\d,]+)\s*名/)
    const winnersCount = winnersMatch
      ? parseInt(winnersMatch[1].replace(/,/g, ''), 10)
      : null

    // ── 締切日の取得 ──
    let deadline = null
    // 「YYYY年MM月DD日」パターン
    const dateMatches = [...html.matchAll(/(\d{4})年(\d{1,2})月(\d{1,2})日/g)]
    if (dateMatches.length > 0) {
      // 最初に出てくる今日以降の日付を使用
      const today = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().split('T')[0]
      for (const d of dateMatches) {
        const candidate = `${d[1]}-${d[2].padStart(2, '0')}-${d[3].padStart(2, '0')}`
        if (candidate >= today && candidate <= '2030-12-31') {
          deadline = candidate
          break
        }
      }
    }
    // 「MM/DD」パターン（今年のもの）
    if (!deadline) {
      const shortDate = html.match(/(\d{1,2})\/(\d{1,2})\s*締切/)
      if (shortDate) {
        const year = new Date(Date.now() + 9 * 60 * 60 * 1000).getFullYear()
        deadline = `${year}-${shortDate[1].padStart(2, '0')}-${shortDate[2].padStart(2, '0')}`
      }
    }

    // ── 企業名の推定 ──
    const companyMap = [
      ['アサヒビール', 'アサヒビール'], ['アサヒ', 'アサヒビール'],
      ['キリン', 'キリン'], ['サントリー', 'サントリー'],
      ['コカコーラ', 'コカ・コーラ'], ['コカ・コーラ', 'コカ・コーラ'],
      ['ジョージア', 'コカ・コーラ'], ['ポカリ', '大塚製薬'],
      ['大塚製薬', '大塚製薬'], ['レッドブル', 'レッドブル'],
      ['ローソン', 'ローソン'], ['セブンイレブン', 'セブン-イレブン'],
      ['ミニストップ', 'ミニストップ'], ['明治', '明治'],
      ['ハーゲンダッツ', 'ハーゲンダッツ'], ['森永', '森永製菓'],
      ['カルビー', 'カルビー'], ['江崎グリコ', '江崎グリコ'],
      ['日清', '日清食品'], ['ネスレ', 'ネスレ'], ['伊藤園', '伊藤園'],
      ['午後の紅茶', 'キリン'], ['スプリングバレー', 'キリン'],
      ['翠ジンソーダ', 'サントリー'], ['ボディメンテ', '大塚製薬'],
      ['マルエフ', 'アサヒビール'],
    ]
    let company = ''
    const searchText = title + ' ' + html.slice(0, 3000)
    for (const [keyword, name] of companyMap) {
      if (searchText.includes(keyword)) { company = name; break }
    }

    return { title, lineUrl, winnersCount, deadline, company, sourceUrl: articleUrl }
  } catch (e) {
    console.log(`記事取得エラー: ${articleUrl} → ${e.message}`)
    return null
  }
}

// kensho-news.com カテゴリページから新着記事URLを取得
// ※ URL（リンク先情報）のみ収集 — 著作権対象外（事実）
async function getNewArticleUrls(existingSourceUrls) {
  const urls = new Set()
  const pages = [
    'https://kensho-news.com/category/line/',
    'https://kensho-news.com/category/line/page/2/',
    'https://kensho-news.com/category/line/page/3/',
    'https://kensho-news.com/category/line/page/4/',
  ]
  for (const pageUrl of pages) {
    try {
      const res = await fetch(pageUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        signal: AbortSignal.timeout(10000)
      })
      if (!res.ok) { console.log(`${pageUrl}: HTTP ${res.status}`); continue }
      const html = await res.text()

      // 記事URLのパターン（numberofwinners/cnt-XX/ID/ または genre/type/ID/ 形式）
      const matches = html.matchAll(/href="(https:\/\/kensho-news\.com\/(?:numberofwinners|genre|prize|product)\/[^"#?]+\/\d{4,}\/?)"/g)
      let count = 0
      for (const m of matches) {
        const url = m[1]
        if (
          !existingSourceUrls.has(url) &&
          !url.includes('/category/') &&
          !url.includes('/tag/') &&
          !url.includes('/author/') &&
          !url.includes('/page/') &&
          url !== 'https://kensho-news.com/'
        ) {
          urls.add(url)
          count++
        }
      }
      console.log(`${pageUrl}: ${count}件の新着URL`)
    } catch (e) {
      console.log(`ページ取得エラー: ${pageUrl} → ${e.message}`)
    }
  }
  // 一度に処理する上限（APIコスト・時間節約）
  return [...urls].slice(0, 25)
}

// AIでオリジナルの説明文を生成（kensho-news.com の文章は使用しない）
async function generateDescription(title, company, winners) {
  try {
    const msg = await anthropic.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 120,
      messages: [{
        role: 'user',
        content: `以下のLINE懸賞キャンペーンについて、日本語で自然な説明文（50〜80文字）をオリジナルで書いてください。
他サイトの文章は参考にせず、事実ベースで自分の言葉で書くこと。

キャンペーン名: ${title}
企業: ${company || '不明'}
当選者数: ${winners ? `${winners.toLocaleString()}名` : '不明'}

説明文のみ返してください（前置き・記号不要）。`
      }]
    })
    return msg.content[0].text.trim()
  } catch {
    return `${company || ''}のLINE懸賞キャンペーン。公式LINEアカウントから簡単に応募できます。`
  }
}

// カテゴリを自動判定
function detectCategory(title) {
  if (/ビール|サワー|チューハイ|お酒|飲料|ジュース|コーヒー|お茶|水|ドリンク|食品|お菓子|スナック|チョコ/.test(title)) return '食品・飲料'
  if (/ギフトカード|商品券|QUO|Amazon|PayPay|図書/.test(title)) return 'ギフトカード'
  if (/家電|テレビ|冷蔵庫|洗濯機|掃除機|エアコン|スマホ|iPhone|iPad/.test(title)) return '家電・生活家電'
  if (/旅行|ホテル|ハワイ|海外|宿泊|温泉/.test(title)) return 'チケット・旅行'
  if (/コスメ|化粧品|シャンプー|洗剤|日用品|スキンケア/.test(title)) return '日用品・コスメ'
  if (/チケット|イベント|コンサート|映画|ライブ/.test(title)) return 'チケット・旅行'
  return '食品・飲料'
}

// 追加結果を通知メールで送信
async function sendResultEmail(added, skipped) {
  if (added.length === 0 && skipped === 0) return
  const rows = added.map(item => `
    <div style="border:1px solid #fed7aa;border-radius:8px;padding:14px;margin-bottom:12px;">
      <h3 style="color:#c2410c;margin:0 0 6px;font-size:15px;">${item.title}</h3>
      <p style="margin:3px 0;color:#6b7280;font-size:12px;">🏢 ${item.company || '不明'} ／ 🏆 ${item.winners_count?.toLocaleString() || '不明'}名 ／ 📅 ${item.deadline || '不明'} ／ 🏷️ ${item.category}</p>
      <p style="margin:6px 0;color:#374151;font-size:13px;">${item.description}</p>
      <a href="${item.line_url}" style="color:#06c755;font-size:12px;">${item.line_url}</a>
    </div>
  `).join('')

  await resend.emails.send({
    from: 'LINE懸賞まとめ <onboarding@resend.dev>',
    to: ADMIN_EMAIL,
    subject: added.length > 0
      ? `✅ 懸賞 ${added.length}件を自動追加しました`
      : `📋 本日の懸賞リサーチ完了（新着なし）`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;">
        <div style="background:linear-gradient(135deg,#f97316,#fb923c);padding:20px;border-radius:12px;text-align:center;margin-bottom:20px;">
          <h1 style="color:white;margin:0;font-size:18px;">${added.length > 0 ? `✅ ${added.length}件 自動追加完了` : '📋 本日の懸賞リサーチ完了'}</h1>
          ${skipped > 0 ? `<p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:13px;">（${skipped}件はLINE URL取得できずスキップ）</p>` : ''}
        </div>
        ${rows || '<p style="text-align:center;color:#6b7280;">本日は新着懸賞なし。引き続き自動監視中。</p>'}
        <div style="text-align:center;margin:20px 0;">
          <a href="${SITE_URL}" style="background:linear-gradient(135deg,#f97316,#fb923c);color:white;padding:12px 30px;border-radius:50px;text-decoration:none;font-weight:bold;">
            サイトを確認する →
          </a>
        </div>
      </div>
    `
  })
  console.log(`結果メール送信: ${ADMIN_EMAIL}`)
}

async function main() {
  const jstHour = new Date(Date.now() + 9 * 60 * 60 * 1000).getUTCHours()
  console.log(`===== 自動収集開始 JST ${jstHour}時 =====`)

  const { titles, sourceUrls, lineUrls } = await getExistingData()
  console.log(`既存件数: ${titles.size}`)

  const articleUrls = await getNewArticleUrls(sourceUrls)
  console.log(`処理対象の新着記事: ${articleUrls.length}件`)

  if (articleUrls.length === 0) {
    console.log('新着記事なし。終了。')
    return
  }

  const addedItems = []
  let skippedCount = 0

  for (const articleUrl of articleUrls) {
    const info = await extractFromArticle(articleUrl)
    if (!info || !info.lineUrl) {
      console.log(`スキップ（LINE URL未取得）: ${articleUrl}`)
      skippedCount++
      continue
    }

    // タイトル・LINE URL 重複チェック
    if (titles.has(info.title)) {
      console.log(`スキップ（タイトル重複）: ${info.title}`)
      continue
    }
    if (lineUrls.has(info.lineUrl)) {
      console.log(`スキップ（LINE URL重複）: ${info.lineUrl}`)
      continue
    }

    // オリジナル説明文を生成
    const description = await generateDescription(info.title, info.company, info.winnersCount)
    const category = detectCategory(info.title)

    const item = {
      title: info.title,
      company: info.company || null,
      description,
      deadline: info.deadline || null,
      line_url: info.lineUrl,
      source_url: info.sourceUrl,
      image_url: null,
      approved: true,
      winners_count: info.winnersCount || null,
      category,
    }

    const { error } = await supabase
      .from('kensho')
      .upsert(item, { onConflict: 'title', ignoreDuplicates: true })

    if (error) {
      console.error(`保存エラー: ${info.title} → ${error.message}`)
    } else {
      console.log(`✅ 追加: ${info.title} | ${info.lineUrl} | 締切: ${info.deadline || '不明'}`)
      addedItems.push(item)
      titles.add(info.title)
    }

    // サーバー負荷軽減のため1秒待機
    await new Promise(r => setTimeout(r, 1000))
  }

  console.log(`\n===== 完了 追加: ${addedItems.length}件 / スキップ: ${skippedCount}件 =====`)

  await sendResultEmail(addedItems, skippedCount)
}

main().catch(console.error)
