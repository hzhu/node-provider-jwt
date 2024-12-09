"use client";

import React, { ReactNode, useState } from "react";
import { WagmiProvider } from "wagmi";
import { getWagmiConfig } from "./config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function Providers(props: { children: ReactNode; initialJwt: string }) {
  const [config] = useState(() => {
    return getWagmiConfig(props.initialJwt);
  });

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
