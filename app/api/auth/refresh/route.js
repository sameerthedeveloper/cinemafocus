import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/lib/aws/cognito";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: "No session" }, { status: 401 });
  }

  if (!process.env.API_GATEWAY_URL) {
    return NextResponse.json({ error: "Auth is not configured" }, { status: 503 });
  }

  const res = await fetch(`${process.env.API_GATEWAY_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  const data = await res.json();

  if (!res.ok) {
    const response = NextResponse.json({ error: data.error || "Session expired" }, { status: res.status });
    response.cookies.delete(ACCESS_TOKEN_COOKIE);
    response.cookies.delete(REFRESH_TOKEN_COOKIE);
    return response;
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(ACCESS_TOKEN_COOKIE, data.IdToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60,
  });
  return response;
}
