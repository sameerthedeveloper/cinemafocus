import { CognitoIdentityProviderClient, AdminCreateUserCommand, AdminSetUserPasswordCommand, AdminDeleteUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import { GetCommand, PutCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { docClient, scanAll } from "../lib/aws/dynamo.js";
import { requireAuth, requireAdmin, AuthError, errorResponse } from "../lib/aws/authz.js";
import { json, parseBody } from "../lib/http.js";

const TABLE = () => process.env.USERS_TABLE;
const cognito = new CognitoIdentityProviderClient({});
const ROLES = ["admin", "owner", "dealer"];
const httpError = (statusCode, message) => Object.assign(new Error(message), { statusCode });

// Admin-only: creates the sign-in (Cognito) and the role record (Users table) together.
// The password goes to Cognito only and is never stored in DynamoDB.
export async function create(event) {
  try {
    await requireAdmin(event);
    const { email, name, role, password } = parseBody(event);

    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw httpError(400, "A valid email is required");
    if (!ROLES.includes(role)) throw httpError(400, `Role must be one of: ${ROLES.join(", ")}`);
    if (typeof password !== "string" || password.length < 8) throw httpError(400, "Password must be at least 8 characters");

    let userId;
    try {
      const created = await cognito.send(new AdminCreateUserCommand({
        UserPoolId: process.env.COGNITO_POOL_ID,
        Username: email,
        MessageAction: "SUPPRESS",
        UserAttributes: [
          { Name: "email", Value: email },
          { Name: "email_verified", Value: "true" },
          { Name: "custom:role", Value: role },
        ],
      }));
      userId = created.User?.Attributes?.find((a) => a.Name === "sub")?.Value;
    } catch (e) {
      if (e.name === "UsernameExistsException") throw httpError(409, "A user with this email already exists");
      throw e;
    }

    try {
      await cognito.send(new AdminSetUserPasswordCommand({
        UserPoolId: process.env.COGNITO_POOL_ID, Username: email, Password: password, Permanent: true,
      }));
      const item = { userId, email, name: name || email.split("@")[0], role, createdAt: new Date().toISOString() };
      await docClient.send(new PutCommand({ TableName: TABLE(), Item: item }));
      return json(201, item);
    } catch (e) {
      // Don't leave a half-created login behind.
      await cognito.send(new AdminDeleteUserCommand({ UserPoolId: process.env.COGNITO_POOL_ID, Username: email })).catch(() => {});
      if (e.name === "InvalidPasswordException") throw httpError(400, e.message || "Password does not meet the policy");
      throw e;
    }
  } catch (e) {
    return errorResponse(e);
  }
}

export async function list(event) {
  try {
    await requireAdmin(event);
    const Items = await scanAll({ TableName: TABLE() });
    return json(200, Items || []);
  } catch (e) {
    return errorResponse(e);
  }
}

export async function get(event) {
  try {
    const claims = await requireAuth(event);
    const { userId } = event.pathParameters;
    if (claims.sub !== userId && claims["custom:role"] !== "admin") {
      throw new AuthError(403, "Cannot view another user's profile");
    }
    const { Item } = await docClient.send(new GetCommand({ TableName: TABLE(), Key: { userId } }));
    if (!Item) return json(404, { error: "User not found" });
    return json(200, Item);
  } catch (e) {
    return errorResponse(e);
  }
}

export async function update(event) {
  try {
    await requireAdmin(event);
    const { userId } = event.pathParameters;
    const body = parseBody(event);
    await docClient.send(new PutCommand({ TableName: TABLE(), Item: { ...body, userId } }));
    return json(200, { ...body, userId });
  } catch (e) {
    return errorResponse(e);
  }
}

export async function remove(event) {
  try {
    await requireAdmin(event);
    const { userId } = event.pathParameters;
    await docClient.send(new DeleteCommand({ TableName: TABLE(), Key: { userId } }));
    return json(200, { success: true });
  } catch (e) {
    return errorResponse(e);
  }
}
