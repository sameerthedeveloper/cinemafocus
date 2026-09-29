import { CognitoJwtVerifier } from "aws-jwt-verify";

// Cognito access tokens do not carry custom attributes (e.g. custom:role) by
// default — only ID tokens do. Since requireAdmin needs the role claim, this
// verifies the ID token, not the access token.
const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_POOL_ID,
  tokenUse: "id",
  clientId: process.env.COGNITO_CLIENT_ID,
});

export async function requireAuth(event) {
  const token = event.headers?.authorization?.replace("Bearer ", "");
  if (!token) throw new AuthError(401, "No token");
  try {
    return await verifier.verify(token); // returns claims
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
    return { statusCode: e.statusCode, body: JSON.stringify({ error: e.message }) };
  }
  console.error(e);
  return { statusCode: 500, body: JSON.stringify({ error: "Internal server error" }) };
}
