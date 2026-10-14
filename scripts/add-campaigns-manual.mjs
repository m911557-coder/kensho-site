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
  return resp.content[0].text
    .split('\n')
    .filter((line) => line.trim() && !line.trim().startsWith('#'))
    .join('')
    .trim()
}

const campaigns = [
  {
    title: 'アサヒスーパードライ ドライクリスタル コンビニ無料クーポンが40.5万名様に当たる！LINEキャンペーン',
    company: 'アサヒビール',
    prize: 'アサヒスーパードライ ドライクリスタル350ml缶1本 コンビニ無料引換クーポン',
    winners: 405000,
    deadline: '2026-10-20',
    line_url: 'https://www.asahibeer-cp.jp/drycrystal/cp/261007-261020-7gsp024fo4/',
    source_url: 'https://kenshou.club/archives/959115',
    category: '食品・飲料',
  },
  {
    title: 'ビールになった金麦 コンビニ無料クーポンが26万名様にその場で当たる！サントリーLINEキャンペーン',
    company: 'サントリー',
    prize: '金麦または金麦〈糖質75%オフ〉350ml缶1本 コンビニ無料引換クーポン',
    winners: 260000,
    deadline: '2026-11-04',
    line_url: 'https://kinmugi-cvs.campaign.suntory.co.jp/',
    source_url: 'https://kenshou.club/archives/958647',
    category: '食品・飲料',
  },
  {
    title: 'PayPayポイント最大5,000円分が30万名様以上に当たる！Yahoo!ダイレクトオファーLINEキャンペーン',
    company: 'LINEヤフー',
    prize: 'PayPayポイント最大5,000円相当',
    winners: 303100,
    deadline: '2026-11-04',
    line_url: 'https://miniapp.line.me/1564661729-OwVgvrr1/campaign/apply/261008ydo',
    source_url: 'https://kenshou.club/archives/960441',
    category: 'ギフトカード',
  },
  {
    title: 'LINEポイント最大1,000ポイントが20万名様に当たる！LINE懸賞キャンペーン',
    company: 'LINEヤフー',
    prize: 'LINEポイント最大1,000ポイント',
    winners: 200000,
    deadline: '2026-10-23',
    line_url: 'https://reward.line.me/top_cp_visit_202610/',
    source_url: 'https://kenshou.club/archives/958571',
    category: 'ギフトカード',
  },
  {
    title: 'ロリエ さらピュア吸水 お試しサンプルが2万5千名様に当たる！花王LINEキャンペーン',
    company: '花王',
    prize: 'ロリエさらピュア吸水 超吸収スリム お試しサンプル',
    winners: 25000,
    deadline: '2026-12-03',
    line_url: 'https://www.kao.co.jp/laurier/urinary-navi/present/2610/',
    source_url: 'https://kenshou.club/archives/960448',
    category: '日用品・コスメ',
  },
  {
    title: 'キスミー ヒロインメイク マスカラ ミニサンプルが2万名様に当たる！LINEキャンペーン',
    company: '伊勢半',
    prize: 'ヒロインメイク ロング＆カールマスカラ アドバンストフィルム ミニサンプル',
    winners: 20000,
    deadline: '2026-10-31',
    line_url: 'https://www.isehan.co.jp/heroine/cp/2026/1001cp_3rdmascara/',
    source_url: 'https://kenshou.club/archives/957634',
    category: '日用品・コスメ',
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
