import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const env = {}
const lines = readFileSync('.env.local', 'utf8').split('\n')
for (const line of lines) {
  const idx = line.indexOf('=')
  if (idx > 0) env[line.slice(0, idx).trim()] = line.slice(idx + 1).trim()
}

const supabase = createClient(env['NEXT_PUBLIC_SUPABASE_URL'], env['NEXT_PUBLIC_SUPABASE_ANON_KEY'])

// 既存データに winners_count と category を設定
const updates = [
  { title: 'アサヒスーパードライなど人気商品6本セットを100名様にプレゼント', winners_count: 100, category: '食品・飲料' },
  { title: '66名様にえらべるPay 2,000ポイント', winners_count: 66, category: 'ギフトカード' },
  { title: 'コーヒーペアリングギフトセットを10名様にプレゼント', winners_count: 10, category: '食品・飲料' },
  { title: '北海道産ほたてを食べて当てよう！海の幸プレゼント', winners_count: 50, category: '食品・飲料' },
  { title: 'テレビ東京 LINEクイズで毎日Amazonギフトカード最大1万円分プレゼント', winners_count: 77, category: 'ギフトカード' },
  { title: '日出町公式LINE 豊後牛ステーキセットプレゼント', winners_count: 23, category: '食品・飲料' },
  { title: 'ソフトバンク PayPayポイント最大10万円相当プレゼント', winners_count: 300000, category: 'ギフトカード' },
  { title: 'ダイドードリンコ 商品詰め合わせセットプレゼント', winners_count: 100, category: '食品・飲料' },
  { title: '神奈川県青色申告会 横浜八景島シーパラダイスペアチケットプレゼント', winners_count: 20, category: 'チケット・旅行' },
  { title: '北海道漁業協同組合 ほたてのスープ50名様プレゼント', winners_count: 50, category: '食品・飲料' },
  { title: 'オハヨー乳業 QUOカードPay200円分を全員にプレゼント', winners_count: 99999, category: 'ギフトカード' },
  { title: 'ネスカフェ バリスタ スリム 51名様にプレゼント', winners_count: 51, category: '家電・生活家電' },
  { title: 'オーレック えらべるPay500ポイント 1000名様にプレゼント', winners_count: 1000, category: 'ギフトカード' },
  { title: 'POLA リンクルショット 無料サンプル100名様プレゼント', winners_count: 100, category: '日用品・コスメ' },
  { title: '池田屋ランドセル 2027年度モデル 20名様にプレゼント', winners_count: 20, category: 'その他' },
  { title: 'ユニ・チャーム Frecious ドッグフードお試しパック 合計2万名様プレゼント', winners_count: 20000, category: '日用品・コスメ' },
  { title: 'Vポイント 毎日250名・合計22500名に10円相当プレゼント', winners_count: 22500, category: 'ギフトカード' },
  { title: 'アサヒビール えらべるPay100ポイント 400名様プレゼント', winners_count: 400, category: 'ギフトカード' },
  { title: '森永製菓 ジャンボスマイルキャンペーン QUOカード3500名様プレゼント', winners_count: 3500, category: '食品・飲料' },
  { title: 'キッコーマン豆乳 朝の満たんぱくキャンペーン 合計10260名様プレゼント', winners_count: 10260, category: '食品・飲料' },
]

async function main() {
  for (const u of updates) {
    const { error } = await supabase
      .from('kensho')
      .update({ winners_count: u.winners_count, category: u.category })
      .eq('title', u.title)
    if (error) {
      console.error('エラー: ' + u.title, error.message)
    } else {
      console.log('✓ 更新: ' + u.title)
    }
  }
  console.log('完了！')
}
main().catch(console.error)
