import { SignJWT } from "jose";
import { NextResponse } from "next/server";

if (!process.env.REFRESH_TOKEN_SECRET) {
  throw new Error("Missing REFRESH_TOKEN_SECRET");
}

export async function middleware() {
  const secret = new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET);

  const newRefreshToken = await new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("10m")
    .sign(secret);

  const response = NextResponse.next();

  response.cookies.set({
    name: "refreshToken",
    value: newRefreshToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 10, // 10 minutes in seconds
  });

  return response;
}

export const config = {
  matcher: ["/"],
};
