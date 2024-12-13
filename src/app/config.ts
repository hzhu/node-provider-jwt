import { decodeJwt } from "jose";
import { http, createConfig } from "wagmi";
import { base, mainnet } from "wagmi/chains";
import { metaMask, walletConnect, coinbaseWallet } from "wagmi/connectors";

const connectors = [
  metaMask(),
  coinbaseWallet(),
  walletConnect({ projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID! }),
];

export const getWagmiConfig = (initialJwt: string) => {
  const config = createConfig({
    chains: [mainnet, base],
    connectors,
    transports: {
      [mainnet.id]: http("https://eth-mainnet.g.alchemy.com/v2", {
        onFetchRequest: (_, init) => {
          return {
            ...init,
            headers: {
              ...init.headers,
              Authorization: `Bearer ${initialJwt}`,
            },
          };
        },
      }),
      [base.id]: http(),
    },
  });

  return config;
};

function isJwtExpired(token: string): boolean {
  try {
    const decoded = decodeJwt(token);
    if (!decoded.exp) {
      throw new Error("Token does not have an expiration time.");
    }
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true;
  }
}
