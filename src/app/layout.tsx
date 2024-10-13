import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import { type ReactNode } from "react";
import { cookieToInitialState } from "wagmi";
import "./globals.css";

import { getConfig } from "../wagmi";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Wagmi",
  description: "Generated by create-wagmi",
};

export default async function RootLayout(props: { children: ReactNode }) {
  const baseUrl = getBaseUrl();
  console.log(`Fetching from ${baseUrl}/api/token`);
  const response = await fetch(`${baseUrl}/api/token`, { cache: "no-store" });
  const { jwt } = await response.json();

  if (!response.ok) {
    throw new Error(`Failed to fetch JWT: ${response.statusText}`);
  }

  const initialState = cookieToInitialState(
    getConfig(jwt),
    headers().get("cookie")
  );

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers initialState={initialState} jwt={jwt}>
          {props.children}
        </Providers>
      </body>
    </html>
  );
}

function getBaseUrl() {
  if (process.env.VERCEL_ENV === "development") {
    return "http://localhost:3000";
  }

  return `https://${process.env.VERCEL_URL}`;
}