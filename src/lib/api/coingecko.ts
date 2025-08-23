import { logger } from '@/lib/utils/logger';

const COINGECKO_API_URL =
  process.env.NEXT_PUBLIC_COINGECKO_API_URL ||
  'https://api.coingecko.com/api/v3';
const COINGECKO_TRENDING_ENDPOINT =
  process.env.NEXT_PUBLIC_COINGECKO_TRENDING_ENDPOINT || '/search/trending';

export interface CoinGeckoTrendingToken {
  id: string;
  coin_id: number;
  name: string;
  symbol: string;
  market_cap_rank: number;
  thumb: string;
  small: string;
  large: string;
  slug: string;
  price_btc: number;
  score: number;
  data: {
    price: number;
    price_btc: string;
    price_change_percentage_24h: {
      usd: number;
      [key: string]: number;
    };
    market_cap: string;
    market_cap_btc: string;
    total_volume: string;
    total_volume_btc: string;
    sparkline: string;
    content: {
      title: string;
      description: string;
    };
  };
}

interface CoinGeckoTrendingResponse {
  coins: Array<{ item: CoinGeckoTrendingToken }>;
  exchanges: unknown[];
  categories: unknown[];
  nfts: unknown[];
}

export async function getTrendingTokens(): Promise<CoinGeckoTrendingToken[]> {
  try {
    logger.info('Fetching trending tokens from CoinGecko');

    const response = await fetch(
      `${COINGECKO_API_URL}${COINGECKO_TRENDING_ENDPOINT}`
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data: CoinGeckoTrendingResponse = await response.json();

    if (!data.coins || !Array.isArray(data.coins)) {
      throw new Error('Invalid response format from CoinGecko API');
    }

    const tokens = data.coins.map(coin => coin.item);

    logger.info(`Successfully fetched ${tokens.length} trending tokens`);
    return tokens;
  } catch (error) {
    logger.error('Error fetching trending tokens', {
      error: error instanceof Error ? error.message : error,
    });
    throw error;
  }
}

export async function getTokenPrice(tokenId: string): Promise<number> {
  try {
    const response = await fetch(
      `${COINGECKO_API_URL}/simple/price?ids=${tokenId}&vs_currencies=usd`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data[tokenId]?.usd || 0;
  } catch (error) {
    logger.error('Error fetching token price', {
      error: error instanceof Error ? error.message : error,
    });
    return 0;
  }
}
