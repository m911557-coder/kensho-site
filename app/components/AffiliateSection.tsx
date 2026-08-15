'use client'

// もしもアフィリエイト Amazon.co.jp バナー
// 承認後: Vercel環境変数に NEXT_PUBLIC_MOSHIMO_A_ID を追加すると自動で表示される
const MOSHIMO_A_ID = process.env.NEXT_PUBLIC_MOSHIMO_A_ID

export default function AffiliateSection() {
  if (!MOSHIMO_A_ID) return null

  return (
    <div className="max-w-5xl mx-auto px-6 py-4">
      <div className="bg-white rounded-xl border border-orange-100 px-5 py-4 flex flex-col sm:flex-row items-center gap-4 shadow-sm">
        <div className="flex-1">
          <p className="text-xs text-gray-400 mb-1">PR</p>
          <p className="text-sm font-bold text-gray-700">
            懸賞に当たったら何を買う？Amazonで今すぐチェック
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Amazonギフトカードが当たる懸賞を多数掲載中！
          </p>
        </div>
        <a
          href={`https://af.moshimo.com/af/c/click?a_id=${MOSHIMO_A_ID}&p_id=170&pc_id=185&pl_id=4062&url=https%3A%2F%2Fwww.amazon.co.jp%2F`}
          rel="nofollow"
          referrerPolicy="no-referrer-when-downgrade"
          target="_blank"
          className="shrink-0"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://image.moshimo.com/af-img/0170/000000185.gif`}
            width={120}
            height={60}
            alt="Amazon.co.jp"
            style={{ border: 'none' }}
          />
        </a>
        {/* インプレッション計測 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://i.moshimo.com/af/i/impression?a_id=${MOSHIMO_A_ID}&p_id=170&pc_id=185&pl_id=4062`}
          alt=""
          style={{ border: 'none', width: 1, height: 1 }}
        />
      </div>
    </div>
  )
}
