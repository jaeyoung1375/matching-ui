"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import TokenHandler from "./auth/TokenHandler";
import ClientErrorBoundary from "./components/error/ClientErrorBoundary";
import GlobalClientErrorLogger from "./components/error/GlobalClientErrorLogger";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalClientErrorLogger />
      <TokenHandler />
      <ClientErrorBoundary>
        <AuthProvider>{children}</AuthProvider>
      </ClientErrorBoundary>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
