import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '苦潮チェック',
  description: '白塚漁港〜宮川河口の苦潮発生可能性チェック',
  manifest: '/kushio-manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: '苦潮チェック',
    statusBarStyle: 'black-translucent',
  },
  icons: {
    apple: '/icons/icon-180.png',
    icon: '/icons/icon-192.png',
  },
}

export default function KushioLayout({ children }: { children: React.ReactNode }) {
  return children
}
