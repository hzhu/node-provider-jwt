import { SignJWT, importPKCS8 } from "jose";

const isProduction = process.env.NODE_ENV === "production";

export async function POST() {
  const jwt = await generateJWT();
  const refreshToken = await generateRefreshToken();

  const maxAge = 60 * 10; // 10 minutes in seconds

  return new Response(JSON.stringify({ jwt }), {
    status: 200,
    headers: {
      "Set-Cookie": `refreshToken=${refreshToken}; HttpOnly; Path=/; Max-Age=${maxAge}; ${
        isProduction ? "Secure;" : ""
      } SameSite=Strict`,
      "Content-Type": "application/json",
    },
  });
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

// Generate an HS256 refresh token using a secret
async function generateRefreshToken() {
  if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new Error("Missing REFRESH_TOKEN_SECRET environment variable.");
  }

  const secret = new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET);

  const refreshToken = await new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("10m")
    .sign(secret);

  return refreshToken;
}
