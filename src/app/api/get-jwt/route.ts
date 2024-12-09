import { NextResponse } from "next/server";
import { generateJWT } from "@/app/lib/generate-jwt";

export async function POST(req: Request) {
  try {
    const nodeProviderJwt = await generateJWT();
    const response = NextResponse.json({ nodeProviderJwt });
    return response;
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}
