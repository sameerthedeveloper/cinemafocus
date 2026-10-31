import { CognitoIdentityProviderClient, InitiateAuthCommand, AdminSetUserPasswordCommand } from "@aws-sdk/client-cognito-identity-provider";
import { requireAuth, errorResponse } from "../lib/aws/authz.js";
import { json, parseBody } from "../lib/http.js";
import { pick, str } from "../lib/validate.js";
import { rateLimit } from "../lib/aws/ratelimit.js";

const client = new CognitoIdentityProviderClient({});

export async function login(event) {
  try {
    const body = pick(parseBody(event), ["email", "password"]);
    const email = str(body.email, "email", { required: true, max: 254 }).toLowerCase();
    const password = str(body.password, "password", { required: true, max: 256 });
    // Brute-force guard: 10 attempts per email per 15 minutes (counted before the attempt).
    await rateLimit("login", email, { limit: 10, windowSec: 900 });
    const result = await client.send(new InitiateAuthCommand({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: process.env.COGNITO_CLIENT_ID,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    }));
    return json(200, result.AuthenticationResult);
  } catch (e) {
    if (e.name === "NotAuthorizedException" || e.name === "UserNotFoundException") {
      return json(401, { error: "Incorrect email or password" });
    }
    return errorResponse(e);
  }
}

export async function changePassword(event) {
  try {
    const claims = await requireAuth(event);
    const { currentPassword, newPassword } = parseBody(event);

    if (!currentPassword || !newPassword) {
      return json(400, { error: "currentPassword and newPassword are required" });
    }

    // Verify the current password is actually correct before allowing the
    // change — AdminSetUserPassword itself doesn't require or check it.
    try {
      await client.send(new InitiateAuthCommand({
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: process.env.COGNITO_CLIENT_ID,
        AuthParameters: { USERNAME: claims.email, PASSWORD: currentPassword },
      }));
    } catch {
      return json(401, { error: "Current password is incorrect" });
    }

    await client.send(new AdminSetUserPasswordCommand({
      UserPoolId: process.env.COGNITO_POOL_ID,
      Username: claims["cognito:username"] || claims.sub,
      Password: newPassword,
      Permanent: true,
    }));

    return json(200, { success: true });
  } catch (e) {
    if (e.name === "InvalidPasswordException") {
      return json(400, { error: e.message || "New password does not meet requirements" });
    }
    return errorResponse(e);
  }
}

export async function refresh(event) {
  try {
    const { refreshToken } = parseBody(event);
    const result = await client.send(new InitiateAuthCommand({
      AuthFlow: "REFRESH_TOKEN_AUTH",
      ClientId: process.env.COGNITO_CLIENT_ID,
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
      },
    }));
    return json(200, result.AuthenticationResult);
  } catch (e) {
    if (e.name === "NotAuthorizedException") {
      return json(401, { error: "Session expired" });
    }
    return errorResponse(e);
  }
}
