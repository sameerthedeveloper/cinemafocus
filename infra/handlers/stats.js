import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "../lib/aws/dynamo.js";
import { requireRole, errorResponse } from "../lib/aws/authz.js";
import { json } from "../lib/http.js";
import { ValidationError } from "../lib/aws/validators.js";
import { rateLimit } from "../lib/aws/ratelimit.js";

const TABLE = () => process.env.STATS_TABLE;

export async function get(event) {
  try {
    await requireRole(event, ["admin", "owner"]);
    const { date } = event.pathParameters;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new ValidationError("date must be YYYY-MM-DD");
    const { Item } = await docClient.send(new GetCommand({ TableName: TABLE(), Key: { date } }));
    return json(200, Item || { date, count: 0 });
  } catch (e) {
    return errorResponse(e);
  }
}

// Public, increment-only — no arbitrary write is possible through this handler.
export async function increment(event) {
  try {
    // The client cannot choose the key: always today's UTC date, so the table can't be
    // flooded with arbitrary items. Capped at 300 hits per minute for the whole route.
    await rateLimit("stats", "all", { limit: 300, windowSec: 60 });
    const date = new Date().toISOString().slice(0, 10);

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
