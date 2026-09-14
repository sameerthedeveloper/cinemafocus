import { CognitoJwtVerifier } from "aws-jwt-verify";

// ID token, not access token — Cognito access tokens don't carry custom
// attributes like custom:role, which the admin route guard needs.
const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_POOL_ID,
  tokenUse: "id",
  clientId: process.env.COGNITO_CLIENT_ID,
});

/**
 * Verifies the access token cookie for Next.js middleware/server use.
 * Returns the Cognito claims, or null if missing/invalid/expired.
 */
export async function verifyAccessToken(token) {
  if (!token) return null;
  try {
    return await verifier.verify(token);
  } catch {
    return null;
  }
}

export const ACCESS_TOKEN_COOKIE = "cf_access_token";
export const REFRESH_TOKEN_COOKIE = "cf_refresh_token";
