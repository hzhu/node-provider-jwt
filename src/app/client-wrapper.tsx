"use client";

import dynamic from "next/dynamic";
import React from "react";

const Example = dynamic(() => import("./example"), { ssr: false });

export default function ClientWrapper() {
  return <Example />;
}
