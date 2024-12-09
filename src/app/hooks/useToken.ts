import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const FETCH_INTERVAL = 4 * 60 * 1000; // 4 minutes

async function queryFn() {
  const response = await fetch("/api/get-jwt", {
    method: "POST",
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`❌ Failed to refresh token: ${response.statusText}`);
  } else {
    return data;
  }
}

export default function useToken() {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsEnabled(true);
    }, FETCH_INTERVAL);

    return () => clearTimeout(timeoutId); // Cleanup the timer on unmount
  }, []);

  const { data } = useQuery({
    queryFn,
    enabled: isEnabled,
    queryKey: ["get-jwt"],
    refetchInterval: FETCH_INTERVAL,
    refetchIntervalInBackground: true,
  });

  useEffect(() => {
    if (data?.nodeProviderJwt) {
      localStorage.setItem("node-provider-jwt", data.nodeProviderJwt);
    }
  }, [data]);
}
