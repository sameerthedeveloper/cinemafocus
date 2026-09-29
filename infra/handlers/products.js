import { GetCommand, PutCommand, UpdateCommand, DeleteCommand, ScanCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "../lib/aws/dynamo.js";
import { requireAdmin, errorResponse } from "../lib/aws/authz.js";
import { json, parseBody } from "../lib/http.js";

const TABLE = () => process.env.PRODUCTS_TABLE;
const NEW_LAUNCHES_TABLE = () => process.env.NEW_LAUNCHES_TABLE;

export async function list(event) {
  try {
    const category = event.queryStringParameters?.category;
    if (category) {
      const { Items } = await docClient.send(new QueryCommand({
        TableName: TABLE(),
        IndexName: "category-index",
        KeyConditionExpression: "category = :c",
        ExpressionAttributeValues: { ":c": category },
      }));
      return json(200, Items || []);
    }
    const { Items } = await docClient.send(new ScanCommand({ TableName: TABLE() }));
    return json(200, Items || []);
  } catch (e) {
    return errorResponse(e);
  }
}

export async function get(event) {
  try {
    const { productId } = event.pathParameters;
    const { Item } = await docClient.send(new GetCommand({ TableName: TABLE(), Key: { productId } }));
    if (!Item) return json(404, { error: "Product not found" });
    return json(200, Item);
  } catch (e) {
    return errorResponse(e);
  }
}

export async function create(event) {
  try {
    await requireAdmin(event);
    const body = parseBody(event);
    await docClient.send(new PutCommand({ TableName: TABLE(), Item: body }));
    return json(201, body);
  } catch (e) {
    return errorResponse(e);
  }
}

export async function update(event) {
  try {
    await requireAdmin(event);
    const { productId } = event.pathParameters;
    const body = parseBody(event);
    await docClient.send(new PutCommand({ TableName: TABLE(), Item: { ...body, productId } }));
    return json(200, { ...body, productId });
  } catch (e) {
    return errorResponse(e);
  }
}

export async function remove(event) {
  try {
    await requireAdmin(event);
    const { productId } = event.pathParameters;

    await docClient.send(new DeleteCommand({ TableName: TABLE(), Key: { productId } }));

    // Replicate ON DELETE SET NULL: null out originalProductId on any NewLaunches referencing this product
    const { Items } = await docClient.send(new ScanCommand({
      TableName: NEW_LAUNCHES_TABLE(),
      FilterExpression: "originalProductId = :pid",
      ExpressionAttributeValues: { ":pid": productId },
    }));

    for (const item of Items || []) {
      await docClient.send(new UpdateCommand({
        TableName: NEW_LAUNCHES_TABLE(),
        Key: { launchId: item.launchId },
        UpdateExpression: "REMOVE originalProductId",
      }));
    }

    return json(200, { success: true });
  } catch (e) {
    return errorResponse(e);
  }
}
