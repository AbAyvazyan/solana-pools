# Environment Setup Guide

## Quick Setup

1. **Copy the environment template**

   ```bash
   npm run setup:env
   ```

2. **Or manually copy the file**

   ```bash
   cp env.example .env.local
   ```

3. **Start development**
   ```bash
   npm run dev
   ```

## Environment Variables

All environment variables are **optional** and have sensible defaults. You only need to create `.env.local` if you want to customize the configuration.

### Available Variables

| Variable                                      | Description                 | Default                                                 |
| --------------------------------------------- | --------------------------- | ------------------------------------------------------- |
| `NEXT_PUBLIC_SOLANA_RPC_URL`                  | Solana RPC endpoint         | `https://api.mainnet-beta.solana.com`                   |
| `NEXT_PUBLIC_JUPITER_TOKEN_LIST_URL`          | Jupiter token list API      | `https://token.jup.ag/all`                              |
| `NEXT_PUBLIC_RAYDIUM_API_URL`                 | Raydium API base URL        | `https://api-v3.raydium.io`                             |
| `NEXT_PUBLIC_RAYDIUM_PRICE_ENDPOINT`          | Raydium price endpoint      | `/mint/price`                                           |
| `NEXT_PUBLIC_COINGECKO_API_URL`               | CoinGecko API base URL      | `https://api.coingecko.com/api/v3`                      |
| `NEXT_PUBLIC_COINGECKO_TRENDING_ENDPOINT`     | CoinGecko trending endpoint | `/search/trending`                                      |
| `NEXT_PUBLIC_COINGECKO_SIMPLE_PRICE_ENDPOINT` | CoinGecko price endpoint    | `/simple/price`                                         |
| `NEXT_PUBLIC_APP_NAME`                        | Application name            | `Solana Pools`                                          |
| `NEXT_PUBLIC_APP_DESCRIPTION`                 | Application description     | `Real-time Solana token information and trending pools` |
| `NEXT_PUBLIC_AUTO_REFRESH_INTERVAL`           | Auto-refresh interval (ms)  | `60000` (1 minute)                                      |
| `NEXT_PUBLIC_CACHE_DURATION`                  | Cache duration (ms)         | `300000` (5 minutes)                                    |

### Customization Examples

#### Use a Different Solana RPC

```bash
NEXT_PUBLIC_SOLANA_RPC_URL=https://solana-mainnet.rpc.extrnode.com
```

#### Change Auto-refresh Interval

```bash
NEXT_PUBLIC_AUTO_REFRESH_INTERVAL=30000  # 30 seconds
```

#### Custom App Name

```bash
NEXT_PUBLIC_APP_NAME=My Solana Tracker
```

## Git Ignore

The `.env.local` file is automatically ignored by Git (see `.gitignore`). This ensures your local configuration doesn't get committed to the repository.

## Production Deployment

For production deployment, set the environment variables in your hosting platform:

- **Vercel**: Use the Environment Variables section in your project settings
- **Netlify**: Use the Environment Variables section in your site settings
- **Docker**: Pass environment variables via `-e` flag or `docker-compose.yml`

## Troubleshooting

### Environment Variables Not Loading

- Ensure the file is named `.env.local` (not `.env`)
- Restart the development server after making changes
- Check that variables start with `NEXT_PUBLIC_` for client-side access

### API Errors

- Verify the API endpoints are accessible
- Check rate limits for CoinGecko API
- Ensure Solana RPC endpoint is working

### Docker Environment

When using Docker, you can pass environment variables:

```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SOLANA_RPC_URL=https://your-rpc.com \
  solana-pools
```
