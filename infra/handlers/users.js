import { GetCommand, PutCommand, DeleteCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "../lib/aws/dynamo.js";
import { requireAuth, requireAdmin, AuthError, errorResponse } from "../lib/aws/authz.js";
import { json, parseBody } from "../lib/http.js";

const TABLE = () => process.env.USERS_TABLE;

export async function list(event) {
  try {
    await requireAdmin(event);
    const { Items } = await docClient.send(new ScanCommand({ TableName: TABLE() }));
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
