import { findMintAddress } from './solana';
import { logger } from '@/lib/utils/logger';

const RAYDIUM_API_URL =
  process.env.NEXT_PUBLIC_RAYDIUM_API_URL || 'https://api-v3.raydium.io';
const RAYDIUM_PRICE_ENDPOINT =
  process.env.NEXT_PUBLIC_RAYDIUM_PRICE_ENDPOINT || '/mint/price';
const COINGECKO_API_URL =
  process.env.NEXT_PUBLIC_COINGECKO_API_URL ||
  'https://api.coingecko.com/api/v3';
const COINGECKO_SIMPLE_PRICE_ENDPOINT =
  process.env.NEXT_PUBLIC_COINGECKO_SIMPLE_PRICE_ENDPOINT || '/simple/price';

export interface RaydiumTokenData {
  price: number;
  marketCap?: number;
  volume24h?: number;
  priceChangePercent24h?: number;
}

interface RaydiumPriceResponse {
  id: string;
  success: boolean;
  data: Record<string, string | null>;
}

interface CoinGeckoPriceResponse {
  [key: string]: {
    usd: number;
    usd_market_cap?: number;
    usd_24h_vol?: number;
    usd_24h_change?: number;
  };
}

async function getTokenPriceFromRaydium(
  mintAddress: string
): Promise<number | null> {
  try {
    logger.debug(`Fetching Raydium price for mint: ${mintAddress}`);

    const response = await fetch(
      `${RAYDIUM_API_URL}${RAYDIUM_PRICE_ENDPOINT}?mints=${mintAddress}`
    );

    logger.debug(
      `Raydium API Response Status: ${response.status} ${response.statusText}`
    );

    if (!response.ok) {
      throw new Error(`Raydium API error: ${response.status}`);
    }

    const data: RaydiumPriceResponse = await response.json();

    logger.debug('Raydium API Response Data', data);

    if (!data.success || !data.data || !data.data[mintAddress]) {
      logger.warn(`No price data found for mint: ${mintAddress}`);
      return null;
    }

    const price = parseFloat(data.data[mintAddress]!);
    if (isNaN(price)) {
      logger.warn(`Invalid price data for mint: ${mintAddress}`, {
        price: data.data[mintAddress],
      });
      return null;
    }

    logger.info(`Raydium API successful, price: ${price}`);
    return price;
  } catch (error) {
    logger.error('Error fetching price from Raydium', {
      mintAddress,
      error: error instanceof Error ? error.message : error,
    });
    return null;
  }
}

async function getTokenDataFromCoinGecko(
  symbol: string
): Promise<RaydiumTokenData | null> {
  try {
    await new Promise(resolve => setTimeout(resolve, 100));

    const response = await fetch(
      `${COINGECKO_API_URL}${COINGECKO_SIMPLE_PRICE_ENDPOINT}?ids=${symbol.toLowerCase()}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true`
    );

    if (!response.ok) {
      if (response.status === 429) {
        logger.warn('CoinGecko API rate limited', { symbol });
        return null;
      }
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data: CoinGeckoPriceResponse = await response.json();
    const tokenData = data[symbol.toLowerCase()];

    if (!tokenData) {
      logger.warn('Token not found in CoinGecko', { symbol });
      return null;
    }

    return {
      price: tokenData.usd || 0,
      marketCap: tokenData.usd_market_cap || 0,
      volume24h: tokenData.usd_24h_vol || 0,
      priceChangePercent24h: tokenData.usd_24h_change || 0,
    };
  } catch (error) {
    logger.error('Error fetching token data from CoinGecko', {
      symbol,
      error: error instanceof Error ? error.message : error,
    });
    return null;
  }
}

export async function getTokenData(
  symbol: string
): Promise<RaydiumTokenData | null> {
  try {
    logger.debug(`Fetching token data for symbol: ${symbol}`);

    const mintAddress = await findMintAddress(symbol);

    if (mintAddress) {
      logger.debug(`Found mint address: ${mintAddress} for symbol: ${symbol}`);

      const raydiumPrice = await getTokenPriceFromRaydium(mintAddress);

      if (raydiumPrice !== null) {
        logger.info(
          'Raydium API successful, trying CoinGecko for additional data'
        );

        const coinGeckoData = await getTokenDataFromCoinGecko(symbol);

        return {
          price: raydiumPrice,
          marketCap: coinGeckoData?.marketCap,
          volume24h: coinGeckoData?.volume24h,
          priceChangePercent24h: coinGeckoData?.priceChangePercent24h,
        };
      } else {
        logger.warn('Raydium API failed, falling back to CoinGecko');
      }
    } else {
      logger.warn('No mint address found, trying CoinGecko', { symbol });
    }

    // Fallback to CoinGecko
    logger.debug('Falling back to CoinGecko API');
    const coinGeckoData = await getTokenDataFromCoinGecko(symbol);

    if (coinGeckoData) {
      logger.info('CoinGecko fallback successful', {
        symbol,
        price: coinGeckoData.price,
      });
      return coinGeckoData;
    }

    logger.warn('All data sources failed', { symbol });
    return null;
  } catch (error) {
    logger.error('Error fetching token data', {
      symbol,
      error: error instanceof Error ? error.message : error,
    });
    return null;
  }
}

/**
 * Get pools data from Raydium (placeholder for future implementation)
 */
export async function getPoolsData(): Promise<unknown[]> {
  // This could be implemented to fetch pool data from Raydium
  // For now, return empty array
  return [];
}
