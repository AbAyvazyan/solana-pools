import { useQuery } from '@tanstack/react-query';
import { CoinGeckoTrendingToken } from '@/lib/api/coingecko';

async function fetchTrendingTokens(): Promise<CoinGeckoTrendingToken[]> {
  const response = await fetch('/api/trending');

  if (!response.ok) {
    throw new Error('Failed to fetch trending tokens');
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch trending tokens');
  }

  return data.data;
}

export function useTrendingTokens() {
  return useQuery({
    queryKey: ['trending-tokens'],
    queryFn: fetchTrendingTokens,
    refetchInterval: 60 * 1000, // Refetch every minute
    staleTime: 60 * 1000, // Consider data stale after 1 minute
  });
}
