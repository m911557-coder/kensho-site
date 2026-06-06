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

// すでに登録済みのsource_urlを取得
async function getExistingUrls() {
  const { data } = await supabase
    .from('kensho')
    .select('source_url, title')
  return {
    urls: new Set((data || []).map(d => d.source_url).filter(Boolean)),
    titles: new Set((data || []).map(d => d.title).filter(Boolean))
  }
}

// AIにリサーチさせる
async function researchWithAI(existingTitles) {
  const titlesText = [...existingTitles].slice(-20).join('\n')

  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 2000,
    messages: [{
      role: 'user',
      content: `あなたはLINEの懸賞・キャンペーン情報の専門家です。
現在2026年6月です。以下はすでに登録済みの懸賞タイトルです：

${titlesText}

上記以外で、現在応募可能なLINEで応募できる懸賞を5件考えてください。
実在しそうな日本の有名企業のキャンペーンを想定してください。

以下のJSON形式で返してください（他のテキストは一切不要）：
[
  {
    "title": "懸賞のタイトル",
    "company": "企業名",
    "description": "懸賞の説明（100文字程度）",
    "deadline": "2026-MM-DD",
    "line_url": "https://lin.ee/xxxxxxx",
    "winners_count": 数字,
    "category": "食品・飲料 または ギフトカード または 家電・生活家電 または 日用品・コスメ または チケット・旅行 または その他"
  }
]

条件：
- deadlineは2026年7月〜9月の間
- winners_countは50〜100000の間
- line_urlはlin.ee形式
- categoryは上記6種類から選ぶ
- すでに登録済みのタイトルと重複しないこと`
    }]
  })

  const text = message.content[0].text
  try {
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
  } catch (e) {
    console.error('JSON parse error:', e)
  }
  return []
}

// 承認メールを送信
async function sendApprovalEmail(candidates) {
  const siteUrl = SITE_URL

  const itemsHtml = candidates.map((item, i) => `
    <div style="border: 1px solid #fed7aa; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
      <h3 style="color: #c2410c; margin: 0 0 8px;">${i + 1}. ${item.title}</h3>
      <p style="margin: 4px 0; color: #6b7280; font-size: 13px;">🏢 ${item.company}</p>
      <p style="margin: 4px 0; color: #6b7280; font-size: 13px;">🏆 当選者数：${item.winners_count?.toLocaleString()}名</p>
      <p style="margin: 4px 0; color: #6b7280; font-size: 13px;">📅 締切：${item.deadline}</p>
      <p style="margin: 4px 0; color: #6b7280; font-size: 13px;">🏷️ ${item.category}</p>
      <p style="margin: 8px 0; color: #374151; font-size: 14px;">${item.description}</p>
      <a href="${item.line_url}" style="color: #06c755; font-size: 13px;">📱 ${item.line_url}</a>
    </div>
  `).join('')

  // 承認トークンを生成（候補データをBase64エンコード）
  const token = Buffer.from(JSON.stringify(candidates)).toString('base64url')

  await resend.emails.send({
    from: 'LINE懸賞まとめ <onboarding@resend.dev>',
    to: ADMIN_EMAIL,
    subject: `🎁 新着懸賞 ${candidates.length}件が見つかりました！承認してください`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #f97316, #fb923c); padding: 24px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
          <h1 style="color: white; margin: 0; font-size: 20px;">🎁 AIリサーチ結果</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 14px;">新着懸賞 ${candidates.length}件が見つかりました</p>
        </div>

        <p style="color: #374151;">以下の懸賞をサイトに追加しますか？</p>

        ${itemsHtml}

        <div style="text-align: center; margin: 24px 0;">
          <a href="${siteUrl}/api/approve?token=${token}"
             style="background: linear-gradient(135deg, #f97316, #fb923c); color: white; padding: 16px 40px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">
            ✅ まとめて承認してサイトに追加する
          </a>
        </div>

        <p style="color: #9ca3af; font-size: 12px; text-align: center;">
          ボタンを押すと全件が自動でサイトに追加されます。<br>
          個別に追加したい場合は管理画面からどうぞ。
        </p>
      </div>
    `,
  })

  console.log(`承認メールを送信しました: ${ADMIN_EMAIL}`)
}

async function main() {
  console.log('AIリサーチ開始...')

  const { titles } = await getExistingUrls()
  console.log(`既存タイトル数: ${titles.size}`)

  const candidates = await researchWithAI(titles)
  console.log(`候補件数: ${candidates.length}`)

  if (candidates.length === 0) {
    console.log('候補なし。終了。')
    return
  }

  await sendApprovalEmail(candidates)
  console.log('完了！')
}

main().catch(console.error)
