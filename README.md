# Solana Pools - Real-time Token Information

A modern Next.js application that displays trending Solana pools and detailed token information using real-time data from multiple APIs.

## 🚀 Features

- **Real-time Trending Tokens**: Display trending Solana tokens with auto-refresh every minute
- **Dynamic Token Details**: View comprehensive token information including price, market cap, volume, and Solana metadata
- **Multiple Data Sources**: Integrates with Jupiter, Raydium, CoinGecko, and Solana RPC APIs
- **Auto-refresh**: Data updates automatically every minute
- **Responsive Design**: Modern UI built with shadcn/ui and Tailwind CSS
- **Docker Support**: Containerized application for easy deployment

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Data Fetching**: TanStack Query (React Query)
- **Blockchain**: Solana Web3.js
- **APIs**: Jupiter, Raydium, CoinGecko
- **Containerization**: Docker

## 📁 Project Structure

```
solana-pools/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── trending/      # Trending tokens endpoint
│   │   │   └── token/[symbol] # Individual token endpoint
│   │   ├── token/[symbol]/    # Dynamic token pages
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Homepage
│   ├── components/            # React components
│   │   ├── trending-tokens-table.tsx
│   │   └── token-details.tsx
│   ├── lib/                   # Utilities and API clients
│   │   ├── api/              # API integration
│   │   │   ├── coingecko.ts  # CoinGecko API
│   │   │   ├── raydium.ts    # Raydium API
│   │   │   └── solana.ts     # Solana RPC
│   │   ├── hooks/            # Custom React hooks
│   │   ├── utils/            # Utility functions
│   │   └── constants/        # Mock data and constants
│   └── providers.tsx         # TanStack Query provider
├── public/                   # Static assets
├── Dockerfile               # Docker configuration
├── docker-compose.yml       # Docker Compose
└── env.example             # Environment variables template
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd solana-pools
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp env.example .env.local
   
   # Edit .env.local with your configuration (optional)
   # The defaults should work for most cases
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Environment Variables

The application uses the following environment variables (all optional with sensible defaults):

```bash
# Solana Configuration
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com

# Jupiter Token List API
NEXT_PUBLIC_JUPITER_TOKEN_LIST_URL=https://token.jup.ag/all

# Raydium API
NEXT_PUBLIC_RAYDIUM_API_URL=https://api-v3.raydium.io
NEXT_PUBLIC_RAYDIUM_PRICE_ENDPOINT=/mint/price

# CoinGecko API
NEXT_PUBLIC_COINGECKO_API_URL=https://api.coingecko.com/api/v3
NEXT_PUBLIC_COINGECKO_TRENDING_ENDPOINT=/search/trending
NEXT_PUBLIC_COINGECKO_SIMPLE_PRICE_ENDPOINT=/simple/price

# Application Configuration
NEXT_PUBLIC_APP_NAME=Solana Pools
NEXT_PUBLIC_APP_DESCRIPTION=Real-time Solana token information and trending pools
NEXT_PUBLIC_AUTO_REFRESH_INTERVAL=60000
NEXT_PUBLIC_CACHE_DURATION=300000
```

### Docker Deployment

1. **Build the Docker image**
   ```bash
   npm run docker:build
   ```

2. **Run with Docker Compose**
   ```bash
   npm run docker:compose
   ```

3. **Or run the container directly**
   ```bash
   npm run docker:run
   ```

## 📡 API Endpoints

### Trending Tokens
- **GET** `/api/trending`
- Returns trending Solana tokens from CoinGecko API

### Individual Token Data
- **GET** `/api/token/[symbol]`
- Returns comprehensive token data from multiple sources:
  - Solana metadata (name, symbol, supply, decimals)
  - Raydium price data
  - CoinGecko market data (fallback)

## 🔄 Data Flow

1. **Homepage**: Fetches trending tokens from CoinGecko API
2. **Token Details**: 
   - Looks up mint address from Jupiter Token List
   - Fetches Solana metadata from Solana RPC
   - Gets price data from Raydium API
   - Falls back to CoinGecko for additional market data
3. **Auto-refresh**: All data refreshes every minute using TanStack Query

## 🐳 Docker Commands

```bash
# Build image
npm run docker:build

# Run container
npm run docker:run

# Run with Docker Compose
npm run docker:compose

# Test Docker setup
npm run docker:test
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📦 Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Jupiter](https://jup.ag/) for token list API
- [Raydium](https://raydium.io/) for price data
- [CoinGecko](https://coingecko.com/) for market data
- [Solana](https://solana.com/) for blockchain data
- [shadcn/ui](https://ui.shadcn.com/) for UI components
- [TanStack Query](https://tanstack.com/query) for data fetching
