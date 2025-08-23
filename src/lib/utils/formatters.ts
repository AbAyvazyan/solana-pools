/**
 * Format price with appropriate decimal places
 */
export function formatPrice(price: number): string {
  if (!price || isNaN(price)) return '$0.00';
  if (price < 0.01) {
    return `$${price.toFixed(8)}`;
  }
  return `$${price.toFixed(4)}`;
}

/**
 * Format market cap with appropriate units (K, M, B)
 * Handles both number and string inputs (for CoinGecko API compatibility)
 */
export function formatMarketCap(marketCap: number | string): string {
  if (!marketCap) return '$0.00';

  let numericValue: number;
  if (typeof marketCap === 'string') {
    // Remove the $ and commas, then parse as number
    numericValue = parseFloat(marketCap.replace(/[$,]/g, ''));
  } else {
    numericValue = marketCap;
  }

  if (isNaN(numericValue)) return '$0.00';

  if (numericValue >= 1e9) {
    return `$${(numericValue / 1e9).toFixed(2)}B`;
  }
  if (numericValue >= 1e6) {
    return `$${(numericValue / 1e6).toFixed(2)}M`;
  }
  if (numericValue >= 1e3) {
    return `$${(numericValue / 1e3).toFixed(2)}K`;
  }
  return `$${numericValue.toFixed(2)}`;
}

/**
 * Format volume with appropriate units (K, M, B)
 * Handles both number and string inputs (for CoinGecko API compatibility)
 */
export function formatVolume(volume: number | string): string {
  if (!volume) return '$0.00';

  let numericValue: number;
  if (typeof volume === 'string') {
    // Remove the $ and commas, then parse as number
    numericValue = parseFloat(volume.replace(/[$,]/g, ''));
  } else {
    numericValue = volume;
  }

  if (isNaN(numericValue)) return '$0.00';

  if (numericValue >= 1e9) {
    return `$${(numericValue / 1e9).toFixed(2)}B`;
  }
  if (numericValue >= 1e6) {
    return `$${(numericValue / 1e6).toFixed(2)}M`;
  }
  if (numericValue >= 1e3) {
    return `$${(numericValue / 1e3).toFixed(2)}K`;
  }
  return `$${numericValue.toFixed(2)}`;
}

/**
 * Format supply with appropriate units (K, M, B)
 */
export function formatSupply(supply: number): string {
  if (!supply || isNaN(supply)) return '0';
  if (supply >= 1e9) {
    return `${(supply / 1e9).toFixed(2)}B`;
  }
  if (supply >= 1e6) {
    return `${(supply / 1e6).toFixed(2)}M`;
  }
  if (supply >= 1e3) {
    return `${(supply / 1e3).toFixed(2)}K`;
  }
  return supply.toFixed(2);
}

/**
 * Format price change percentage with sign
 */
export function formatPriceChange(change: number): string {
  if (!change || isNaN(change)) return '0.00%';
  const isPositive = change >= 0;
  const sign = isPositive ? '+' : '';
  return `${sign}${change.toFixed(2)}%`;
}

/**
 * Format number with commas for better readability
 */
export function formatNumberWithCommas(num: number): string {
  return num.toLocaleString('en-US');
}

/**
 * Format percentage with sign and color indication
 */
export function formatPercentage(value: number): {
  text: string;
  isPositive: boolean;
} {
  const isPositive = value >= 0;
  const sign = isPositive ? '+' : '';
  return {
    text: `${sign}${value.toFixed(2)}%`,
    isPositive,
  };
}
