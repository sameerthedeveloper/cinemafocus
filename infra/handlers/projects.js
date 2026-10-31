import { PutCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { docClient, scanAll } from "../lib/aws/dynamo.js";
import { requireAdmin, errorResponse } from "../lib/aws/authz.js";
import { json, parseBody } from "../lib/http.js";
import { pick, pathId, assertItemSize } from "../lib/validate.js";
import { PROJECT_FIELDS } from "../lib/schemas.js";

const TABLE = () => process.env.PROJECTS_TABLE;

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
    const body = assertItemSize({ ...pick(raw, PROJECT_FIELDS), projectId: pathId(raw.projectId, "projectId") });
    await docClient.send(new PutCommand({ TableName: TABLE(), Item: body }));
    return json(201, body);
  } catch (e) {
    return errorResponse(e);
  }
}

export async function update(event) {
  try {
    await requireAdmin(event);
    const { projectId } = event.pathParameters;
    const body = assertItemSize(pick(parseBody(event), PROJECT_FIELDS));
    await docClient.send(new PutCommand({ TableName: TABLE(), Item: { ...body, projectId } }));
    return json(200, { ...body, projectId });
  } catch (e) {
    return errorResponse(e);
  }
}

export async function remove(event) {
  try {
    await requireAdmin(event);
    const { projectId } = event.pathParameters;
    await docClient.send(new DeleteCommand({ TableName: TABLE(), Key: { projectId } }));
    return json(200, { success: true });
  } catch (e) {
    return errorResponse(e);
  }
}
