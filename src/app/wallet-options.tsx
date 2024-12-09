"use client";

import * as React from "react";
import { Connector, useConnect } from "wagmi";

export function WalletOptions() {
  const { connectors, connect } = useConnect();

  console.log(connectors, "<--x", connectors.length);

  return connectors.map((connector) => (
    <div className="flex">
      <button
        key={connector.uid}
        onClick={() => connect({ connector })}
        className="mb-3 rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
      >
        {connector.name}
      </button>
    </div>
  ));
}
