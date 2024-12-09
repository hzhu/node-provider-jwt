import { decodeJwt } from "jose";
import { http, createConfig } from "wagmi";
import { base, mainnet } from "wagmi/chains";
import {
  safe,
  metaMask,
  walletConnect,
  coinbaseWallet,
} from "wagmi/connectors";

const projectId = "ecf05e6e910a7006159c69f03dafbaeb";

const connectors = [
  safe(),
  metaMask(),
  coinbaseWallet(),
  walletConnect({ projectId }),
];

export const getWagmiConfig = (initialJwt: string) => {
  const config = createConfig({
    chains: [mainnet, base],
    connectors,
    transports: {
      [mainnet.id]: http("https://eth-mainnet.g.alchemy.com/v2", {
        onFetchRequest: (request) => {
          console.log("fetch");
          const clonedRequest = request.clone();
          const isInitialJwtExpired = isJwtExpired(initialJwt);

          if (!isInitialJwtExpired) {
            console.log("using initial jwt");
            clonedRequest.headers.set("Authorization", `Bearer ${initialJwt}`);
            return clonedRequest;
          } else {
            let jwt = window.localStorage.getItem("node-provider-jwt");

            if (!jwt) {
              console.log(
                "JWT is not yet set in localStorage. Fallback to default RPC."
              );
              return new Request(
                mainnet.rpcUrls.default.http[0],
                clonedRequest
              );
            } else {
              clonedRequest.headers.set("Authorization", `Bearer ${jwt}`);
              console.log("using jwt from localStorage");
              return clonedRequest;
            }
          }
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
