"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useMemo, useState, useEffect } from "react";
import { type State, WagmiProvider } from "wagmi";
import { getConfig } from "../wagmi";

export default function useToken() {
  const [accessToken, setAccessToken] = useState<string>("");

  useEffect(() => {
    const BASE_URL = window.location.origin;
    const fetchAccessToken = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/token`, {
          method: "GET",
        });

        const data = await response.json();

        if (response.ok) {
          setAccessToken(data.jwt);
        } else {
          throw new Error(response.statusText);
        }
      } catch (error) {
        console.error(error);
      }
    };

    // Fetch the initial access token on page load
    fetchAccessToken();

    // Automatically refresh the access token before it expires
    const intervalId = setInterval(async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/refresh`, {
          method: "POST",
          credentials: "include",
        });
        const data = await response.json();

        if (data.accessToken) {
          console.log(
            "updating the access token because we hit the refresh endpoint"
          );
          setAccessToken(data.accessToken); // Update the access token
        }
      } catch (error) {
        console.error("Failed to refresh token:", error);
      }
    }, 15 * 60 * 1000 - 60000); // Refresh 1 minute before token expiry
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

  const config = useMemo(() => {
    return getConfig(accessToken);
  }, [accessToken]);

  const [queryClient] = useState(() => new QueryClient());

  if (!accessToken) {
    return <div>Loading…</div>;
  }

  return (
    <WagmiProvider config={config} initialState={props.initialState}>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
