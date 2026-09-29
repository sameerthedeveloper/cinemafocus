import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAccessToken, ACCESS_TOKEN_COOKIE } from "@/lib/aws/cognito";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  const claims = await verifyAccessToken(token);

  if (!claims) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({
    user: {
      id: claims.sub,
      email: claims.email,
      role: claims["custom:role"],
    },
  });
}
