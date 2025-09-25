"use client"; // Ensures this is a client component in Next.js

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode, useState } from "react";

// Function to create a new QueryClient
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute stale time
      },
    },
  });
}

// Store the QueryClient instance in a variable for the browser
let browserQueryClient: QueryClient | undefined = undefined;

// Function to get the QueryClient instance
function getQueryClient(): QueryClient {
  if (typeof window === "undefined") {
    // On the server, always create a new QueryClient
    return makeQueryClient();
  } else {
    // On the browser, create a new QueryClient only if one doesn't exist
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

// Type for component props
interface ReactQueryProviderProps {
  children: ReactNode;
}

// React Query Provider Component
export default function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  const [queryClient] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      {children}
    </QueryClientProvider>
  );
}
