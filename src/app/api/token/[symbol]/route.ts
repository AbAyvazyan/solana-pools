import { NextRequest, NextResponse } from 'next/server'
import { getTokenData } from '@/lib/api/raydium'
import { getTokenMetadata } from '@/lib/api/solana'
import { getTrendingTokens, CoinGeckoTrendingToken } from '@/lib/api/coingecko'
import { logger } from '@/lib/utils/logger'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  try {
    const { symbol } = await params
    
    if (!symbol) {
      return NextResponse.json(
        { error: 'Token symbol is required' },
        { status: 400 }
      )
    }

    logger.info('API Route: Fetching data for symbol', { symbol })

    let coinGeckoId: string | null = null
    let trendingTokenData: CoinGeckoTrendingToken | null = null
    
    try {
      const trendingTokens = await getTrendingTokens()
      const trendingToken = trendingTokens.find(token => 
        token.symbol?.toLowerCase() === symbol.toLowerCase()
      )
      
      if (trendingToken) {
        coinGeckoId = trendingToken.id
        trendingTokenData = trendingToken
        logger.info('Found token in trending data with CoinGecko ID', { symbol, coinGeckoId })
      }
    } catch (error) {
      logger.warn('Could not fetch trending data', { symbol, error: error instanceof Error ? error.message : error })
    }

    const solanaMetadata = await getTokenMetadata(symbol)
    logger.debug('Solana metadata', { symbol, metadata: solanaMetadata })
    
    const raydiumData = await getTokenData(symbol)
    logger.debug('Raydium data', { symbol, data: raydiumData })
    
    let finalPrice = raydiumData?.price || 0
    let finalMarketCap = raydiumData?.marketCap || 0
    let finalVolume24h = raydiumData?.volume24h || 0
    let finalPriceChangePercent24h = raydiumData?.priceChangePercent24h || 0
    
    if (trendingTokenData?.data) {
      logger.info('Using trending data for price information', { symbol })
      finalPrice = trendingTokenData.data.price || finalPrice
      finalMarketCap = trendingTokenData.data.market_cap ? parseFloat(trendingTokenData.data.market_cap.replace(/[$,]/g, '')) : finalMarketCap
      finalVolume24h = trendingTokenData.data.total_volume ? parseFloat(trendingTokenData.data.total_volume.replace(/[$,]/g, '')) : finalVolume24h
      finalPriceChangePercent24h = trendingTokenData.data.price_change_percentage_24h?.usd || finalPriceChangePercent24h
    }
    
    if (!solanaMetadata && !raydiumData && !trendingTokenData) {
      logger.warn('No real data available for token', { symbol })
      return NextResponse.json(
        { error: 'Token data not available' },
        { status: 404 }
      )
    }

    const tokenData = {
      id: coinGeckoId || symbol.toLowerCase(),
      name: trendingTokenData?.name || solanaMetadata?.name || symbol.toUpperCase(),
      symbol: trendingTokenData?.symbol || solanaMetadata?.symbol || symbol.toUpperCase(),
      price: finalPrice,
      marketCap: finalMarketCap,
      volume24h: finalVolume24h,
      priceChange24h: 0,
      priceChangePercent24h: finalPriceChangePercent24h,
      solana: {
        name: solanaMetadata?.name || trendingTokenData?.name || symbol.toUpperCase(),
        symbol: solanaMetadata?.symbol || trendingTokenData?.symbol || symbol.toUpperCase(),
        supply: solanaMetadata?.supply || 0,
        decimals: solanaMetadata?.decimals || 9,
        mintAddress: solanaMetadata?.mintAddress,
        logoURI: solanaMetadata?.logoURI || trendingTokenData?.thumb,
      }
    }

    logger.info('Returning combined token data', { symbol, tokenData })
    return NextResponse.json(tokenData)
  } catch (error) {
    logger.error('Error fetching token data', { symbol: params ? (await params).symbol : 'unknown', error: error instanceof Error ? error.message : error })
    return NextResponse.json(
      { error: 'Failed to fetch token data' },
      { status: 500 }
    )
  }
}
