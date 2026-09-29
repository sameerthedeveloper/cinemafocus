import { NextResponse } from 'next/server';
import { verifyAccessToken, PORTAL_TOKEN_COOKIE, PORTAL_REFRESH_COOKIE, PORTAL_ROLES } from '@/lib/aws/cognito';

const cookieBase = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/' };

export async function POST(request) {
  if (!process.env.API_GATEWAY_URL) {
    return NextResponse.json({ error: 'Sign-in is not configured' }, { status: 503 });
  }

  let body;
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'Bad request' }, { status: 400 }); }
  const { email, password } = body || {};
  if (!email || !password) return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });

  const res = await fetch(`${process.env.API_GATEWAY_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return NextResponse.json({ error: data.error || 'Login failed' }, { status: res.status === 401 ? 401 : 502 });
  }

  // Only the owner and admin roles may hold a portal session; anyone else is rejected before a cookie is set.
  const claims = await verifyAccessToken(data.IdToken);
  if (!claims || !PORTAL_ROLES.includes(claims['custom:role'])) {
    return NextResponse.json({ error: 'No portal access' }, { status: 403 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(PORTAL_TOKEN_COOKIE, data.IdToken, { ...cookieBase, maxAge: 60 * 60 });
  response.cookies.set(PORTAL_REFRESH_COOKIE, data.RefreshToken, { ...cookieBase, maxAge: 60 * 60 * 24 * 30 });
  return response;
}
