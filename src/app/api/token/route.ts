// Import the jsonwebtoken library for creating JWTs.
const jwt = require("jsonwebtoken");

// Generate a refresh token to allow refreshing the access token
// Generate a refresh token using HS256 algorithm
const refreshToken = jwt.sign({}, process.env.REFRESH_TOKEN_SECRET, {
  expiresIn: "7d", // Token valid for 7 days
  algorithm: "HS256", // Algorithm for signing
});

const isProduction = process.env.NODE_ENV === "production";

export async function GET() {
  const jwt = generateJWT();

  const maxAge = 60 * 60 * 24 * 7; // 7 days in seconds

  return Response.json(
    { jwt },
    {
      status: 200,
      headers: {
        "Set-Cookie": `refreshToken=${refreshToken}; HttpOnly; Path=/; Max-Age=${maxAge}; ${
          isProduction ? "Secure;" : ""
        }`,
        "Content-Type": "application/json",
      },
    }
  );
}

function generateJWT() {
  const signOptions = {
    algorithm: "RS256",
    expiresIn: "10m",
    header: { kid: process.env.ALCHEMY_KEY_ID }, // Key ID from the Alchemy dashboard used to identify the public key for verifying the JWT signature.
  };

  // This private key is generated by our team and is used to sign the JWT. We have uploaded the public key to Alchemy so that they can verify the JWT signature.
  const token = jwt.sign({}, process.env.ALCHEMY_PRIVATE_KEY, signOptions);

  return token;
}
