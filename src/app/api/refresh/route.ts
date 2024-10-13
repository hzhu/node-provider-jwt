const jwt = require("jsonwebtoken");
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
    jwt.verify(refreshToken, "some-secret", { algorithms: ["HS256"] });
    const newAccessToken = generateJWT();
    // Rotate the refresh token (generate a new one)
    const newRefreshToken = jwt.sign({}, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "7d", // Token valid for 7 days
      algorithm: "HS256", // Algorithm for signing
    });
    // Create the new response and set the new refresh token in the HTTP-only cookie
    const response = NextResponse.json({ accessToken: newAccessToken });

    // Set the new refresh token using `Set-Cookie` header
    response.headers.set(
      "Set-Cookie",
      `refreshToken=${newRefreshToken}; HttpOnly; Path=/; Max-Age=${
        60 * 60 * 24 * 7
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

function generateJWT() {
  if (!process.env.ALCHEMY_PRIVATE_KEY) {
    throw new Error("ALCHEMY_PRIVATE_KEY is not defined");
  }

  const signOptions = {
    algorithm: "RS256",
    expiresIn: "10m",
    header: { kid: process.env.ALCHEMY_KEY_ID }, // Key ID from the Alchemy dashboard used to identify the public key for verifying the JWT signature.
  };

  // This private key is generated by our team and is used to sign the JWT. We have uploaded the public key to Alchemy so that they can verify the JWT signature.
  const token = jwt.sign({}, process.env.ALCHEMY_PRIVATE_KEY, signOptions);

  return token;
}