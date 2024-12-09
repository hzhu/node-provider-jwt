"use client";

import { useAccount } from "wagmi";
import { Account } from "./account";
import { WalletOptions } from "./wallet-options";

function ConnectWallet() {
  const { isConnected } = useAccount();
  if (isConnected) return <Account />;
  return <WalletOptions />;
}

export default function Example() {
  const { address } = useAccount();
  return <ConnectWallet />;
}
