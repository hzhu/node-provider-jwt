import type { Metadata } from "next";
import localFont from "next/font/local";
import { Providers } from "./providers";
import { generateJWT } from "@/app/lib/generate-jwt";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "RPC Node Provider URL protection",
  description: "Protecting Node Provider URLs for Frontend dApps",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jwt = await generateJWT();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers initialJwt={jwt}>{children}</Providers>
      </body>
    </html>
  );
}
