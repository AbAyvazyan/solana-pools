# Solana Pools - Deployment Guide

## 🎯 Project Overview

This is a complete Next.js application for tracking trending Solana tokens with real-time data updates. The application meets all the requirements specified in the task:

### ✅ Part #1: Homepage with Trending Tokens

- **CoinGecko API Integration**: Fetches trending tokens using the CoinGecko API
- **Data Table**: Beautiful shadcn/ui table showing trending tokens
- **Auto-refresh**: Updates data every minute using TanStack Query
- **Navigation**: Links to individual token pages
- **Responsive Design**: Works on all device sizes

### ✅ Part #2: Dynamic Token Pool Pages

- **Token Details**: Comprehensive token information display
- **Solana RPC Integration**: Fetches token metadata from Solana blockchain
- **Raydium API**: Gets price and market cap data
- **Real-time Updates**: Auto-refreshes every minute
- **Beautiful UI**: Modern design with cards, badges, and icons

### ✅ Part #3: Dockerization & Deployment

- **Dockerfile**: Production-ready containerization
- **Docker Compose**: Easy development and testing
- **Health Checks**: Container monitoring
- **CI/CD Pipeline**: GitHub Actions workflow

## 🚀 Quick Start

### Local Development

```bash
# Clone and setup
git clone <repository-url>
cd solana-pools
npm install

# Start development server
npm run dev
```

### Docker Deployment

```bash
# Using Docker Compose (recommended)
npm run docker:compose

# Or manual Docker commands
npm run docker:build
npm run docker:run

# Test Docker setup
npm run docker:test
```

## 📁 Project Structure

```
solana-pools/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   ├── trending/      # Trending tokens endpoint
│   │   │   └── token/[symbol]/ # Token details endpoint
│   │   ├── token/[symbol]/    # Dynamic token pages
│   │   ├── layout.tsx         # Root layout with providers
│   │   └── page.tsx           # Homepage
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── trending-tokens-table.tsx
│   │   └── token-details.tsx
│   └── lib/                  # Utilities and services
│       ├── api/              # API services
│       ├── hooks/            # TanStack Query hooks
│       └── providers.tsx     # Query provider
├── Dockerfile                # Production container
├── docker-compose.yml        # Development container
├── scripts/                  # Helper scripts
└── .github/workflows/        # CI/CD pipeline
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_COINGECKO_API_URL=https://api.coingecko.com/api/v3
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_RAYDIUM_API_URL=https://api-v3.raydium.io
NEXT_PUBLIC_APP_NAME=Solana Pools
NEXT_PUBLIC_APP_DESCRIPTION=Track trending Solana pools and token information
```

### API Endpoints

- `GET /api/trending` - Trending Solana tokens
- `GET /api/token/[symbol]` - Token details by symbol

## 🛠 Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI**: shadcn/ui + Tailwind CSS
- **Data Fetching**: TanStack Query (React Query)
- **Blockchain**: Solana Web3.js
- **APIs**: CoinGecko, Raydium, Solana RPC
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions
- **Language**: TypeScript

## 📊 Features

### Real-time Data

- Auto-refresh every minute
- Background updates with TanStack Query
- Optimistic UI updates
- Error handling and retry mechanisms

### User Experience

- Loading states and error boundaries
- Responsive design
- Beautiful modern UI
- Smooth navigation

### Performance

- Server-side rendering
- Optimized images
- Efficient data caching
- Minimal bundle size

## 🐳 Docker Commands

```bash
# Build image
docker build -t solana-pools .

# Run container
docker run -p 3000:3000 solana-pools

# Using Docker Compose
docker-compose up --build

# Stop and clean
docker-compose down
docker system prune -f
```

## 🔄 CI/CD Pipeline

The GitHub Actions workflow automatically:

1. Runs linting and type checking
2. Builds the application
3. Tests Docker build
4. Deploys to Docker Hub (on main branch)

## 📝 API Documentation

### Trending Tokens

```typescript
GET /api/trending
Response: {
  success: boolean
  data: CoinGeckoTrendingToken[]
}
```

### Token Details

```typescript
GET / api / token / [symbol];
Response: {
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
  }
}
```

## 🎨 Customization

### Adding New APIs

1. Create service in `src/lib/api/`
2. Add to API routes in `src/app/api/`
3. Create custom hook in `src/lib/hooks/`
4. Update components to use new data

### Styling

- Uses Tailwind CSS for styling
- shadcn/ui components for consistency
- Easy to customize with CSS variables

### Environment Configuration

- All API endpoints configurable via environment variables
- Easy to switch between development and production

## 🚀 Deployment Options

### Vercel (Recommended)

```bash
npm install -g vercel
vercel --prod
```

### Docker Hosting

```bash
# Build and push to registry
docker build -t your-registry/solana-pools .
docker push your-registry/solana-pools

# Deploy to any container platform
```

### Traditional Hosting

```bash
npm run build
npm run start
```

## 📈 Monitoring

### Health Checks

- Docker health check endpoint
- API status monitoring
- Error logging and reporting

### Performance

- Build optimization
- Bundle analysis
- Runtime monitoring
