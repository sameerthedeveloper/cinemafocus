import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
export const docClient = DynamoDBDocumentClient.from(client);

// A single Scan/Query returns at most 1MB; follow LastEvaluatedKey so list
// endpoints never silently truncate.
async function paginate(Command, params) {
  const items = [];
  let ExclusiveStartKey;
  do {
    const page = await docClient.send(new Command({ ...params, ExclusiveStartKey }));
    items.push(...(page.Items || []));
    ExclusiveStartKey = page.LastEvaluatedKey;
  } while (ExclusiveStartKey);
  return items;
}

export const scanAll = (params) => paginate(ScanCommand, params);
export const queryAll = (params) => paginate(QueryCommand, params);
