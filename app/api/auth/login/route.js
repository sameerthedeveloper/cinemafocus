import { NextResponse } from "next/server";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE, verifyAccessToken } from "@/lib/aws/cognito";

export async function POST(request) {
  if (!process.env.API_GATEWAY_URL) {
    return NextResponse.json({ error: "Auth is not configured" }, { status: 503 });
  }

  const { email, password } = await request.json();

  const res = await fetch(`${process.env.API_GATEWAY_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json({ error: data.error || "Login failed" }, { status: res.status });
  }

  // Only admin accounts may hold an admin session (owner/portal accounts are rejected before a cookie is set).
  const claims = await verifyAccessToken(data.IdToken);
  if (!claims || claims["custom:role"] !== "admin") {
    return NextResponse.json({ error: "No admin access" }, { status: 403 });
  }

  const response = NextResponse.json({ success: true });
  // ID token, not access token — carries the custom:role claim requireAdmin relies on.
  response.cookies.set(ACCESS_TOKEN_COOKIE, data.IdToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60, // Cognito access/id tokens default to 1hr expiry
  });
  response.cookies.set(REFRESH_TOKEN_COOKIE, data.RefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
