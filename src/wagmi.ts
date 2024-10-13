import { http, cookieStorage, createConfig, createStorage } from "wagmi";
import { mainnet, optimism, sepolia } from "wagmi/chains";
import { injected, metaMask, walletConnect } from "wagmi/connectors";

export function getConfig(jwt: string) {
  const fetchOptions = { headers: { Authorization: `Bearer ${jwt}` } };
  return createConfig({
    chains: [mainnet, sepolia, optimism],
    connectors: [
      injected(),
      walletConnect({
        projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID!,
      }),
      metaMask(),
    ],
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    transports: {
      [mainnet.id]: http("https://eth-mainnet.g.alchemy.com/v2", {
        fetchOptions,
      }),
      [sepolia.id]: http("https://eth-sepolia.g.alchemy.com/v2", {
        fetchOptions,
      }),
      [optimism.id]: http("https://opt-mainnet.g.alchemy.com/v2", {
        fetchOptions,
      }),
    },
  });
}

declare module "wagmi" {
  interface Register {
    config: ReturnType<typeof getConfig>;
  }
}
