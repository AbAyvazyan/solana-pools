import { NextResponse } from 'next/server';
import { getTrendingTokens } from '@/lib/api/coingecko';
import { logger } from '@/lib/utils/logger';

export async function GET() {
  try {
    logger.info('Fetching trending tokens');
    const tokens = await getTrendingTokens();

    logger.info('Successfully fetched trending tokens', {
      count: tokens.length,
    });
    return NextResponse.json({
      success: true,
      data: tokens,
    });
  } catch (error) {
    logger.error('Error fetching trending tokens', {
      error: error instanceof Error ? error.message : error,
    });
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch trending tokens',
      },
      { status: 500 }
    );
  }
}
