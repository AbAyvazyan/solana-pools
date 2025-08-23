import { useQueryClient } from '@tanstack/react-query'
import { useState, useRef } from 'react'
import { logger } from '@/lib/utils/logger'

export function usePrefetch() {
  const queryClient = useQueryClient()
  const [prefetchingTokens, setPrefetchingTokens] = useState<Set<string>>(new Set())
  const prefetchTimeouts = useRef<Map<string, NodeJS.Timeout>>(new Map())

  const prefetchToken = async (symbol: string) => {
    const tokenSymbol = symbol.toLowerCase()
    
    // Check if already cached with the correct query key
    const cachedData = queryClient.getQueryData(['token-data', tokenSymbol])
    if (cachedData) {
      return // Already cached, no need to prefetch
    }

    // Check if already prefetching
    if (prefetchingTokens.has(tokenSymbol)) {
      return // Already prefetching this token
    }

    // Clear any existing timeout for this token
    const existingTimeout = prefetchTimeouts.current.get(tokenSymbol)
    if (existingTimeout) {
      clearTimeout(existingTimeout)
    }

    // Add a small delay to prevent rapid prefetch requests
    const timeout = setTimeout(async () => {
      setPrefetchingTokens(prev => new Set(prev).add(tokenSymbol))
      
      try {
        await queryClient.prefetchQuery({
          queryKey: ['token-data', tokenSymbol], // Use the same query key as useTokenData
          queryFn: () => fetch(`/api/token/${tokenSymbol}`).then(res => {
            if (!res.ok) {
              throw new Error('Failed to fetch token data')
            }
            return res.json()
          }),
          staleTime: 60 * 1000, // 1 minute
        })
        logger.debug(`Prefetched data for ${tokenSymbol}`)
      } catch (error) {
        logger.warn('Prefetch failed', { tokenSymbol, error: error instanceof Error ? error.message : error })
      } finally {
        setPrefetchingTokens(prev => {
          const newSet = new Set(prev)
          newSet.delete(tokenSymbol)
          return newSet
        })
        prefetchTimeouts.current.delete(tokenSymbol)
      }
    }, 100) // Reduced delay to 100ms for faster prefetching

    prefetchTimeouts.current.set(tokenSymbol, timeout)
  }

  const isPrefetching = (symbol: string) => {
    return prefetchingTokens.has(symbol.toLowerCase())
  }

  const prefetchMultiple = async (symbols: string[]) => {
    const promises = symbols.map(symbol => prefetchToken(symbol))
    await Promise.allSettled(promises)
  }

  return {
    prefetchToken,
    isPrefetching,
    prefetchMultiple,
    prefetchingCount: prefetchingTokens.size
  }
}
