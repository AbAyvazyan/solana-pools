import { TrendingTokensTable } from '@/components/trending-tokens-table';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Solana Pools
          </h1>
          <p className="text-lg text-gray-600">
            Track trending Solana tokens and their market performance
          </p>
        </div>

        <TrendingTokensTable />
      </div>
    </div>
  );
}
