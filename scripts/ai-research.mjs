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

// すでに登録済みのタイトルを取得
async function getExistingTitles() {
  const { data } = await supabase.from('kensho').select('title, source_url')
  return {
    titles: new Set((data || []).map(d => d.title).filter(Boolean)),
    urls: new Set((data || []).map(d => d.source_url).filter(Boolean)),
  }
}

// kensho-news.comから実在するLINE懸賞を取得してAIで解析
async function researchRealKensho(existingTitles, existingUrls) {
  // kensho-news.comのLINEカテゴリを取得
  const pages = [1, 2]
  let allText = ''

  for (const page of pages) {
    try {
      const url = page === 1
        ? 'https://kensho-news.com/category/line/'
        : `https://kensho-news.com/category/line/page/${page}/`
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        signal: AbortSignal.timeout(10000)
      })
      const html = await res.text()
      // タイトルとURLだけ抽出（軽量化）
      const matches = html.matchAll(/href="(https:\/\/kensho-news\.com\/[^"]+\d+\/)"[^>]*>([^<]{10,})</g)
      for (const m of matches) {
        allText += `URL: ${m[1]}\nタイトル: ${m[2].trim()}\n`
      }
    } catch (e) {
      console.log(`ページ取得エラー: ${e.message}`)
    }
  }

  if (!allText) {
    console.log('ページ取得できませんでした')
    return []
  }

  // AIに解析させる
  const existingList = [...existingTitles].slice(-30).join('\n')

  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 2000,
    messages: [{
      role: 'user',
      content: `以下はkensho-news.comから取得したLINE懸賞のリストです：

${allText}

すでに登録済みのタイトル（これらは絶対に除外）：
${existingList}

【重要】上記の「新着リスト」に実際に存在するURLとタイトルのみを使ってください。
架空・推測のキャンペーンは絶対に作らないでください。
新着リストに新しいものがなければ必ず [] を返してください。

新着リストから、登録済みでないものを最大5件選び、以下のJSON形式で返してください：
[
  {
    "title": "新着リストにあるタイトルそのまま",
    "company": "企業名（記事から推測）",
    "description": "懸賞の説明（80文字程度）",
    "deadline": "2026-MM-DD",
    "source_url": "新着リストにあるkensho-news.comのURL",
    "line_url": "https://lin.ee/xxxxxxx",
    "winners_count": 数字,
    "category": "食品・飲料 または ギフトカード または 家電・生活家電 または 日用品・コスメ または チケット・旅行 または その他"
  }
]

絶対条件：
- 新着リストに存在するURLのみ使うこと
- 登録済みタイトルと重複しないこと
- 新しいものがなければ [] を返すこと`
    }]
  })

  const text = message.content[0].text
  try {
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      const candidates = JSON.parse(jsonMatch[0])
      // 重複チェック
      return candidates.filter(c =>
        !existingTitles.has(c.title) &&
        !existingUrls.has(c.source_url)
      )
    }
  } catch (e) {
    console.error('JSON parse error:', e)
  }
  return []
}

// 承認メールを送信
async function sendApprovalEmail(candidates) {
  const itemsHtml = candidates.map((item, i) => `
    <div style="border: 1px solid #fed7aa; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
      <h3 style="color: #c2410c; margin: 0 0 8px;">${i + 1}. ${item.title}</h3>
      <p style="margin: 4px 0; color: #6b7280; font-size: 13px;">🏢 ${item.company || '不明'}</p>
      <p style="margin: 4px 0; color: #6b7280; font-size: 13px;">🏆 当選者数：${item.winners_count?.toLocaleString() || '不明'}名</p>
      <p style="margin: 4px 0; color: #6b7280; font-size: 13px;">📅 締切：${item.deadline || '不明'}</p>
      <p style="margin: 4px 0; color: #6b7280; font-size: 13px;">🏷️ ${item.category || ''}</p>
      <p style="margin: 8px 0; color: #374151; font-size: 14px;">${item.description || ''}</p>
      ${item.source_url ? `<a href="${item.source_url}" style="color: #3b82f6; font-size: 12px;">📰 元記事を確認</a>` : ''}
    </div>
  `).join('')

  const token = Buffer.from(JSON.stringify(candidates)).toString('base64url')

  await resend.emails.send({
    from: 'LINE懸賞まとめ <onboarding@resend.dev>',
    to: ADMIN_EMAIL,
    subject: `🎁 新着懸賞 ${candidates.length}件が見つかりました！`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #f97316, #fb923c); padding: 24px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
          <h1 style="color: white; margin: 0; font-size: 20px;">🎁 新着LINE懸賞発見！</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 14px;">${candidates.length}件の新しい懸賞が見つかりました</p>
        </div>
        ${itemsHtml}
        <div style="text-align: center; margin: 24px 0;">
          <a href="${SITE_URL}/api/approve?token=${token}"
             style="background: linear-gradient(135deg, #f97316, #fb923c); color: white; padding: 16px 40px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">
            ✅ 承認してサイトに追加する
          </a>
        </div>
        <p style="color: #9ca3af; font-size: 11px; text-align: center;">
          © 2026 LINE懸賞まとめ
        </p>
      </div>
    `,
  })

  console.log(`承認メールを送信: ${ADMIN_EMAIL}`)
}

async function main() {
  // 日本時間で22:00〜6:00の間はメール送信しない
  const jstHour = new Date(Date.now() + 9 * 60 * 60 * 1000).getUTCHours()
  if (jstHour >= 22 || jstHour < 6) {
    console.log(`夜間のため通知スキップ（JST ${jstHour}時）`)
    return
  }

  console.log('AIリサーチ開始...')

  const { titles, urls } = await getExistingTitles()
  console.log(`既存件数: ${titles.size}`)

  const candidates = await researchRealKensho(titles, urls)
  console.log(`新着候補: ${candidates.length}件`)

  if (candidates.length === 0) {
    console.log('新着なし。通知スキップ。')
    return
  }

  await sendApprovalEmail(candidates)
  console.log('完了！')
}

main().catch(console.error)
