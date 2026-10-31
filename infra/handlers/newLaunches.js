import { PutCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { docClient, scanAll } from "../lib/aws/dynamo.js";
import { requireAdmin, errorResponse } from "../lib/aws/authz.js";
import { assertProductExists } from "../lib/aws/validators.js";
import { json, parseBody } from "../lib/http.js";
import { pick, pathId, assertItemSize } from "../lib/validate.js";
import { LAUNCH_FIELDS } from "../lib/schemas.js";

const TABLE = () => process.env.NEW_LAUNCHES_TABLE;

export async function list() {
  try {
    const Items = await scanAll({ TableName: TABLE() });
    return json(200, Items || []);
  } catch (e) {
    return errorResponse(e);
  }
}

export async function create(event) {
  try {
    await requireAdmin(event);
    const raw = parseBody(event);
    const body = assertItemSize({ ...pick(raw, LAUNCH_FIELDS), launchId: pathId(raw.launchId, "launchId") });
    await assertProductExists(body.originalProductId); // throws 400 if dangling ref
    await docClient.send(new PutCommand({ TableName: TABLE(), Item: body }));
    return json(201, body);
  } catch (e) {
    return errorResponse(e);
  }
}

export async function update(event) {
  try {
    await requireAdmin(event);
    const { launchId } = event.pathParameters;
    const body = assertItemSize(pick(parseBody(event), LAUNCH_FIELDS));
    await assertProductExists(body.originalProductId);
    await docClient.send(new PutCommand({ TableName: TABLE(), Item: { ...body, launchId } }));
    return json(200, { ...body, launchId });
  } catch (e) {
    return errorResponse(e);
  }
}

export async function remove(event) {
  try {
    await requireAdmin(event);
    const { launchId } = event.pathParameters;
    await docClient.send(new DeleteCommand({ TableName: TABLE(), Key: { launchId } }));
    return json(200, { success: true });
  } catch (e) {
    return errorResponse(e);
  }
}
