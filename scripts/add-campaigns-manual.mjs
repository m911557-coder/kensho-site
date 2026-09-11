import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

async function generateDescription(title, prize, company, winners) {
  const resp = await anthropic.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 200,
    messages: [{
      role: 'user',
      content: `以下のLINE懸賞キャンペーンの紹介文を80文字以内で書いてください。
タイトル: ${title}
景品: ${prize}
企業: ${company}
当選者数: ${winners}名
形式: 体言止め、絵文字なし、宣伝文句なし、事実のみ`
    }]
  })
  return resp.content[0].text.trim()
}

const campaigns = [
  {
    title: 'ジムビームソーダ缶 コンビニ無料クーポンが21万名様にその場で当たる！サントリーLINEキャンペーン',
    company: 'サントリー',
    prize: 'ジムビームソーダ350ml缶1本 コンビニ無料引換クーポン',
    winners: 210000,
    deadline: '2026-09-18',
    line_url: 'https://jimbeam-cvs.campaign.suntory.co.jp/',
    source_url: 'https://kojinabi.com/blog-entry-7576.html',
    category: '食品・飲料',
  },
]

for (const c of campaigns) {
  const description = await generateDescription(c.title, c.prize, c.company, c.winners)
  console.log(`\n📝 ${c.title}`)
  console.log(`説明: ${description}`)

  const category = c.category ?? (c.winners >= 10000 ? 'ギフトカード' : '食品・飲料')
  const { error } = await supabase.from('kensho').upsert({
    title: c.title,
    company: c.company,
    description,
    deadline: c.deadline,
    line_url: c.line_url,
    source_url: c.source_url,
    image_url: null,
    approved: true,
    winners_count: c.winners,
    category,
  }, { onConflict: 'title', ignoreDuplicates: true })

  if (error) {
    if (error.code === '23505') {
      console.log('⚠️  重複スキップ')
    } else {
      console.log('❌ エラー:', error.message)
    }
  } else {
    console.log('✅ 追加成功')
  }
}
