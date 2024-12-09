import { SignJWT, importPKCS8 } from "jose";

export async function generateJWT() {
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
