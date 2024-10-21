import { SignJWT, jwtVerify } from "jose";
import { NextResponse } from "next/server";
import { generateJWT } from "../../../lib/generateJWT";

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
