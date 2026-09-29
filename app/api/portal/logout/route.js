import { NextResponse } from 'next/server';
import { PORTAL_TOKEN_COOKIE, PORTAL_REFRESH_COOKIE } from '@/lib/aws/cognito';

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(PORTAL_TOKEN_COOKIE);
  response.cookies.delete(PORTAL_REFRESH_COOKIE);
  return response;
}
