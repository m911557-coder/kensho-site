'use client'

export default function AffiliateSection() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-4">
      <div className="bg-white rounded-xl border border-orange-100 px-5 py-4 flex flex-col sm:flex-row items-center gap-4 shadow-sm">
        <div className="flex-1">
          <p className="text-xs text-gray-400 mb-1">PR</p>
          <p className="text-sm font-bold text-gray-700">
            懸賞で旅行を当てたら、楽天トラベルでもお得に！
          </p>
          <p className="text-xs text-gray-500 mt-1">
            国内・海外ホテル・航空券の予約はRakuten Travel
          </p>
        </div>
        <a
          href="https://rpx.a8.net/svt/ejp?a8mat=4BAI1M+2Z61O2+2HOM+6I9N5&rakuten=y&a8ejpredirect=http%3A%2F%2Fhb.afl.rakuten.co.jp%2Fhgc%2F0eb4779e.5d30c5ba.0eb4779f.b871e4e3%2Fa26083051346_4BAI1M_2Z61O2_2HOM_6I9N5%3Fpc%3Dhttp%253A%252F%252Ftravel.rakuten.co.jp%252F%26m%3Dhttp%253A%252F%252Ftravel.rakuten.co.jp%252F"
          rel="nofollow"
          target="_blank"
          className="shrink-0"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="http://hbb.afl.rakuten.co.jp/hsb/0ea7f9a4.79280dcb.0ea7f99d.1ac92fca/153145/"
            border="0"
            alt="楽天トラベル"
            style={{ border: 'none' }}
          />
        </a>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img border="0" width="1" height="1" src="https://www18.a8.net/0.gif?a8mat=4BAI1M+2Z61O2+2HOM+6I9N5" alt="" />
      </div>
    </div>
  )
}
