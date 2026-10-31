import { createHash } from "crypto";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "./dynamo.js";

// Fixed-window counter kept in the Stats table under a "rl#" key. Those keys can never be read
// through GET /stats/{date} (dates are validated) and expire via the table's TTL on `expiresAt`.
// API Gateway sees only the Vercel server's IP, so limits are keyed by what the request is about
// (an email, or the route as a whole), not by client IP.
export class RateLimitError extends Error {
  constructor(retryAfter) {
    super("Too many requests, try again later");
    this.statusCode = 429;
    this.retryAfter = retryAfter;
  }
}

export async function rateLimit(scope, identity, { limit, windowSec }) {
  const now = Math.floor(Date.now() / 1000);
  const window = Math.floor(now / windowSec);
  const id = createHash("sha256").update(String(identity ?? "")).digest("hex").slice(0, 24);
  const { Attributes } = await docClient.send(new UpdateCommand({
    TableName: process.env.STATS_TABLE,
    Key: { date: `rl#${scope}#${id}#${window}` },
    UpdateExpression: "ADD #c :one SET expiresAt = :exp",
    ExpressionAttributeNames: { "#c": "count" },
    ExpressionAttributeValues: { ":one": 1, ":exp": (window + 2) * windowSec },
    ReturnValues: "UPDATED_NEW",
  }));
  if (Attributes.count > limit) throw new RateLimitError((window + 1) * windowSec - now);
}
