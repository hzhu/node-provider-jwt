"use client";

import { useState } from "react";
import { useAccount, useWatchBlockNumber } from "wagmi";
import { WalletOptions } from "./wallet-options";
import { Account } from "./account";
import useToken from "./hooks/useToken";

export default function Example() {
  useToken();
  const { isConnected } = useAccount();
  const [blockNumber, setBlockNumber] = useState<bigint>();

  useWatchBlockNumber({
    onBlockNumber(blockNumber) {
      setBlockNumber(blockNumber);
    },
  });

  return (
    <>
      <span>
        <span className="font-semibold">Current block number:</span>{" "}
        {blockNumber}
      </span>
      {isConnected ? <Account /> : <WalletOptions />}
    </>
  );
}
