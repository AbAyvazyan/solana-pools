'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
            retry: 2, // Retry failed requests twice
            retryDelay: attemptIndex =>
              Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
            gcTime: 5 * 60 * 1000, // Keep data in cache for 5 minutes (formerly cacheTime)
          },
          mutations: {
            retry: 1, // Retry mutations once
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
