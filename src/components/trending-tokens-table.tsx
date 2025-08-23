'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useTrendingTokens } from '@/lib/hooks/useTrendingTokens'
import { usePrefetch } from '@/lib/hooks/usePrefetch'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  formatPrice, 
  formatMarketCap, 
  formatVolume, 
  formatPriceChange 
} from '@/lib/utils/formatters'

export function TrendingTokensTable() {
  const { data: tokens, isLoading, error } = useTrendingTokens()
  const queryClient = useQueryClient()
  const { prefetchToken, isPrefetching, prefetchingCount } = usePrefetch()

  // Prefetch top 3 tokens immediately when table loads
  useEffect(() => {
    if (tokens && tokens.length > 0) {
      const topTokens = tokens.slice(0, 3) // Prefetch top 3 tokens
      topTokens.forEach(token => {
        if (token.symbol) {
          const tokenSymbol = token.symbol.toLowerCase()
          // Only prefetch if not already cached
          const cachedData = queryClient.getQueryData(['token-data', tokenSymbol])
          if (!cachedData) {
            // Prefetch immediately without delay
            prefetchToken(token.symbol)
          }
        }
      })
    }
  }, [tokens, queryClient, prefetchToken])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trending Tokens</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-2">Loading trending tokens...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trending Tokens</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-red-600">
            Error loading trending tokens: {error.message}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!tokens || tokens.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trending Tokens</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-gray-500">
            No trending tokens found
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Trending Tokens</span>
          <div className="flex items-center space-x-2 flex-nowrap">
            {prefetchingCount > 0 && (
              <Badge variant="outline" className="text-xs">
                Prefetching {prefetchingCount} token{prefetchingCount > 1 ? 's' : ''}...
              </Badge>
            )}
            <Badge variant="secondary">
              <span className="hidden sm:inline">Auto-refresh every minute</span>
              <span className="sm:hidden flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                1 min
              </span>
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Rank</TableHead>
              <TableHead className="w-48">Token</TableHead>
              <TableHead className="w-24">Price</TableHead>
              <TableHead className="w-28">
                <span className="hidden sm:inline">24h Change</span>
                <span className="sm:hidden">24h</span>
              </TableHead>
              <TableHead className="w-32">
                <span className="hidden sm:inline">Market Cap</span>
                <span className="sm:hidden">Mkt Cap</span>
              </TableHead>
              <TableHead className="w-32">
                <span className="hidden sm:inline">Volume (24h)</span>
                <span className="sm:hidden">Volume</span>
              </TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tokens.map((token, index) => {
              const tokenSymbol = (token.symbol || 'unknown').toLowerCase()
              const isPrefetchingToken = isPrefetching(tokenSymbol)
              
              return (
                <TableRow key={token.id || index}>
                  <TableCell className="font-medium">
                    #{token.market_cap_rank || index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2 min-w-0 flex-nowrap">
                      <Image
                        src={token.thumb || '/placeholder-coin.svg'}
                        alt={token.name || 'Token'}
                        width={24}
                        height={24}
                        className="rounded-full"
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          const target = e.target as HTMLImageElement
                          target.src = '/placeholder-coin.svg'
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-medium truncate">{token.name || 'Unknown Token'}</div>
                        <div className="text-sm text-gray-500 truncate">{(token.symbol || 'UNKNOWN').toUpperCase()}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatPrice(token.data?.price || 0)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={(token.data?.price_change_percentage_24h?.usd || 0) >= 0 ? 'default' : 'destructive'}
                    >
                      {formatPriceChange(token.data?.price_change_percentage_24h?.usd || 0)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {formatMarketCap(token.data?.market_cap || '0')}
                  </TableCell>
                  <TableCell>
                    {formatVolume(token.data?.total_volume || '0')}
                  </TableCell>
                  <TableCell>
                    <Link 
                      href={`/token/${tokenSymbol}`}
                      prefetch={true}
                      onMouseEnter={() => prefetchToken(token.symbol || 'unknown')}
                    >
                      <Button 
                        variant="outline" 
                        size="sm"
                        disabled={isPrefetchingToken}
                        className={isPrefetchingToken ? 'opacity-75' : ''}
                      >
                        {isPrefetchingToken ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b border-current mr-2"></div>
                            <span className="hidden sm:inline">Loading...</span>
                            <span className="sm:hidden">Load</span>
                          </>
                        ) : (
                          <>
                            <span className="hidden sm:inline">View Details</span>
                            <span className="sm:hidden">Details</span>
                          </>
                        )}
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
