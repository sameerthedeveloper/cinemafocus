import { PutCommand, UpdateCommand, DeleteCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";
import { docClient } from "../lib/aws/dynamo.js";
import { requireAdmin, errorResponse } from "../lib/aws/authz.js";
import { json, parseBody } from "../lib/http.js";

const TABLE = () => process.env.MESSAGES_TABLE;

// Public insert only — contact form. No auth check by design (per authz policy table).
export async function create(event) {
  try {
    const body = parseBody(event);
    const item = {
      messageId: randomUUID(),
      name: body.name,
      email: body.email,
      subject: body.subject,
      text: body.text,
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
    await requireAdmin(event);
    const { Items } = await docClient.send(new ScanCommand({ TableName: TABLE() }));
    return json(200, Items || []);
  } catch (e) {
    return errorResponse(e);
  }
}

export async function update(event) {
  try {
    await requireAdmin(event);
    const { messageId } = event.pathParameters;
    const body = parseBody(event);
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
