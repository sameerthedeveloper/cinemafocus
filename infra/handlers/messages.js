import { PutCommand, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";
import { docClient, scanAll } from "../lib/aws/dynamo.js";
import { requireAdmin, requireRole, errorResponse } from "../lib/aws/authz.js";
import { json, parseBody } from "../lib/http.js";
import { pick, str, email, oneOf } from "../lib/validate.js";
import { MESSAGE_STATUSES } from "../lib/schemas.js";
import { rateLimit } from "../lib/aws/ratelimit.js";

const TABLE = () => process.env.MESSAGES_TABLE;

// Public insert only — contact form. No auth check by design (per authz policy table).
export async function create(event) {
  try {
    // Whole-route cap (the API only ever sees Vercel's IP): 20 submissions per 10 minutes.
    await rateLimit("messages", "all", { limit: 20, windowSec: 600 });
    const body = pick(parseBody(event), ["name", "email", "subject", "text"]);
    const item = {
      messageId: randomUUID(),
      name: str(body.name, "name", { required: true, max: 100 }),
      email: email(body.email),
      subject: str(body.subject, "subject", { max: 200 }) ?? "",
      text: str(body.text, "text", { required: true, max: 5000 }),
      status: "unread",
      createdAt: new Date().toISOString(),
    };
    await docClient.send(new PutCommand({ TableName: TABLE(), Item: item }));
    return json(201, item);
  } catch (e) {
    return errorResponse(e);
  }
}

export async function list(event) {
  try {
    await requireRole(event, ["admin", "owner"]);
    const Items = await scanAll({ TableName: TABLE() });
    return json(200, Items || []);
  } catch (e) {
    return errorResponse(e);
  }
}

export async function update(event) {
  try {
    await requireAdmin(event);
    const { messageId } = event.pathParameters;
    const body = pick(parseBody(event), ["status"]);
    oneOf(body.status, MESSAGE_STATUSES, "status");
    await docClient.send(new UpdateCommand({
      TableName: TABLE(),
      Key: { messageId },
      UpdateExpression: "SET #status = :status",
      ExpressionAttributeNames: { "#status": "status" },
      ExpressionAttributeValues: { ":status": body.status },
    }));
    return json(200, { success: true });
  } catch (e) {
    return errorResponse(e);
  }
}

export async function remove(event) {
  try {
    await requireAdmin(event);
    const { messageId } = event.pathParameters;
    await docClient.send(new DeleteCommand({ TableName: TABLE(), Key: { messageId } }));
    return json(200, { success: true });
  } catch (e) {
    return errorResponse(e);
  }
}
