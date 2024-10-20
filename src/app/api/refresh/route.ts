import { SignJWT, jwtVerify, importPKCS8 } from "jose";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new Error("REFRESH_TOKEN_SECRET is not defined");
  }

  const cookieHeader = req.headers.get("cookie");
  const cookies = Object.fromEntries(
    cookieHeader?.split(";").map((cookie) => cookie.trim().split("=")) || []
  );

  const refreshToken = cookies.refreshToken;

  if (!refreshToken) {
    return NextResponse.json(
      { error: "No refresh token provided" },
      { status: 401 }
    );
  }

  try {
    const secret = new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET);
    await jwtVerify(refreshToken, secret, {
      algorithms: ["HS256"],
    });

    const newAccessToken = await generateJWT();

    // Rotate the refresh token
    const newRefreshToken = await new SignJWT({})
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("10m")
      .sign(secret);

    const response = NextResponse.json({ accessToken: newAccessToken });

    response.headers.set(
      "Set-Cookie",
      `refreshToken=${newRefreshToken}; HttpOnly; Path=/; Max-Age=${
        60 * 30 // 30 minutes in seconds
      }; ${
        process.env.NODE_ENV === "production" ? "Secure;" : ""
      } SameSite=Strict`
    );

    return response;
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}

async function generateJWT() {
  if (!process.env.ALCHEMY_PRIVATE_KEY_PKCS8 || !process.env.ALCHEMY_KEY_ID) {
    throw new Error(
      "Missing required environment variables for JWT generation."
    );
  }

  const privateKeyPEM = process.env.ALCHEMY_PRIVATE_KEY_PKCS8;

  const privateKey = await importPKCS8(privateKeyPEM, "RS256");

  const token = await new SignJWT({})
    .setProtectedHeader({ alg: "RS256", kid: process.env.ALCHEMY_KEY_ID })
    .setExpirationTime("5m")
    .sign(privateKey);

  return token;
}
