import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/lib/providers'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#9945FF',
  colorScheme: 'dark light',
}

export const metadata: Metadata = {
  title: 'Solana Pools - Real-time Token Analytics',
  description: 'Track trending Solana tokens, view real-time prices, market caps, and token metadata. Built with Next.js and powered by Solana RPC, Raydium, and CoinGecko APIs.',
  keywords: 'Solana, cryptocurrency, tokens, DeFi, blockchain, crypto analytics, token prices, market cap, Raydium, CoinGecko',
  authors: [{ name: 'Solana Pools Team' }],
  creator: 'Solana Pools',
  publisher: 'Solana Pools',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Solana Pools - Real-time Token Analytics',
    description: 'Track trending Solana tokens, view real-time prices, market caps, and token metadata.',
    url: '/',
    siteName: 'Solana Pools',
    images: [
      {
        url: '/solana-pools-og.svg',
        width: 1200,
        height: 630,
        alt: 'Solana Pools - Real-time Token Analytics',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Solana Pools - Real-time Token Analytics',
    description: 'Track trending Solana tokens, view real-time prices, market caps, and token metadata.',
    images: ['/solana-pools-og.svg'],
    creator: '@solanapools',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/favicon.svg" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#9945FF" />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
