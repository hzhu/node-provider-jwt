import { http, createConfig } from "wagmi";
import { base, mainnet } from "wagmi/chains";
import {
  safe,
  metaMask,
  walletConnect,
  coinbaseWallet,
} from "wagmi/connectors";

const projectId = "ecf05e6e910a7006159c69f03dafbaeb";

export const config = createConfig({
  chains: [mainnet, base],
  connectors: [
    safe(),
    metaMask(),
    coinbaseWallet(),
    walletConnect({ projectId }),
  ],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
  },
});
