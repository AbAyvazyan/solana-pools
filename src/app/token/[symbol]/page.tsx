import { Metadata } from 'next'
import { TokenDetails } from '@/components/token-details'

interface TokenPageProps {
  params: Promise<{ symbol: string }>
}

export async function generateMetadata({ params }: TokenPageProps): Promise<Metadata> {
  const { symbol } = await params
  
  return {
    title: `${symbol.toUpperCase()} Token - Solana Pools`,
    description: `View real-time price, market cap, volume, and Solana metadata for ${symbol.toUpperCase()} token. Track ${symbol.toUpperCase()} performance with live data from Solana RPC, Raydium, and CoinGecko APIs.`,
    keywords: `${symbol.toUpperCase()}, Solana, cryptocurrency, token, DeFi, blockchain, crypto analytics, token prices, market cap, Raydium, CoinGecko`,
    openGraph: {
      title: `${symbol.toUpperCase()} Token - Solana Pools`,
      description: `View real-time price, market cap, volume, and Solana metadata for ${symbol.toUpperCase()} token.`,
      url: `/token/${symbol.toLowerCase()}`,
      images: [
        {
          url: '/solana-pools-og.svg',
          width: 1200,
          height: 630,
          alt: `${symbol.toUpperCase()} Token - Solana Pools`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${symbol.toUpperCase()} Token - Solana Pools`,
      description: `View real-time price, market cap, volume, and Solana metadata for ${symbol.toUpperCase()} token.`,
      images: ['/solana-pools-og.svg'],
    },
    alternates: {
      canonical: `/token/${symbol.toLowerCase()}`,
    },
  }
}

export default async function TokenPage({ params }: TokenPageProps) {
  const { symbol } = await params
  
  return <TokenDetails symbol={symbol} />
}
