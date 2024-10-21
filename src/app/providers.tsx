"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useMemo, useState, useEffect } from "react";
import { type State, WagmiProvider } from "wagmi";
import { getConfig } from "../lib/wagmi";

export default function useToken() {
  const [accessToken, setAccessToken] = useState<string>("");

  useEffect(() => {
    const BASE_URL = window.location.origin;

    const intervalId = setInterval(async () => {
      try {
        console.log(`⏳ Fetching a new JWT and rotating the refresh token…`);
        const response = await fetch(`${BASE_URL}/api/refresh`, {
          method: "POST",
          cache: "no-store",
          credentials: "include",
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(`❌ Failed to refresh token: ${response.statusText}`);
        }

        if (data.accessToken) {
          setAccessToken(data.accessToken); // Update the access token
          console.log(
            `✅ Successfully updated the frontend app with a new JWT.`
          );
        }
      } catch (error) {
        console.error(error);
      }
    }, 4 * 60 * 1000); // Since the token expires every 5 minutes, refresh it 1 minute before expiry—that is, refresh every 4 minutes.

    return () => clearInterval(intervalId); // Clean up interval on component unmount
  }, []);

  return { accessToken };
}

export function Providers(props: {
  children: ReactNode;
  initialState?: State;
  jwt?: string;
}) {
  const { accessToken } = useToken();

  const config = useMemo(
    () => getConfig(accessToken || props.jwt),
    [props.jwt, accessToken]
  );

  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config} initialState={props.initialState}>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
