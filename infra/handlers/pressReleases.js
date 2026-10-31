import { GetCommand, PutCommand, DeleteCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { docClient, scanAll } from "../lib/aws/dynamo.js";
import { requireAdmin, errorResponse } from "../lib/aws/authz.js";
import { json, parseBody } from "../lib/http.js";
import { pick, pathId, assertItemSize } from "../lib/validate.js";
import { PRESS_FIELDS } from "../lib/schemas.js";

const TABLE = () => process.env.PRESS_RELEASES_TABLE;

export async function list() {
  try {
    const Items = await scanAll({ TableName: TABLE() });
    return json(200, Items || []);
  } catch (e) {
    return errorResponse(e);
  }
}

export async function get(event) {
  try {
    const { pressId } = event.pathParameters;

    const { Items } = await docClient.send(new QueryCommand({
      TableName: TABLE(),
      IndexName: "slug-index",
      KeyConditionExpression: "slug = :s",
      ExpressionAttributeValues: { ":s": pressId },
    }));
    if (Items && Items.length > 0) return json(200, Items[0]);

    const { Item } = await docClient.send(new GetCommand({ TableName: TABLE(), Key: { pressId } }));
    if (!Item) return json(404, { error: "Press release not found" });
    return json(200, Item);
  } catch (e) {
    return errorResponse(e);
  }
}

export async function create(event) {
  try {
    await requireAdmin(event);
    const raw = parseBody(event);
    const body = assertItemSize({ ...pick(raw, PRESS_FIELDS), pressId: pathId(raw.pressId, "pressId") });
    await docClient.send(new PutCommand({ TableName: TABLE(), Item: body }));
    return json(201, body);
  } catch (e) {
    return errorResponse(e);
  }
}

export async function update(event) {
  try {
    await requireAdmin(event);
    const { pressId } = event.pathParameters;
    const body = assertItemSize(pick(parseBody(event), PRESS_FIELDS));
    await docClient.send(new PutCommand({ TableName: TABLE(), Item: { ...body, pressId } }));
    return json(200, { ...body, pressId });
  } catch (e) {
    return errorResponse(e);
  }
}

export async function remove(event) {
  try {
    await requireAdmin(event);
    const { pressId } = event.pathParameters;
    await docClient.send(new DeleteCommand({ TableName: TABLE(), Key: { pressId } }));
    return json(200, { success: true });
  } catch (e) {
    return errorResponse(e);
  }
}
