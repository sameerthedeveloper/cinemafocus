import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "../lib/aws/dynamo.js";
import { requireAdmin, errorResponse } from "../lib/aws/authz.js";
import { json, parseBody } from "../lib/http.js";

const TABLE = () => process.env.SITE_SETTINGS_TABLE;

export async function get(event) {
  try {
    const { settingId } = event.pathParameters;
    const { Item } = await docClient.send(new GetCommand({ TableName: TABLE(), Key: { settingId } }));
    if (!Item) return json(404, { error: "Setting not found" });
    return json(200, Item);
  } catch (e) {
    return errorResponse(e);
  }
}

export async function update(event) {
  try {
    await requireAdmin(event);
    const { settingId } = event.pathParameters;
    const body = parseBody(event);
    const item = { settingId, data: body.data, updatedAt: new Date().toISOString() };
    await docClient.send(new PutCommand({ TableName: TABLE(), Item: item }));
    return json(200, item);
  } catch (e) {
    return errorResponse(e);
  }
}
