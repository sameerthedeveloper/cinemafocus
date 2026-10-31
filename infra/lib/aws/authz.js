import { CognitoJwtVerifier } from "aws-jwt-verify";

// Cognito access tokens do not carry custom attributes (e.g. custom:role) by
// default — only ID tokens do. Since requireAdmin needs the role claim, this
// verifies the ID token, not the access token.
// Created lazily so a missing env var surfaces as a 500 on the request
// instead of crashing the Lambda at module load.
let verifier = null;

function getVerifier() {
  if (verifier) return verifier;
  const userPoolId = process.env.COGNITO_POOL_ID;
  const clientId = process.env.COGNITO_CLIENT_ID;
  if (!userPoolId || !clientId) {
    throw new AuthError(500, "Auth is not configured");
  }
  verifier = CognitoJwtVerifier.create({ userPoolId, tokenUse: "id", clientId });
  return verifier;
}

export async function requireAuth(event) {
  const token = event.headers?.authorization?.replace("Bearer ", "");
  if (!token) throw new AuthError(401, "No token");
  const v = getVerifier();
  try {
    return await v.verify(token); // returns claims
  } catch {
    throw new AuthError(401, "Invalid or expired token");
  }
}

export async function requireAdmin(event) {
  const claims = await requireAuth(event);
  if (claims["custom:role"] !== "admin") {
    throw new AuthError(403, "Admin role required");
  }
  return claims;
}

// Read-only staff access (e.g. the site owner's portal): any of the listed roles.
export async function requireRole(event, roles) {
  const claims = await requireAuth(event);
  if (!roles.includes(claims["custom:role"])) {
    throw new AuthError(403, "Insufficient role");
  }
  return claims;
}

export class AuthError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function errorResponse(e) {
  if (e instanceof AuthError) {
    return { statusCode: e.statusCode, body: JSON.stringify({ error: e.message }) };
  }
  if (e.statusCode) {
    const headers = { "Content-Type": "application/json" };
    if (e.retryAfter) headers["Retry-After"] = String(e.retryAfter);
    return { statusCode: e.statusCode, headers, body: JSON.stringify({ error: e.message }) };
  }
  console.error(e);
  return { statusCode: 500, body: JSON.stringify({ error: "Internal server error" }) };
}
