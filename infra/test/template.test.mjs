import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const yml = readFileSync(new URL("../serverless.yml", import.meta.url), "utf8");
const has = (re) => assert.match(yml, re);

test("isolation: no store resources or other-account references", () => {
  assert.doesNotMatch(yml, /cinemafocus-store|CinemaFocusStore|756367305158|5sp3yjfig9|JZ4TuJBrW/i);
});
test("CORS is explicit, never a wildcard", () => {
  assert.doesNotMatch(yml, /allowedOrigins:\s*\n\s*- ['"]?\*/);
  has(/allowedOrigins:\s*\n\s*- https:\/\/cinemafocus\.in/);
});
test("API throttling is configured on the sensitive routes", () => {
  for (const r of ["POST /auth/login", "POST /messages", "POST /upload/presign", "POST /stats/increment"]) {
    assert.ok(yml.includes(`"${r}":`), `${r} has no throttle`);
  }
});
test("Cognito: public signup closed, role not client-writable", () => {
  has(/AllowAdminCreateUserOnly: true/);
  has(/PreventUserExistenceErrors: ENABLED/);
  const client = yml.split("CognitoUserPoolClient:")[1].split("# --- S3")[0];
  assert.doesNotMatch(client, /^\s*- custom:role\s*$/m);
  has(/WriteAttributes:\s*\n\s*- email/);
});
test("every DynamoDB table has PITR and deletion protection", () => {
  const tables = yml.match(/Type: AWS::DynamoDB::Table/g).length;
  assert.equal(tables, 9);
  assert.equal(yml.match(/PointInTimeRecoveryEnabled: true/g)?.length, tables);
  assert.equal(yml.match(/DeletionProtectionEnabled: true/g)?.length, tables);
});
test("images bucket stays private behind OAC", () => {
  has(/BlockPublicPolicy: true/);
  has(/RestrictPublicBuckets: true/);
  assert.doesNotMatch(yml, /Principal: "\*"/);
  has(/Service: cloudfront\.amazonaws\.com/);
});
test("alarms notify the main-site SNS topic; logs expire", () => {
  assert.equal(yml.match(/- !Ref AlertsTopic/g)?.length, 2);
  has(/logRetentionInDays: 30/);
});
test("IAM policy never references store ARNs", () => {
  const iam = yml.split("iam:")[1].split("custom:")[0];
  assert.doesNotMatch(iam, /store/i);
});
