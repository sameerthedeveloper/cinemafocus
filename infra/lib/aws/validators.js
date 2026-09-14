import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "./dynamo.js";

export async function assertProductExists(productId) {
  if (!productId) return; // FK is nullable (ON DELETE SET NULL in source schema)
  const { Item } = await docClient.send(new GetCommand({
    TableName: process.env.PRODUCTS_TABLE,
    Key: { productId },
  }));
  if (!Item) {
    throw new ValidationError(`original_product_id "${productId}" does not exist in Products`);
  }
}

export class ValidationError extends Error {
  constructor(message) { super(message); this.statusCode = 400; }
}
