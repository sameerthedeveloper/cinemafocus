import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// Every Lambda in serverless.yml, minus the ones that are public by design, must refuse a
// request with no token before touching AWS. Public routes are listed explicitly so a new
// route is protected unless someone deliberately adds it here.
const PUBLIC = new Set([
  "auth.login", "auth.refresh",
  "products.list", "products.get", "categories.list", "newLaunches.list",
  "pressReleases.list", "pressReleases.get", "projects.list", "siteSettings.get",
  "messages.create", "stats.increment",
]);

const yml = readFileSync(new URL("../serverless.yml", import.meta.url), "utf8");
const handlers = [...yml.matchAll(/handler: handlers\/(\w+)\.(\w+)/g)].map((m) => [m[1], m[2]]);

test("serverless.yml declares the expected 39 handlers", () => {
  assert.equal(handlers.length, 39);
});

for (const [file, fn] of handlers) {
  const name = `${file}.${fn}`;
  if (PUBLIC.has(name)) continue;
  test(`protected: ${name} rejects a request without a token`, async () => {
    const mod = await import(`../handlers/${file}.js`);
    const res = await mod[fn]({ headers: {}, pathParameters: {}, body: "{}" });
    assert.equal(res.statusCode, 401, `${name} returned ${res.statusCode}`);
  });
}

test("protected: a malformed Authorization header is rejected", async () => {
  const mod = await import("../handlers/users.js");
  const res = await mod.list({ headers: { authorization: "Bearer not.a.jwt" } });
  assert.ok([401, 500].includes(res.statusCode)); // 500 only when COGNITO_* env is absent locally
  assert.notEqual(res.statusCode, 200);
});
