import { cookies } from 'next/headers';
import { verifyAccessToken, PORTAL_TOKEN_COOKIE, PORTAL_ROLES } from '@/lib/aws/cognito';

/**
 * Server-side portal session. Returns { token, email, role } or null.
 * (proxy.js already gates /portal/*; this re-verifies so server code never trusts the route alone.)
 */
export async function getPortalSession() {
  const token = (await cookies()).get(PORTAL_TOKEN_COOKIE)?.value;
  const claims = await verifyAccessToken(token);
  const role = claims?.['custom:role'];
  if (!claims || !PORTAL_ROLES.includes(role)) return null;
  return { token, email: claims.email || '', role };
}
