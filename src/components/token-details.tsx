'use client';

import { useTokenData } from '@/lib/hooks/useTokenData';
import { usePrefetch } from '@/lib/hooks/usePrefetch';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {
  formatPrice,
  formatMarketCap,
  formatVolume,
  formatSupply,
  formatPriceChange,
} from '@/lib/utils/formatters';

interface TokenDetailsProps {
  symbol: string;
}

export function TokenDetails({ symbol }: TokenDetailsProps) {
  const { data: token, isLoading, error } = useTokenData(symbol);
  const queryClient = useQueryClient();
  const { prefetchToken, isPrefetching } = usePrefetch();

  // Prefetch related tokens immediately when this page loads
  useEffect(() => {
    const relatedTokens = ['btc', 'eth', 'sol'];
    relatedTokens.forEach(relatedSymbol => {
      if (relatedSymbol !== symbol.toLowerCase()) {
        // Only prefetch if not already cached
        const cachedData = queryClient.getQueryData([
          'token-data',
          relatedSymbol,
        ]);
        if (!cachedData) {
          // Prefetch immediately without delay
          prefetchToken(relatedSymbol);
        }
      }
    });
  }, [symbol, queryClient, prefetchToken]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            {/* Header with loading state */}
            <div className="flex items-center justify-between w-full flex-col sm:flex-row gap-4 sm:gap-0">
              <div className="flex items-center space-x-4 flex-nowrap flex-col sm:flex-row gap-2 sm:gap-4">
                <Link href="/" prefetch={true}>
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Trending
                  </Button>
                </Link>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                  <div>
                    <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mt-2"></div>
                  </div>
                </div>
              </div>
              <Badge variant="secondary">Loading...</Badge>
            </div>

            {/* Loading skeleton */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Current Price</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-12 w-32 bg-gray-200 rounded animate-pulse"></div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <Card key={i}>
                    <CardHeader>
                      <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            {/* Header with error state */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/" prefetch={true}>
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Trending
                  </Button>
                </Link>
              </div>
            </div>

            <Card>
              <CardContent className="flex items-center justify-center py-8 text-red-600">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">
                    Error loading token data
                  </h3>
                  <p className="text-sm">{error.message}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    This token may not be available in our data sources
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            {/* Header with not found state */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/" prefetch={true}>
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Trending
                  </Button>
                </Link>
              </div>
            </div>

            <Card>
              <CardContent className="flex items-center justify-center py-8 text-gray-500">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">
                    Token not found
                  </h3>
                  <p className="text-sm">
                    This token is not available in our real-time data sources
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Try searching for a different token or check the spelling
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const isPricePositive = (token.priceChangePercent24h || 0) >= 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between w-full flex-col sm:flex-row gap-4 sm:gap-0">
            <div className="flex items-center space-x-4 flex-nowrap flex-col sm:flex-row gap-2 sm:gap-4">
              <Link href="/" prefetch={true}>
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Trending
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                {token.solana?.logoURI && (
                  <Image
                    src={token.solana.logoURI}
                    alt={token.name || 'Token'}
                    width={48}
                    height={48}
                    className="rounded-full"
                    onError={e => {
                      // Hide image if it fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                )}
                <div>
                  <h1 className="text-2xl font-bold">
                    {token.name || 'Unknown Token'}
                  </h1>
                  <p className="text-gray-500">
                    {(token.symbol || 'UNKNOWN').toUpperCase()}
                  </p>
                </div>
              </div>
            </div>
            <Badge variant="secondary">
              <span className="hidden sm:inline">
                Auto-refresh every minute
              </span>
              <span className="sm:hidden flex items-center">
                <svg
                  className="w-3 h-3 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                1 min
              </span>
            </Badge>
          </div>

          {/* Price Card */}
          <Card>
            <CardHeader>
              <CardTitle>Current Price</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="text-3xl font-bold">
                  {formatPrice(token.price)}
                </div>
                <div className="flex items-center space-x-2 flex-nowrap">
                  {isPricePositive ? (
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-600" />
                  )}
                  <Badge variant={isPricePositive ? 'default' : 'destructive'}>
                    {formatPriceChange(token.priceChangePercent24h || 0)}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                24h change: {isPricePositive ? '+' : ''}
                {(token.priceChange24h || 0).toFixed(4)} USD
              </p>
            </CardContent>
          </Card>

          {/* Market Data Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Market Cap</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatMarketCap(token.marketCap)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">24h Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatVolume(token.volume24h)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Circulating Supply</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatSupply(token.solana?.supply || 0)}
                </div>
                <p className="text-sm text-gray-500">
                  {token.solana?.decimals || 0} decimals
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Token ID</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-mono break-all">
                  {token.id || 'N/A'}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Related Tokens */}
          <Card>
            <CardHeader>
              <CardTitle>Related Tokens</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                {['btc', 'eth', 'sol'].map(
                  relatedSymbol =>
                    relatedSymbol !== symbol.toLowerCase() && (
                      <Link
                        key={relatedSymbol}
                        href={`/token/${relatedSymbol}`}
                        prefetch={true}
                        onMouseEnter={() => prefetchToken(relatedSymbol)}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isPrefetching(relatedSymbol)}
                          className={
                            isPrefetching(relatedSymbol) ? 'opacity-75' : ''
                          }
                        >
                          {isPrefetching(relatedSymbol) ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b border-current mr-2"></div>
                              Loading...
                            </>
                          ) : (
                            relatedSymbol.toUpperCase()
                          )}
                        </Button>
                      </Link>
                    )
                )}
              </div>
            </CardContent>
          </Card>

          {/* Solana Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Solana Token Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Token Name
                  </label>
                  <p className="text-lg">{token.solana?.name || 'Unknown'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Token Symbol
                  </label>
                  <p className="text-lg">{token.solana?.symbol || 'UNKNOWN'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Total Supply
                  </label>
                  <p className="text-lg">
                    {formatSupply(token.solana?.supply || 0)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Decimals
                  </label>
                  <p className="text-lg">{token.solana?.decimals || 0}</p>
                </div>
                {token.solana?.mintAddress && (
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-500">
                      Mint Address
                    </label>
                    <p className="text-sm font-mono break-all">
                      {token.solana.mintAddress}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
