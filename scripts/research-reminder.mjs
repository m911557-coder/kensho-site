import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const SITE_URL = process.env.SITE_URL || 'https://kensho-site.vercel.app'

// ───────────────────────────────────────────────
// 安全な方式：他社サイトの内容をコピー・転載せず、
// 公式キャンペーンページ・公式LINEアカウントへの
// 「リンク集（チェックリスト）」だけをメールで送る。
// 実際のlin.ee URLは自分で公式ページを見て確認し、
// 手動でサイトに追加する。
// （公開ページへのリンクは法的に問題なし＝ブックマークと同じ）
// ───────────────────────────────────────────────

// チェック対象の企業・ブランド（公式キャンペーンページ＋公式LINE）
const companies = [
  { name: 'アサヒビール', campaign: 'https://www.asahibeer.co.jp/campaign/', line: 'https://line.me/R/ti/p/@asahibeer' },
  { name: 'キリン', campaign: 'https://www.kirin.co.jp/entertainment/campaign/', line: 'https://line.me/R/ti/p/@kirin' },
  { name: 'サントリー', campaign: 'https://www.suntory.co.jp/sic/', line: 'https://line.me/R/ti/p/@suntory' },
  { name: 'コカ・コーラ', campaign: 'https://www.cocacola.co.jp/campaigns', line: 'https://line.me/R/ti/p/@cocacola.japan' },
  { name: 'ジョージア', campaign: 'https://www.georgia.jp/', line: 'https://line.me/R/ti/p/@georgia_japan' },
  { name: 'ポカリスエット（大塚製薬）', campaign: 'https://www.otsuka.co.jp/cmp/', line: 'https://line.me/R/ti/p/@pocarisweat' },
  { name: 'レッドブル', campaign: 'https://www.redbull.com/jp-ja/', line: 'https://line.me/R/ti/p/@redbull' },
  { name: 'ローソン', campaign: 'https://www.lawson.co.jp/campaign/', line: 'https://line.me/R/ti/p/@lawson' },
  { name: 'セブンイレブン', campaign: 'https://www.sej.co.jp/cmp/', line: 'https://line.me/R/ti/p/@711sej' },
  { name: 'ミニストップ', campaign: 'https://www.ministop.co.jp/', line: 'https://line.me/R/ti/p/@ministop' },
  { name: '明治', campaign: 'https://www.meiji.co.jp/', line: 'https://line.me/R/ti/p/@meiji' },
  { name: 'サントリー 翠ジンソーダ', campaign: 'https://www.suntory.co.jp/rtd/sui/', line: 'https://line.me/R/ti/p/@suntory' },
  { name: 'キリン 午後の紅茶', campaign: 'https://www.kirin.co.jp/products/softdrink/gogo/', line: 'https://line.me/R/ti/p/@kirin' },
  { name: '大塚製薬 ボディメンテ', campaign: 'https://www.otsuka.co.jp/bdm/', line: 'https://line.me/R/ti/p/@bodymainte' },
]

async function sendReminderEmail() {
  const today = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().split('T')[0]

  const rows = companies.map((c, i) => `
    <tr style="border-bottom:1px solid #fed7aa;">
      <td style="padding:10px 8px;color:#9ca3af;font-size:13px;">${i + 1}</td>
      <td style="padding:10px 8px;color:#374151;font-size:14px;font-weight:bold;">${c.name}</td>
      <td style="padding:10px 8px;">
        <a href="${c.campaign}" style="color:#c2410c;font-size:13px;text-decoration:none;">🎁 公式キャンペーン</a>
      </td>
      <td style="padding:10px 8px;">
        <a href="${c.line}" style="color:#06c755;font-size:13px;text-decoration:none;">📱 公式LINE</a>
      </td>
    </tr>
  `).join('')

  await resend.emails.send({
    from: 'LINE懸賞まとめ <onboarding@resend.dev>',
    to: ADMIN_EMAIL,
    subject: `📋 ${today} 懸賞リサーチ チェックリスト`,
    html: `
      <div style="font-family:sans-serif;max-width:640px;margin:0 auto;padding:20px;">
        <div style="background:linear-gradient(135deg,#f97316,#fb923c);padding:24px;border-radius:12px;text-align:center;margin-bottom:20px;">
          <h1 style="color:white;margin:0;font-size:20px;">📋 懸賞リサーチ チェックリスト</h1>
          <p style="color:rgba(255,255,255,0.9);margin:8px 0 0;font-size:14px;">公式サイトを順番にチェックして、新しいLINE懸賞を探しましょう</p>
        </div>

        <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:14px 16px;margin-bottom:20px;">
          <p style="margin:0;color:#92400e;font-size:13px;line-height:1.7;">
            <strong>使い方：</strong><br>
            1. 各企業の「公式キャンペーン」or「公式LINE」を開く<br>
            2. LINE懸賞があれば、応募ページの <strong>lin.ee / line.me のURL</strong> をコピー<br>
            3. サイトの管理画面から手動で追加（タイトル・締切・当選者数・自分の言葉で説明）
          </p>
        </div>

        <table style="width:100%;border-collapse:collapse;border:1px solid #fed7aa;border-radius:8px;overflow:hidden;">
          <thead>
            <tr style="background:#fff7ed;">
              <th style="padding:10px 8px;text-align:left;color:#9a3412;font-size:12px;">#</th>
              <th style="padding:10px 8px;text-align:left;color:#9a3412;font-size:12px;">企業・ブランド</th>
              <th style="padding:10px 8px;text-align:left;color:#9a3412;font-size:12px;">公式CP</th>
              <th style="padding:10px 8px;text-align:left;color:#9a3412;font-size:12px;">公式LINE</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>

        <div style="text-align:center;margin:24px 0;">
          <a href="${SITE_URL}"
             style="background:linear-gradient(135deg,#f97316,#fb923c);color:white;padding:14px 36px;border-radius:50px;text-decoration:none;font-weight:bold;font-size:15px;display:inline-block;">
            サイトを開く →
          </a>
        </div>

        <p style="color:#9ca3af;font-size:11px;text-align:center;line-height:1.6;">
          ※ このメールは他社サイトの内容を転載していません。公式ページへのリンク集です。<br>
          © 2026 LINE懸賞まとめ
        </p>
      </div>
    `,
  })

  console.log(`リサーチリマインダーを送信しました: ${ADMIN_EMAIL}`)
}

async function main() {
  const jstHour = new Date(Date.now() + 9 * 60 * 60 * 1000).getUTCHours()
  console.log(`実行時刻: JST ${jstHour}時`)
  console.log(`チェック対象: ${companies.length}社`)
  await sendReminderEmail()
  console.log('完了！')
}

main().catch(console.error)
