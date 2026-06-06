export const metadata = {
  title: 'プライバシーポリシー',
  description: 'LINE懸賞まとめのプライバシーポリシーページです。',
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-orange-50">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 py-10 px-4 text-center">
        <h1 className="text-3xl font-black text-white">プライバシーポリシー</h1>
        <p className="text-orange-100 mt-2 text-sm">Privacy Policy</p>
      </div>

      {/* 本文 */}
      <div className="max-w-3xl mx-auto px-6 py-12 bg-white my-8 rounded-2xl shadow-sm">

        <p className="text-gray-600 text-sm mb-8">
          LINE懸賞まとめ（以下「当サイト」）は、ユーザーの個人情報の取り扱いについて、以下のとおりプライバシーポリシーを定めます。
        </p>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 border-l-4 border-orange-400 pl-3 mb-4">
            1. 収集する情報について
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            当サイトでは、お問い合わせや各種サービスのご利用の際に、お名前・メールアドレス等の個人情報をご提供いただく場合があります。また、アクセス解析ツールを使用してアクセス情報（IPアドレス、ブラウザの種類、閲覧ページ等）を収集することがあります。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 border-l-4 border-orange-400 pl-3 mb-4">
            2. 広告について（Google AdSense）
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            当サイトでは、第三者配信の広告サービス「Google AdSense」を利用しています。Google AdSenseは、ユーザーの興味に応じた広告を表示するためにCookieを使用することがあります。Cookieを無効にする設定およびGoogle AdSenseに関する詳細は、
            <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-orange-500 underline">
              Googleの広告に関するポリシー
            </a>
            をご覧ください。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 border-l-4 border-orange-400 pl-3 mb-4">
            3. アクセス解析ツールについて
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            当サイトでは、Googleによるアクセス解析ツール「Google Analytics」を使用しています。Google Analyticsはデータの収集のためにCookieを使用しています。このデータは匿名で収集されており、個人を特定するものではありません。この機能はCookieを無効にすることで収集を拒否することができます。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 border-l-4 border-orange-400 pl-3 mb-4">
            4. 掲載情報について
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            当サイトに掲載している懸賞情報は、各企業・団体の公式キャンペーン情報を収集・掲載したものです。応募・当選に関するお問い合わせは、各企業・団体へ直接お願いします。当サイトは懸賞の主催者ではなく、情報提供を目的としています。掲載情報の正確性については万全を期しておりますが、内容の完全性・正確性を保証するものではありません。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 border-l-4 border-orange-400 pl-3 mb-4">
            5. 外部リンクについて
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            当サイトに掲載されているリンクから外部サイトに移動した場合、移動先サイトで提供される情報・サービスについて、当サイトは責任を負いかねます。各リンク先のプライバシーポリシーをご確認ください。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 border-l-4 border-orange-400 pl-3 mb-4">
            6. 個人情報の管理
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            当サイトは、収集した個人情報を適切に管理し、第三者への提供・開示は行いません。ただし、法令に基づく場合や、ユーザー本人の同意がある場合はこの限りではありません。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 border-l-4 border-orange-400 pl-3 mb-4">
            7. プライバシーポリシーの変更
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            当サイトは、必要に応じて本プライバシーポリシーを変更することがあります。変更後のプライバシーポリシーは当サイトに掲載した時点から効力を生じるものとします。
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-bold text-gray-800 border-l-4 border-orange-400 pl-3 mb-4">
            8. お問い合わせ
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            当サイトのプライバシーポリシーに関するお問い合わせは、サイト管理者までご連絡ください。
          </p>
        </section>

        <p className="text-xs text-gray-400 mt-10 text-right">制定日：2026年6月</p>
      </div>

      {/* フッター */}
      <footer className="bg-gray-800 text-gray-400 mt-4">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <a href="/" className="text-white font-bold flex items-center gap-2">
            <span>🎁</span> LINE懸賞まとめ
          </a>
          <p className="text-xs text-gray-600">© 2026 LINE懸賞まとめ</p>
        </div>
      </footer>
    </main>
  )
}
