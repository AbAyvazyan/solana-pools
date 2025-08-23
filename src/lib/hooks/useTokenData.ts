import { useQuery } from '@tanstack/react-query';

interface TokenData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  marketCap: number;
  volume24h: number;
  priceChange24h: number;
  priceChangePercent24h: number;
  solana: {
    name: string;
    symbol: string;
    supply: number;
    decimals: number;
    mintAddress?: string;
    logoURI?: string;
  };
}

async function fetchTokenData(symbol: string): Promise<TokenData> {
  const response = await fetch(`/api/token/${symbol}`);

  if (!response.ok) {
    throw new Error('Failed to fetch token data');
  }

  const data = await response.json();

  // Check if the response has an error property (API error)
  if (data.error) {
    throw new Error(data.error);
  }

  // Return the data directly since our API returns the token data directly
  return data;
}

export function useTokenData(symbol: string) {
  return useQuery({
    queryKey: ['token-data', symbol],
    queryFn: () => fetchTokenData(symbol),
    enabled: !!symbol,
    refetchInterval: 60 * 1000, // Refetch every minute
    staleTime: 60 * 1000, // Consider data stale after 1 minute
  });
}
