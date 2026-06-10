import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const siteUrl = "https://kensho-site.vercel.app";

export const metadata: Metadata = {
  title: {
    default: "LINE懸賞まとめ｜LINEで応募できる懸賞情報を毎日更新",
    template: "%s｜LINE懸賞まとめ",
  },
  description:
    "LINEで応募できる懸賞・プレゼント情報を毎日自動収集！ハワイ旅行・最新家電・ギフトカード・食品など豪華賞品が多数。締切順・当選者数順でかんたんに絞り込みできます。",
  keywords: [
    "LINE懸賞",
    "LINE応募",
    "懸賞まとめ",
    "プレゼントキャンペーン",
    "懸賞情報",
    "ギフトカード懸賞",
    "食品懸賞",
    "旅行懸賞",
    "家電懸賞",
    "無料応募",
  ],
  authors: [{ name: "LINE懸賞まとめ" }],
  creator: "LINE懸賞まとめ",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: siteUrl,
    siteName: "LINE懸賞まとめ",
    title: "LINE懸賞まとめ｜LINEで応募できる懸賞情報を毎日更新",
    description:
      "LINEで応募できる懸賞・プレゼント情報を毎日自動収集！豪華賞品多数。締切順・当選者数順でかんたん絞り込み。",
    images: [
      {
        url: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1200&h=630&fit=crop",
        width: 1200,
        height: 630,
        alt: "LINE懸賞まとめ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LINE懸賞まとめ｜LINEで応募できる懸賞情報を毎日更新",
    description:
      "LINEで応募できる懸賞・プレゼント情報を毎日自動収集！豪華賞品多数。",
    images: [
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1200&h=630&fit=crop",
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    google: "KQ1C6TAGZRM8YeL_SJPpVSuQvqS9ffegC3f2Otmt_Zw",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${geistSans.variable} h-full antialiased`}>
      <head>
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-7QHWVM0KJE" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-7QHWVM0KJE');
            `,
          }}
        />
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3203826802776173"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
