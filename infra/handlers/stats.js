import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "../lib/aws/dynamo.js";
import { requireAdmin, errorResponse } from "../lib/aws/authz.js";
import { json, parseBody } from "../lib/http.js";

const TABLE = () => process.env.STATS_TABLE;

export async function get(event) {
  try {
    await requireAdmin(event);
    const { date } = event.pathParameters;
    const { Item } = await docClient.send(new GetCommand({ TableName: TABLE(), Key: { date } }));
    return json(200, Item || { date, count: 0 });
  } catch (e) {
    return errorResponse(e);
  }
}

// Public, increment-only — no arbitrary write is possible through this handler.
export async function increment(event) {
  try {
    const body = event.body ? parseBody(event) : {};
    const date = body.date || new Date().toISOString().slice(0, 10);

    const { Attributes } = await docClient.send(new UpdateCommand({
      TableName: TABLE(),
      Key: { date },
      UpdateExpression: "ADD #c :inc SET updatedAt = :now",
      ExpressionAttributeNames: { "#c": "count" },
      ExpressionAttributeValues: { ":inc": 1, ":now": new Date().toISOString() },
      ReturnValues: "ALL_NEW",
    }));

    return json(200, Attributes);
  } catch (e) {
    return errorResponse(e);
  }
}
