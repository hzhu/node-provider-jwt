"use client";

import { useAccount, useWatchBlockNumber } from "wagmi";
import { Account } from "./account";
import { WalletOptions } from "./wallet-options";
import { useState } from "react";

function ConnectWallet() {
  const { isConnected } = useAccount();
  if (isConnected) {
    return <Account />;
  }

  return <WalletOptions />;
}

export default function Example() {
  return <ConnectWallet />;
}
