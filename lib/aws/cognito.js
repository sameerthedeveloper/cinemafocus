import { CognitoJwtVerifier } from "aws-jwt-verify";

let verifier = null;

// ID token, not access token — Cognito access tokens don't carry custom
// attributes like custom:role, which the admin route guard needs.
// Created lazily so importing this module never throws when Cognito env
// vars are absent.
function getVerifier() {
  if (verifier) return verifier;
  const userPoolId = process.env.COGNITO_POOL_ID;
  const clientId = process.env.COGNITO_CLIENT_ID;
  if (!userPoolId || !clientId) {
    throw new Error("COGNITO_POOL_ID and COGNITO_CLIENT_ID must be set");
  }
  verifier = CognitoJwtVerifier.create({ userPoolId, tokenUse: "id", clientId });
  return verifier;
}

/**
 * Verifies the access token cookie for Next.js middleware/server use.
 * Returns the Cognito claims, or null if missing/invalid/expired or if
 * Cognito is not configured.
 */
export async function verifyAccessToken(token) {
  if (!token) return null;
  try {
    return await getVerifier().verify(token);
  } catch {
    return null;
  }
}

export const ACCESS_TOKEN_COOKIE = "cf_access_token";
export const REFRESH_TOKEN_COOKIE = "cf_refresh_token";
