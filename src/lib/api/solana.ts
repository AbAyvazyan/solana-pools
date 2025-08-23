import { Connection, PublicKey } from '@solana/web3.js'
import { logger } from '@/lib/utils/logger'

const SOLANA_RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com'
const JUPITER_TOKEN_LIST_URL = process.env.NEXT_PUBLIC_JUPITER_TOKEN_LIST_URL || 'https://token.jup.ag/all'

const connection = new Connection(SOLANA_RPC_URL)

export interface TokenMetadata {
  name: string
  symbol: string
  uri: string
  decimals: number
  supply: number
  mintAddress?: string
  logoURI?: string
}

interface JupiterToken {
  address: string
  chainId: number
  decimals: number
  name: string
  symbol: string
  logoURI: string
  tags: string[]
  extensions?: {
    coingeckoId?: string
  }
}

let tokenListCache: JupiterToken[] | null = null
let cacheTimestamp = 0
const CACHE_DURATION = parseInt(process.env.NEXT_PUBLIC_CACHE_DURATION || '300000') // 5 minutes

async function fetchTokenList(): Promise<JupiterToken[]> {
  const now = Date.now()
  if (tokenListCache && (now - cacheTimestamp) < CACHE_DURATION) {
    logger.debug('Using cached Jupiter token list')
    return tokenListCache
  }

  try {
    logger.info('Fetching fresh Jupiter token list')
    const response = await fetch(JUPITER_TOKEN_LIST_URL)
    
    if (!response.ok) {
      throw new Error(`Jupiter API error: ${response.status}`)
    }

    const data = await response.json()
    const tokens = Array.isArray(data) ? data : data.tokens || []
    
    tokenListCache = tokens
    cacheTimestamp = now
    
    logger.info(`Fetched ${tokens.length} tokens from Jupiter`)
    return tokens
  } catch (error) {
    logger.error('Error fetching Jupiter token list', { error: error instanceof Error ? error.message : error })
    if (tokenListCache) {
      logger.warn('Using expired cached data due to fetch error')
      return tokenListCache
    }
    throw error
  }
}

export async function findMintAddress(symbol: string): Promise<string | undefined> {
  try {
    const tokens = await fetchTokenList()
    const upperSymbol = symbol.toUpperCase()
    
    const token = tokens.find(t => t.symbol.toUpperCase() === upperSymbol)
    
    if (token) {
      logger.debug(`Found mint address for ${symbol}`, { address: token.address })
      return token.address
    }
    
    logger.debug(`No mint address found for symbol: ${symbol}`)
    return undefined
  } catch (error) {
    logger.error('Error finding mint address', { symbol, error: error instanceof Error ? error.message : error })
    return undefined
  }
}

async function getTokenFromJupiter(symbol: string): Promise<JupiterToken | undefined> {
  try {
    const tokens = await fetchTokenList()
    const upperSymbol = symbol.toUpperCase()
    
    const token = tokens.find(t => t.symbol.toUpperCase() === upperSymbol)
    
    return token
  } catch (error) {
    logger.error('Error getting token from Jupiter', { symbol, error: error instanceof Error ? error.message : error })
    return undefined
  }
}

export async function getTokenMetadata(symbol: string): Promise<TokenMetadata | null> {
  try {
    logger.debug(`Getting metadata for symbol: ${symbol}`)
    
    const jupiterToken = await getTokenFromJupiter(symbol)
    
    if (jupiterToken) {
      logger.info(`Found token in Jupiter`, { name: jupiterToken.name, symbol: jupiterToken.symbol })
      
      try {
        const mint = new PublicKey(jupiterToken.address)
        const supply = await connection.getTokenSupply(mint)
        
        const tokenInfo: TokenMetadata = {
          name: jupiterToken.name,
          symbol: jupiterToken.symbol,
          uri: '',
          decimals: supply.value.decimals,
          supply: Number(supply.value.amount) / Math.pow(10, supply.value.decimals),
          mintAddress: jupiterToken.address,
          logoURI: jupiterToken.logoURI,
        }
        
        logger.info(`Successfully fetched real supply data for ${symbol}`)
        return tokenInfo
      } catch (rpcError) {
        logger.warn('RPC failed, using Jupiter data without supply', { symbol, error: rpcError instanceof Error ? rpcError.message : rpcError })
        
        return {
          name: jupiterToken.name,
          symbol: jupiterToken.symbol,
          uri: '',
          decimals: jupiterToken.decimals,
          supply: 0,
          mintAddress: jupiterToken.address,
          logoURI: jupiterToken.logoURI,
        }
      }
    }
    
    logger.debug(`Token not found in Jupiter for ${symbol}`)
    return null
    
  } catch (error) {
    logger.error('Error fetching token metadata', { symbol, error: error instanceof Error ? error.message : error })
    return null
  }
}

export async function getTokenBalance(walletAddress: string, mintAddress: string): Promise<number> {
  try {
    const wallet = new PublicKey(walletAddress)
    const mint = new PublicKey(mintAddress)
    
    const balance = await connection.getTokenAccountsByOwner(wallet, {
      mint: mint,
    })
    
    if (balance.value.length === 0) return 0
    
    const accountInfo = await connection.getTokenAccountBalance(balance.value[0].pubkey)
    return accountInfo.value.uiAmount || 0
  } catch (error) {
    logger.error('Error fetching token balance', { walletAddress, mintAddress, error: error instanceof Error ? error.message : error })
    return 0
  }
}
