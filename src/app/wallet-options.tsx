"use client";

import * as React from "react";
import { Connector, useConnect } from "wagmi";
import Image from "next/image";

export default function Icon({ connector }: { connector: Connector }) {
  if (!connector.icon) {
    if (connector.name === "Injected") return null;
    return (
      <Image
        aria-hidden
        src={`${connector.name.toLowerCase().replace(" ", "-")}.svg`}
        alt="File icon"
        width={32}
        height={32}
      />
    );
  }
  return <img src={connector.icon} alt="Icon" width={32} height={32} />;
}

export function WalletOptions() {
  const { connectors, connect } = useConnect();

  return connectors.map((connector) => (
    <div className="flex" key={connector.uid}>
      <button
        onClick={() => connect({ connector })}
        className="mb-3 rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
      >
        <Icon connector={connector} />
        {connector.name}
      </button>
    </div>
  ));
}
